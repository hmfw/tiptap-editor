import type { UploadFn } from './upload'

/**
 * 编辑器 Props
 */
export interface TiptapEditorProps {
  modelValue?: string
  placeholder?: string
  upload?: UploadFn
  readonly?: boolean
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
