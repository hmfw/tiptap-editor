// 组件
export { default as TiptapEditor } from './TiptapEditor'
export { default as IconButton } from './components/IconButton'
export { ImageWithAlign } from './tiptap-extension/ImageWithAlign'

// 工具栏按钮组件（供高级用户使用）
export { default as UndoRedoButton } from './tiptap-ui/UndoRedoButton'
export { default as TextStyleButton } from './tiptap-ui/TextStyleButton'
export { default as CodeBlockButton } from './tiptap-ui/CodeBlockButton'
export { default as ListButton } from './tiptap-ui/ListButton'
export { default as TextAlignButton } from './tiptap-ui/TextAlignButton'
export { default as ImageButton } from './tiptap-ui/ImageButton'
export { default as TableButton } from './tiptap-ui/TableButton'
export { default as MathButton } from './tiptap-ui/MathButton'

// 类型和常量
export type { UploadFn } from './types'
export type {
  ToolbarConfig,
  ToolbarItem,
  BuiltinToolbarItem,
  ToolbarSeparator,
  CustomToolbarItem,
} from './types'
export { DEFAULT_TOOLBAR_CONFIG } from './types/toolbar'
