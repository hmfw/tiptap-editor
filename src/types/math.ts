/**
 * 数学公式类型
 */
export type MathType = 'inline' | 'block'

/**
 * 数学公式对话框选项
 */
export interface MathDialogOptions {
  latex?: string
  pos?: number | null
  type?: MathType
}

/**
 * 打开数学公式对话框的函数类型
 */
export type OpenMathDialogFn = (opts?: MathDialogOptions) => void
