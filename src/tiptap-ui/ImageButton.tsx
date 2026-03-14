import { defineComponent, inject, type ShallowRef } from 'vue'
import type { Editor } from '@tiptap/core'
import IconButton from '../components/IconButton'
import ImagePlusIcon from '../tiptap-icons/ImagePlusIcon'

export default defineComponent({
  name: 'ImageButton',
  setup() {
    const editor = inject<ShallowRef<Editor | undefined>>('editor')
    return () => (
      <div>
        <IconButton
          icon={ImagePlusIcon}
          tooltip="图片"
          onClick={() => editor?.value?.commands.setImageUploadNode()}
        />
      </div>
    )
  },
})
