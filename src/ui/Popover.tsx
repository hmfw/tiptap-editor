import {
  defineComponent,
  ref,
  watch,
  Teleport,
  nextTick,
  onMounted,
  onBeforeUnmount,
  type PropType,
} from 'vue'
import { computePosition, useClickOutside, type Placement } from './floating'

/**
 * 气泡卡片，替代 element-plus 的 ElPopover（trigger="click"）。
 * reference 插槽为触发元素，点击切换显隐；default 插槽为浮层内容。
 * 受控组件：通过 visible prop + update:visible 事件控制，支持 v-model:visible。
 * 浮层 Teleport 到 body，position: fixed，点击外部关闭。
 * trigger / showArrow 为兼容旧调用保留。
 */
export default defineComponent({
  name: 'UiPopover',
  props: {
    visible: { type: Boolean, default: false },
    placement: { type: String as PropType<Placement>, default: 'bottom' },
    width: { type: [Number, String], default: '' },
    trigger: { type: String, default: 'click' },
    showArrow: { type: Boolean, default: false },
    popperClass: { type: String, default: '' },
    offset: { type: Number, default: 6 },
  },
  emits: ['update:visible'],
  setup(props, { slots, emit }) {
    const triggerEl = ref<HTMLElement>()
    const floatingEl = ref<HTMLElement>()
    const ready = ref(false)
    const pos = ref({ top: 0, left: 0 })

    const update = () => {
      if (!triggerEl.value || !floatingEl.value) return
      pos.value = computePosition(triggerEl.value, floatingEl.value, props.placement, props.offset)
      ready.value = true
    }

    const toggle = () => emit('update:visible', !props.visible)

    watch(
      () => props.visible,
      (v) => {
        if (v) {
          ready.value = false
          nextTick(update)
        }
      },
    )

    useClickOutside(
      () => [triggerEl.value, floatingEl.value],
      () => {
        if (props.visible) emit('update:visible', false)
      },
    )

    const onScrollResize = () => {
      if (props.visible) update()
    }
    onMounted(() => {
      window.addEventListener('scroll', onScrollResize, true)
      window.addEventListener('resize', onScrollResize)
    })
    onBeforeUnmount(() => {
      window.removeEventListener('scroll', onScrollResize, true)
      window.removeEventListener('resize', onScrollResize)
    })

    const widthStyle = () => {
      const w = props.width
      if (typeof w === 'number') return `${w}px`
      if (w && w !== 'auto') return w
      return undefined
    }

    return () => (
      <>
        <span ref={triggerEl} class="ui-popover-trigger" onClick={toggle}>
          {slots.reference?.()}
        </span>
        <Teleport to="body">
          {props.visible && (
            <div
              ref={floatingEl}
              class={['ui-popover', props.popperClass]}
              style={{
                position: 'fixed',
                top: `${pos.value.top}px`,
                left: `${pos.value.left}px`,
                width: widthStyle(),
                opacity: ready.value ? 1 : 0,
              }}
            >
              {slots.default?.()}
            </div>
          )}
        </Teleport>
      </>
    )
  },
})
