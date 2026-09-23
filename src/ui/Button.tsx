import { defineComponent, h, type Component, type PropType } from 'vue'

/**
 * 基础按钮，替代 element-plus 的 ElButton。
 * 支持 text（无边框）/ primary 变体、icon 图标组件、disabled、默认插槽。
 */
export default defineComponent({
  name: 'UiButton',
  props: {
    text: { type: Boolean, default: false },
    type: { type: String as PropType<'default' | 'primary'>, default: 'default' },
    icon: { type: Object as PropType<Component>, default: undefined },
    disabled: { type: Boolean, default: false },
  },
  emits: ['click'],
  setup(props, { slots, emit }) {
    return () => (
      <button
        type="button"
        class={[
          'ui-button',
          `ui-button--${props.type}`,
          { 'ui-button--text': props.text, 'is-disabled': props.disabled },
        ]}
        disabled={props.disabled}
        onClick={(e: MouseEvent) => {
          if (!props.disabled) emit('click', e)
        }}
      >
        {props.icon ? h(props.icon, { class: 'ui-button__icon' }) : null}
        {slots.default?.()}
      </button>
    )
  },
})
