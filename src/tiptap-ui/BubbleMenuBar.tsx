import { defineComponent, inject, type ShallowRef, type ComputedRef } from 'vue'
import type { Editor } from '@tiptap/core'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import IconButton from '../components/IconButton'
import BoldIcon from '../tiptap-icons/BoldIcon'
import ItalicIcon from '../tiptap-icons/ItalicIcon'
import StrikeIcon from '../tiptap-icons/StrikeIcon'
import UnderlineIcon from '../tiptap-icons/UnderlineIcon'
import LinkPopover from './LinkPopover'
import './BubbleMenuBar.scss'

export default defineComponent({
  name: 'BubbleMenuBar',
  setup() {
    const editor = inject<ShallowRef<Editor | undefined>>('editor')
    const readonly = inject<ComputedRef<boolean>>('readonly')

    return () => {
      if (!editor?.value) return null

      return (
        <BubbleMenu
          editor={editor.value}
          class="bubble-menu"
          options={{
            placement: 'top',
            offset: { mainAxis: 8 },
          }}
          shouldShow={(props) => {
            if (readonly?.value) return false
            const { editor: ed, from, to } = props
            if (from === to) return false
            if (ed.isActive('image')) return false
            if (ed.isActive('table')) return false
            return true
          }}
        >
          <div class="tiptap-bubble-menu">
            <IconButton
              icon={BoldIcon}
              tooltip="粗体"
              isActive={editor.value.isActive('bold')}
              onClick={() => editor.value?.chain().focus().toggleBold().run()}
            />
            <IconButton
              icon={ItalicIcon}
              tooltip="斜体"
              isActive={editor.value.isActive('italic')}
              onClick={() => editor.value?.chain().focus().toggleItalic().run()}
            />
            <IconButton
              icon={StrikeIcon}
              tooltip="删除线"
              isActive={editor.value.isActive('strike')}
              onClick={() => editor.value?.chain().focus().toggleStrike().run()}
            />
            <IconButton
              icon={UnderlineIcon}
              tooltip="下划线"
              isActive={editor.value.isActive('underline')}
              onClick={() => editor.value?.chain().focus().toggleUnderline().run()}
            />
            <LinkPopover />
          </div>
        </BubbleMenu>
      )
    }
  },
})
