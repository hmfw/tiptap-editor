import {
  defineComponent,
  provide,
  inject,
  computed,
  type ComputedRef,
  type PropType,
} from 'vue'

type RadioValue = string | number | boolean

interface RadioGroupCtx {
  current: ComputedRef<RadioValue>
  change: (v: RadioValue) => void
}

const RadioGroupKey = Symbol('ui-radio-group')

/**
 * 单选按钮组，替代 element-plus 的 ElRadioGroup。
 * modelValue 支持 v-model，通过 provide 向下传递当前值与切换回调。
 */
export const RadioGroup = defineComponent({
  name: 'UiRadioGroup',
  props: {
    modelValue: { type: [String, Number, Boolean] as PropType<RadioValue>, default: '' },
  },
  emits: ['update:modelValue'],
  setup(props, { slots, emit }) {
    provide<RadioGroupCtx>(RadioGroupKey, {
      current: computed(() => props.modelValue),
      change: (v) => emit('update:modelValue', v),
    })
    return () => <div class="ui-radio-group">{slots.default?.()}</div>
  },
})

/**
 * 单选按钮项，替代 element-plus 的 ElRadioButton。
 * 从 RadioGroup 注入上下文，选中时高亮，点击切换。
 */
export const RadioButton = defineComponent({
  name: 'UiRadioButton',
  props: {
    value: { type: [String, Number, Boolean] as PropType<RadioValue>, required: true },
  },
  setup(props, { slots }) {
    const ctx = inject<RadioGroupCtx>(RadioGroupKey)
    return () => {
      const active = ctx?.current.value === props.value
      return (
        <button
          type="button"
          class={['ui-radio-button', { 'is-active': active }]}
          onClick={() => ctx?.change(props.value)}
        >
          {slots.default?.()}
        </button>
      )
    }
  },
})
