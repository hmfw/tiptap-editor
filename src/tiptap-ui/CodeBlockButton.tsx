import { defineComponent, inject, type ShallowRef } from 'vue'
import type { Editor } from '@tiptap/core'
import IconButton from '../components/IconButton'
import CodeBlockIcon from '../tiptap-icons/CodeBlockIcon'

export default defineComponent({
  name: 'CodeBlockButton',
  setup() {
    const editor = inject<ShallowRef<Editor | undefined>>('editor')

    return () => (
      <IconButton
        icon={CodeBlockIcon}
        tooltip="代码块"
        isActive={editor?.value?.isActive('codeBlock')}
        onClick={() => editor?.value?.chain().focus().toggleCodeBlock().run()}
      />
    )
  },
})
