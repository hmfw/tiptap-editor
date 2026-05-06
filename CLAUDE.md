# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

查阅 @README.md 以了解项目概述

## 命令

```bash
pnpm dev          # 启动开发服务器 (http://localhost:5173)
pnpm build        # 类型检查 + 构建应用 (输出到 dist-app/)
pnpm build:lib    # 类型检查 + 构建库 (ES + UMD 格式，输出到 dist/)
pnpm preview      # 预览生产构建
```

TypeScript 类型检查单独运行：`pnpm exec vue-tsc --noEmit`

## 架构

这是一个 Vue 3 富文本编辑器库，发布为 `@mario9/tiptap-editor`。

**双构建模式**（`vite.config.ts`）：
- 应用模式（`pnpm build`）：构建演示应用到 `dist-app/`
- 库模式（`pnpm build:lib`）：构建可发布的 ES + UMD 包到 `dist/`，外部化 vue、element-plus、@tiptap/*、katex、lowlight

**Feature Plugin 架构**：`TiptapEditor` 是一个轻量 shell，所有功能通过 `FeaturePlugin` 接口注入。消费方通过 `:features` prop 传入插件数组，决定工具栏内容和注册的 Tiptap 扩展。不传时只有基础编辑器（无工具栏）。

**FeaturePlugin 接口**（`src/types/plugin.ts`）：
```typescript
interface FeaturePlugin {
  name: string
  install: (ctx: PluginInstallContext) => PluginInstallResult
  toolbarComponent?: Component
}
```
- `install()` 在 `TiptapEditor` 的 `setup()` 内调用，可通过 `ctx.provide()` 注册 inject key
- 返回值中的 `controlComponent` 会被渲染在编辑器内容区之后（用于 TableControls、ImageControls、MathEditDialog 等浮层）

**编辑器状态共享**：`TiptapEditor` 通过 `provide` 向下传递：
- `editor`（`ShallowRef<Editor>`）：Tiptap 编辑器实例
- `readonly`（`ComputedRef<boolean>`）：只读状态
- `openMathDialog`：由 `MathFeature.install()` 通过 `ctx.provide()` 注册

工具栏中的所有子组件通过 `inject('editor')` 获取编辑器实例来执行命令。

**Feature 文件**（`src/features/`）：
- 简单 feature（UndoRedo、TextStyle、TextAlign、List）：只提供 `toolbarComponent`，不注册额外扩展（StarterKit 已包含）
- `CodeBlockFeature`：注册 `CodeBlockLowlight`（StarterKit 中禁用了默认 codeBlock）
- `TableFeature`：注册 Table/TableRow/TableHeader/TableCell，controlComponent 为 `TableControls`
- `MathFeature`：`install()` 内创建 per-instance refs，provide `openMathDialog`，返回闭包 `MathDialogWrapper` 作为 controlComponent
- `ImageFeature`：工厂函数，接受可选 `upload` 参数，controlComponent 为 `ImageControls`
- `SeparatorFeature`：工具栏分隔符伪插件

**自定义扩展**（`src/tiptap-extension/`）：
- `ImageWithAlign`：扩展 Tiptap Image，添加 `align` 属性（left/center/right），通过 ProseMirror decoration 渲染对齐样式
- `ImageUpload`：自定义节点，渲染上传 UI；选项包括 `accept`、`limit`、`maxSize`、`upload` 回调；上传成功后将自身替换为真实图片节点

**工具栏组件**（`src/tiptap-ui/`）：每个文件对应一组相关按钮，均为 TSX 组件，通过 `inject` 获取编辑器实例。`TableControls.tsx` 最复杂，处理列/行的移动、插入、删除。`BubbleMenuBar.tsx` 是浮动气泡菜单，始终渲染，选中文本时自动出现。

**图标**（`src/tiptap-icons/`）：纯 SVG TSX 组件，无外部依赖。

**库导出**（`src/index.ts`）：导出 `TiptapEditor`、`IconButton`、`ImageWithAlign`、所有 feature plugins，以及 `FeaturePlugin`、`UploadFn`、`MathType` 类型。

**代码高亮**：`CodeBlockFeature` 使用 `@tiptap/extension-code-block-lowlight` + `lowlight`（common 语言包）。`lowlight` 已外部化，消费方需自行安装。

**Placeholder**：从独立包 `@tiptap/extension-placeholder` 导入，不再从聚合包 `@tiptap/extensions` 导入。
