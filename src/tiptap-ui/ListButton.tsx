import { defineComponent } from 'vue'
import IconButton from '../components/IconButton'

import ListIcon from '../tiptap-icons/ListIcon'
import ListOrderedIcon from '../tiptap-icons/ListOrderedIcon'
import ListTodoIcon from '../tiptap-icons/ListTodoIcon'

export default defineComponent({
  name: 'ListButton',
  setup(props) {
    console.log(props)
    return () => (
      <div>
        <IconButton icon={ListIcon} tooltip="无序列表" />
        <IconButton icon={ListOrderedIcon} tooltip="有序列表" />
        <IconButton icon={ListTodoIcon} tooltip="任务列表" />
      </div>
    )
  },
})
