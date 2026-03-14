编写一个图片上传插件，支持点击/拖拽上传，上传成功后插入可缩放图片。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `src/tiptap-extension/ImageUpload.tsx` | 扩展节点定义 |
| `src/tiptap-extension/ImageUploadView.vue` | NodeView 组件 |
| `src/tiptap-ui/ImageButton.tsx` | 工具栏按钮 |
| `src/App.vue` | 编辑器初始化 |
| `src/editor.scss` | 样式 |

---

## 架构：两阶段上传

1. 点击工具栏按钮 → 在光标处插入 `imageUpload` 占位节点
2. 占位节点渲染拖拽上传 UI，用户选文件后执行上传
3. 上传成功 → 删除占位节点，替换为真正的 `image` 节点（支持缩放）

`Image` 扩展（渲染/缩放）与 `ImageUpload` 扩展（上传 UI）职责分离。

---

## ImageUpload.tsx

独立 `Node.create<ImageUploadOptions>`，不继承 Image 扩展。

**Options：**
| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `type` | `string \| NodeType` | `'image'` | 上传成功后插入的节点类型 |
| `accept` | `string` | `'image/*'` | 文件选择器过滤 |
| `limit` | `number` | `1` | 最大文件数 |
| `maxSize` | `number` | `0` | 最大文件大小（字节，0 为不限制） |
| `upload` | `(file) => Promise<string>` | FileReader base64 | 上传函数 |
| `onError` | `(error) => void` | - | 错误回调 |
| `onSuccess` | `(url) => void` | - | 成功回调 |

**关键实现：**
- `atom: true`、`selectable: true`、`draggable: true`
- `addAttributes()`：将 accept/limit/maxSize 存入节点属性，NodeView 从 `props.node.attrs` 读取
- `addNodeView()`：`VueNodeViewRenderer(ImageUploadView)`
- `addCommands()`：`setImageUploadNode` → `insertContent({ type: this.name })`
- `addKeyboardShortcuts()`：Enter 键触发已选中的上传节点点击
- `declare module '@tiptap/core'`：扩展 `Commands` 接口声明 `setImageUploadNode`

---

## ImageUploadView.vue

Vue NodeView 组件，使用 `nodeViewProps` + `NodeViewWrapper`。

**状态：**
- 无文件：显示拖拽区域，支持 dragover/drop，点击触发隐藏 `<input type="file">`
- 上传中：显示文件列表 + 进度，可移除单个文件
- 上传成功：调用 `editor.chain().deleteRange(...).insertContentAt(pos, imageNodes).run()` 替换占位节点

**上传逻辑：**
- 从 `props.extension.options.upload` 读取上传函数
- maxSize > 0 时校验文件大小
- files.length > limit 时拒绝并报错
- 上传结果通过 `onSuccess` / `onError` 回调透出

---

## ImageButton.tsx

注入 editor，点击时调用 `editor.commands.setImageUploadNode()`。

---

## App.vue

分别注册两个扩展：

```ts
Image.configure({ allowBase64: true, resize: { enabled: true } }),
ImageUpload,
```

- `Image`：负责渲染最终图片节点，`allowBase64: true` 支持 base64 src，`resize: { enabled: true }` 启用拖拽缩放（v3 API，非 `resizable: true`）
- `ImageUpload`：默认 upload 函数用 FileReader 返回 base64，可通过 `.configure({ upload })` 替换为服务端上传

---

## editor.scss

### resize handles
```scss
[data-resize-handle] { width: 8px; height: 8px; border-radius: 50%; ... }
```
`ResizableNodeView` 创建的 handle 默认无尺寸和样式，需手动补充。按 `data-resize-handle` 方向设置对应 cursor（`nwse-resize` / `nesw-resize`）。

### img pointer-events
```scss
[data-resize-wrapper] img { pointer-events: none; user-select: none; }
```
`<img>` 默认捕获鼠标事件，导致覆盖在其上的 handles 无法响应 `mousedown`，必须禁用。

### 图片选中边框
```scss
.ProseMirror-selectednode [data-resize-wrapper] { outline: 2px solid #409eff; }
```
targeting `[data-resize-wrapper]` 而非 `img`，因为 resize 启用时 img 被包裹在 wrapper 内。

### 上传区域
`.tiptap-image-upload`：拖拽虚线边框、drag-active 状态、上传进度条、文件预览列表。
`.ProseMirror-selectednode .tiptap-image-upload-drag-area`：节点选中时显示蓝色边框。
