import { defineComponent, ref, onMounted, h, type PropType } from 'vue'

/**
 * 文本输入框，替代 element-plus 的 ElInput。
 * 支持 text/url/textarea 类型、v-model、autofocus（挂载时聚焦）、onKeydown。
 * inheritAttrs=false，其余未声明的原生属性/事件转发到真实的 input/textarea。
 */
export default defineComponent({
  name: 'UiInput',
  inheritAttrs: false,
  props: {
    modelValue: { type: String, default: '' },
    type: { type: String as PropType<'text' | 'url' | 'textarea'>, default: 'text' },
    rows: { type: Number, default: 2 },
    placeholder: { type: String, default: '' },
    size: { type: String, default: '' },
    autofocus: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    onKeydown: { type: Function as PropType<(e: KeyboardEvent) => void> },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    const el = ref<HTMLInputElement | HTMLTextAreaElement>()

    onMounted(() => {
      if (props.autofocus) el.value?.focus()
    })

    const onInput = (e: Event) => {
      emit('update:modelValue', (e.target as HTMLInputElement).value)
    }

    return () => {
      const common: Record<string, unknown> = {
        ref: el,
        value: props.modelValue,
        placeholder: props.placeholder,
        disabled: props.disabled,
        onInput,
        onKeydown: props.onKeydown,
        ...attrs,
      }

      if (props.type === 'textarea') {
        return h('textarea', {
          ...common,
          rows: props.rows,
          class: ['ui-input', 'ui-input--textarea', props.size && `ui-input--${props.size}`],
        })
      }

      return h('input', {
        ...common,
        type: props.type,
        class: ['ui-input', props.size && `ui-input--${props.size}`],
      })
    }
  },
})
