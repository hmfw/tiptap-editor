import type { NodeType } from '@tiptap/pm/model'

/**
 * 图片上传函数类型
 * @param file - 要上传的文件
 * @returns Promise<string> - 返回上传后的图片 URL
 */
export type UploadFn = (file: File) => Promise<string>

/**
 * 图片上传选项
 */
export interface ImageUploadOptions {
  type: string | NodeType
  accept: string
  limit: number
  maxSize: number
  upload?: UploadFn
  onError?: (error: Error) => void
  onSuccess?: (url: string) => void
  HTMLAttributes: Record<string, any>
}
