# @mario9/tiptap-editor

基于 Tiptap + Vue 3 的富文本编辑器组件，支持 Feature Plugin 架构，消费方可按需引入功能模块实现 tree-shaking。

## 安装

```bash
pnpm add @mario9/tiptap-editor
```

安装 peer dependencies：

```bash
pnpm add vue element-plus katex lowlight @tiptap/core @tiptap/starter-kit @tiptap/vue-3 @tiptap/pm @tiptap/extensions @tiptap/extension-bubble-menu @tiptap/extension-code-block-lowlight @tiptap/extension-highlight @tiptap/extension-horizontal-rule @tiptap/extension-image @tiptap/extension-list @tiptap/extension-mathematics @tiptap/extension-placeholder @tiptap/extension-subscript @tiptap/extension-superscript @tiptap/extension-table @tiptap/extension-text-align @tiptap/extension-typography
```

## 快速开始

不传 `features` 时编辑器只有基础输入能力（无工具栏）。通过 `:features` 按需组合功能：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  TiptapEditor,
  UndoRedoFeature,
  TextStyleFeature,
  TextAlignFeature,
  ListFeature,
  CodeBlockFeature,
  TableFeature,
  MathFeature,
  ImageFeature,
  SeparatorFeature,
} from '@mario9/tiptap-editor'
import '@mario9/tiptap-editor/tiptap-editor.css'

const content = ref('')
</script>

<template>
  <TiptapEditor
    v-model="content"
    :features="[
      UndoRedoFeature,
      TextStyleFeature,
      SeparatorFeature,
      TextAlignFeature,
      ListFeature,
      CodeBlockFeature,
      SeparatorFeature,
      TableFeature,
      MathFeature,
      ImageFeature(),
    ]"
  />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `modelValue` | `string` | `''` | 编辑器内容（HTML 格式），支持 `v-model` 双向绑定 |
| `placeholder` | `string` | `'请输入内容...'` | 编辑器占位符文本 |
| `readonly` | `boolean` | `false` | 只读模式：隐藏工具栏，禁止编辑 |
| `features` | `FeaturePlugin[]` | `[]` | 功能插件列表，决定工具栏内容和注册的扩展 |

## Feature Plugins

| 导出名 | 说明 | 用法 |
|--------|------|------|
| `UndoRedoFeature` | 撤销 / 重做 | `UndoRedoFeature` |
| `TextStyleFeature` | 粗体、斜体、删除线、下划线、链接 | `TextStyleFeature` |
| `TextAlignFeature` | 文本对齐（左 / 中 / 右 / 两端） | `TextAlignFeature` |
| `ListFeature` | 有序、无序、任务列表 | `ListFeature` |
| `CodeBlockFeature` | 代码块（含语法高亮） | `CodeBlockFeature` |
| `TableFeature` | 表格（含行列增删、移动） | `TableFeature` |
| `MathFeature` | 数学公式（内联 / 块级，基于 KaTeX） | `MathFeature` |
| `ImageFeature` | 图片插入（支持自定义上传，默认 Base64） | `ImageFeature(uploadFn?)` |
| `SeparatorFeature` | 工具栏分隔符 | `SeparatorFeature` |

`ImageFeature` 是工厂函数，接受可选的 `upload` 参数：

```typescript
import { ImageFeature, type UploadFn } from '@mario9/tiptap-editor'

const upload: UploadFn = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch('/api/upload', { method: 'POST', body: formData })
  const data = await res.json()
  return data.url
}

// 不传则默认转为 Base64
ImageFeature()
// 传入自定义上传函数
ImageFeature(upload)
```

## 自定义 Feature Plugin

实现 `FeaturePlugin` 接口即可创建自定义功能插件：

```typescript
import type { FeaturePlugin } from '@mario9/tiptap-editor'
import MyButton from './MyButton.vue'
import MyExtension from './MyExtension'

export const MyFeature: FeaturePlugin = {
  name: 'my-feature',
  install: () => ({
    extensions: [MyExtension],
  }),
  toolbarComponent: MyButton,
}
```

`install()` 接收 `PluginInstallContext`（含 `readonly` 和 `provide`），返回 `{ extensions, controlComponent? }`。

## 内置功能（始终启用）

以下功能无需通过 `features` 配置，始终注册：

- 标题（H1–H6）
- 段落、水平线
- 任务列表（TaskList / TaskItem）
- 文本对齐扩展（TextAlign）
- 链接（StarterKit 内置）
- 气泡菜单（选中文本时浮现）
- Placeholder

### 代码高亮

`CodeBlockFeature` 使用 `lowlight` 提供语法高亮，默认支持以下常见语言：

**Web 开发**: JavaScript, TypeScript, HTML, CSS, SCSS, JSON, XML  
**后端**: Python, Java, C, C++, C#, Go, Rust, PHP, Ruby, Swift, Kotlin  
**脚本/配置**: Bash, Shell, YAML, TOML, Makefile, Dockerfile  
**数据库**: SQL  
**其他**: Markdown, Diff, Plaintext

## 技术栈

- vue 3.5.25
- element-plus 2.13.3
- @tiptap/core 3.22.5

## 代码结构

```
src/
├── TiptapEditor.tsx          # 编辑器主组件（feature plugin 驱动）
├── editor.scss               # 工具栏和编辑器样式
├── features/                 # Feature plugin 实现
│   ├── UndoRedoFeature.ts
│   ├── TextStyleFeature.ts
│   ├── TextAlignFeature.ts
│   ├── ListFeature.ts
│   ├── CodeBlockFeature.ts
│   ├── TableFeature.ts
│   ├── MathFeature.ts        # 含对话框状态管理
│   ├── ImageFeature.ts       # 工厂函数，接受 upload 参数
│   └── SeparatorFeature.tsx
├── types/
│   └── plugin.ts             # FeaturePlugin 接口定义
├── components/
│   └── IconButton.tsx        # 基础按钮，包裹 ElButton 和 ElTooltip
├── tiptap-ui/                # 工具栏按钮组件（TSX）
├── tiptap-icons/             # SVG 图标组件（TSX）
└── tiptap-extension/         # 自定义 Tiptap 扩展
    ├── ImageWithAlign.ts     # 带对齐属性的图片扩展
    └── ImageUpload.tsx       # 图片上传节点
```
