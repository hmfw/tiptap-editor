import { defineComponent } from 'vue'
import IconButton from '../components/IconButton'

import ImagePlusIcon from '../tiptap-icons/ImagePlusIcon'

export default defineComponent({
  name: 'ImageButton',
  setup(props) {
    console.log(props)
    return () => (
      <div>
        <IconButton icon={ImagePlusIcon} tooltip="图片" />
      </div>
    )
  },
})
