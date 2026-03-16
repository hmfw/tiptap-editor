import { defineComponent, inject, type ShallowRef } from 'vue'
import type { Editor } from '@tiptap/core'
import IconButton from '../components/IconButton'
import MathIcon from '../tiptap-icons/MathIcon'

export default defineComponent({
  name: 'MathButton',
  setup() {
    const editor = inject<ShallowRef<Editor | undefined>>('editor')
    const openMathDialog = inject<(opts?: { latex?: string; pos?: number | null; type?: 'inline' | 'block' }) => void>('openMathDialog')

    return () => (
      <IconButton
        icon={MathIcon}
        tooltip="数学公式"
        isActive={editor?.value?.isActive('inlineMath') || editor?.value?.isActive('blockMath')}
        onClick={() => openMathDialog?.()}
      />
    )
  },
})
