# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

查阅 @README.md 以了解项目概述

## 命令

```bash
pnpm dev          # 启动开发服务器 (http://localhost:5174)
pnpm build        # 类型检查 + 构建应用 (输出到 dist-app/)
pnpm build:lib    # 类型检查 + 构建库 (ES + UMD 格式，输出到 dist/)
pnpm preview      # 预览生产构建
```

TypeScript 类型检查单独运行：`vue-tsc --noEmit`

## 架构

这是一个 Vue 3 富文本编辑器库，发布为 `@mario9/tiptap-editor`。

**双构建模式**（`vite.config.ts`）：
- 应用模式（`pnpm build`）：构建演示应用到 `dist-app/`
- 库模式（`pnpm build:lib`）：构建可发布的 ES + UMD 包到 `dist/`，外部化 vue、element-plus、@tiptap/*、katex、lowlight

**编辑器状态共享**：`TiptapEditor.vue` 通过 `provide` 向下传递两个值：
- `editor`（`ShallowRef<Editor>`）：Tiptap 编辑器实例
- `openMathDialog`：打开数学公式对话框的函数

工具栏中的所有子组件通过 `inject('editor')` 获取编辑器实例来执行命令。

**自定义扩展**（`src/tiptap-extension/`）：
- `ImageWithAlign`：扩展 Tiptap Image，添加 `align` 属性（left/center/right），通过 ProseMirror decoration 渲染对齐样式
- `ImageUpload`：自定义节点，渲染上传 UI；选项包括 `accept`、`limit`、`maxSize`、`upload` 回调；上传成功后将自身替换为真实图片节点

**工具栏组件**（`src/tiptap-ui/`）：每个文件对应一组相关按钮，均为 TSX 组件，通过 `inject` 获取编辑器实例。`TableControls.tsx` 最复杂，处理列/行的移动、插入、删除。`BubbleMenuBar.tsx` 是浮动气泡菜单，不在工具栏中，而是在 `<EditorContent>` 之后渲染，选中文本时自动出现。

**图标**（`src/tiptap-icons/`）：纯 SVG TSX 组件，无外部依赖。

**库导出**（`src/index.ts`）：导出 `TiptapEditor`、`IconButton`、`ImageWithAlign`，以及 `UploadFn` 类型。

`TiptapEditor` 接受三个 props：`modelValue`（HTML 字符串）、`placeholder`、`upload`（`UploadFn`，可选，默认 Base64）。

**代码高亮**：使用 `@tiptap/extension-code-block-lowlight` + `lowlight`（common 语言包），StarterKit 中禁用了默认 codeBlock。`lowlight` 已外部化，消费方需自行安装。

**Placeholder**：从独立包 `@tiptap/extension-placeholder` 导入，不再从聚合包 `@tiptap/extensions` 导入。