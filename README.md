# @mario9/tiptap-editor

基于 Tiptap + Vue 3 的富文本编辑器组件。

## 安装

```bash
pnpm add @mario9/tiptap-editor
```

安装 peer dependencies：

```bash
pnpm add vue element-plus katex @tiptap/core @tiptap/starter-kit @tiptap/vue-3 @tiptap/pm @tiptap/extensions @tiptap/extension-highlight @tiptap/extension-horizontal-rule @tiptap/extension-image @tiptap/extension-list @tiptap/extension-mathematics @tiptap/extension-subscript @tiptap/extension-superscript @tiptap/extension-table @tiptap/extension-text-align @tiptap/extension-typography
```

## 快速开始

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { TiptapEditor } from '@mario9/tiptap-editor'
import '@mario9/tiptap-editor/tiptap-editor.css'

const content = ref('')
</script>

<template>
  <TiptapEditor v-model="content" placeholder="请输入内容..." />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `modelValue` | `string` | `''` | 编辑器内容（HTML 格式），支持 `v-model` 双向绑定 |
| `placeholder` | `string` | `'请输入内容...'` | 编辑器占位符文本 |
| `upload` | `(file: File) => Promise<string>` | Base64 转换 | 图片上传函数，返回图片 URL |

## 自定义图片上传

不传 `upload` 时，图片默认转为 Base64 Data URL。传入自定义函数可将图片上传到服务器：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { TiptapEditor, type UploadFn } from '@mario9/tiptap-editor'
import '@mario9/tiptap-editor/tiptap-editor.css'

const content = ref('')

const upload: UploadFn = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch('/api/upload', { method: 'POST', body: formData })
  const data = await res.json()
  return data.url
}
</script>

<template>
  <TiptapEditor v-model="content" :upload="upload" />
</template>
```

## 内置功能

- 撤销 / 重做
- 文本样式：粗体、斜体、删除线、下划线、行内代码
- 标题（H1–H6）
- 列表：有序、无序、任务列表
- 文本对齐：左、中、右、两端
- 链接（点击弹出编辑框）
- 图片插入（支持自定义上传函数，默认转为 Base64）
- 表格（含行列增删、移动操作）
- 数学公式（内联 / 块级，基于 KaTeX）

## 技术栈

- vue 3.5.25
- element-plus 2.13.3
- @tiptap/core 3.20.0

## 代码结构

```
src/
├── App.vue                   # 初始化编辑器，渲染工具栏 + 编辑器内容
├── editor.scss               # 工具栏和编辑器样式
├── components/
│   └── IconButton.tsx        # 基础按钮，包裹 ElButton 和 ElTooltip
├── tiptap-ui/                # 工具栏按钮组
│   ├── UndoRedoButton.tsx    # 撤销重做
│   ├── TextStyleButton.tsx   # 加粗、斜体、删除线、下划线、链接
│   ├── TextAlignButton.tsx   # 左边对齐、中间对齐、右边对齐、两端对齐
│   ├── ListButton.tsx        # 无序列表、有序列表、任务列表
│   └── ImageButton.tsx       # 图片上传
├── tiptap-icons/             # SVG 图标组件 (TSX)
└── tiptap-extension/         # Tiptap extensions
```
