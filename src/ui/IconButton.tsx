import { defineComponent, type Component, type PropType } from 'vue'
import Tooltip from './Tooltip'
import Button from './Button'

const iconButtonProps = {
  icon: {
    type: Object as PropType<Component>,
    required: true,
  },
  tooltip: { type: String, required: true },
  isActive: { type: Boolean },
  disabled: { type: Boolean, default: false },
  onClick: { type: Function as PropType<() => void> },
}

export default defineComponent({
  name: 'IconButton',
  props: iconButtonProps,
  setup(props) {
    return () => {
      return (
        <Tooltip showArrow={false} offset={6} content={props.tooltip}>
          <Button
            text
            icon={props.icon}
            class={['tiptap-button', { 'is-active': props.isActive }]}
            disabled={props.disabled}
            onClick={props.onClick}
          />
        </Tooltip>
      )
    }
  },
})
