import { defineComponent } from 'vue'
import IconButton from '../components/IconButton'

import BoldIcon from '../tiptap-icons/BoldIcon'
import ItalicIcon from '../tiptap-icons/ItalicIcon'
import StrikeIcon from '../tiptap-icons/StrikeIcon'
import UnderlineIcon from '../tiptap-icons/UnderlineIcon'
import LinkIcon from '../tiptap-icons/LinkIcon'

export default defineComponent({
  name: 'TextStyleButton',
  setup(props) {
    console.log(props)
    return () => (
      <div>
        <IconButton icon={BoldIcon} tooltip="粗体" />
        <IconButton icon={ItalicIcon} tooltip="斜体" />
        <IconButton icon={StrikeIcon} tooltip="删除线" />
        <IconButton icon={UnderlineIcon} tooltip="下划线" />
        <IconButton icon={LinkIcon} tooltip="链接" />
      </div>
    )
  },
})
