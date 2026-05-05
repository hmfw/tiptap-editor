import type { Component } from 'vue'

// 内置按钮组标识符
export type BuiltinToolbarItem =
  | 'undo-redo'    // 撤销/重做
  | 'text-style'   // 文本样式（粗体/斜体/删除线/下划线/链接）
  | 'code-block'   // 代码块
  | 'list'         // 列表（无序/有序/任务）
  | 'text-align'   // 文本对齐
  | 'image'        // 图片上传
  | 'table'        // 表格
  | 'math'         // 数学公式

// 分隔符
export type ToolbarSeparator = '|'

// 自定义按钮组
export interface CustomToolbarItem {
  type: 'custom'
  component: Component
  key?: string  // 可选的唯一标识符
}

// 工具栏配置项
export type ToolbarItem = BuiltinToolbarItem | ToolbarSeparator | CustomToolbarItem

// 工具栏配置数组
export type ToolbarConfig = ToolbarItem[]

// 默认配置（与当前硬编码一致）
export const DEFAULT_TOOLBAR_CONFIG: ToolbarConfig = [
  'undo-redo',
  '|',
  'text-style',
  'code-block',
  '|',
  'list',
  '|',
  'text-align',
  '|',
  'image',
  'table',
  'math',
]
