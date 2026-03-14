import { defineComponent } from 'vue'
import IconButton from '../components/IconButton'

import AlignLeftIcon from '../tiptap-icons/AlignLeftIcon'
import AlignCenterIcon from '../tiptap-icons/AlignCenterIcon'
import AlignRightIcon from '../tiptap-icons/AlignRightIcon'
import AlignJustifyIcon from '../tiptap-icons/AlignJustifyIcon'

export default defineComponent({
  name: 'TextAlignButton',
  setup() {
    return () => {
      return (
        <div>
          <IconButton icon={AlignLeftIcon} tooltip="左边对齐" />
          <IconButton icon={AlignCenterIcon} tooltip="中间对齐" />
          <IconButton icon={AlignRightIcon} tooltip="右边对齐" />
          <IconButton icon={AlignJustifyIcon} tooltip="两端对齐" />
        </div>
      )
    }
  },
})
