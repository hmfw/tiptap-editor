import { defineComponent } from 'vue'
import IconButton from '../components/IconButton'

import UndoIcon from '../tiptap-icons/UndoIcon'
import RedoIcon from '../tiptap-icons/RedoIcon'


console.log(UndoIcon)
export default defineComponent({
  name: 'UndoRedoButton',
  setup(props) {
    console.log(props)
    return () => (
      <div>
        <IconButton icon={UndoIcon} tooltip="撤销" />
        <IconButton icon={RedoIcon} tooltip="重做" />
      </div>
    )
  },
})
