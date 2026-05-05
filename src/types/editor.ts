import type { UploadFn } from './upload'
import type { ToolbarConfig } from './toolbar'

/**
 * 编辑器 Props
 */
export interface TiptapEditorProps {
  modelValue?: string
  placeholder?: string
  upload?: UploadFn
  readonly?: boolean
  toolbar?: ToolbarConfig
}

/**
 * 图片对齐方式
 */
export type ImageAlign = 'left' | 'center' | 'right'

/**
 * 图片信息
 */
export interface ImageInfo {
  pos: number
  nodeSize: number
  src: string
  align: ImageAlign
}
