import {
  defineComponent,
  ref,
  Teleport,
  nextTick,
  onMounted,
  onBeforeUnmount,
  type PropType,
} from 'vue'
import { computePosition, type Placement } from './floating'

/**
 * 悬浮提示，替代 element-plus 的 ElTooltip。
 * 默认插槽为触发元素，鼠标进入显示、离开隐藏。
 * 浮层 Teleport 到 body，position: fixed，通过 computePosition 定位。
 * showArrow 为兼容旧调用而保留，当前实现不渲染箭头。
 */
export default defineComponent({
  name: 'UiTooltip',
  props: {
    content: { type: String, default: '' },
    placement: { type: String as PropType<Placement>, default: 'bottom' },
    offset: { type: Number, default: 6 },
    disabled: { type: Boolean, default: false },
    showArrow: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    const triggerEl = ref<HTMLElement>()
    const floatingEl = ref<HTMLElement>()
    const visible = ref(false)
    const ready = ref(false)
    const pos = ref({ top: 0, left: 0 })

    const update = () => {
      if (!triggerEl.value || !floatingEl.value) return
      pos.value = computePosition(triggerEl.value, floatingEl.value, props.placement, props.offset)
      ready.value = true
    }

    const show = () => {
      if (props.disabled || !props.content) return
      visible.value = true
      ready.value = false
      nextTick(update)
    }
    const hide = () => {
      visible.value = false
    }

    const onScrollResize = () => {
      if (visible.value) update()
    }
    onMounted(() => {
      window.addEventListener('scroll', onScrollResize, true)
      window.addEventListener('resize', onScrollResize)
    })
    onBeforeUnmount(() => {
      window.removeEventListener('scroll', onScrollResize, true)
      window.removeEventListener('resize', onScrollResize)
    })

    return () => (
      <>
        <span
          ref={triggerEl}
          class="ui-tooltip-trigger"
          onMouseenter={show}
          onMouseleave={hide}
        >
          {slots.default?.()}
        </span>
        <Teleport to="body">
          {visible.value && (
            <div
              ref={floatingEl}
              class="ui-tooltip"
              style={{
                position: 'fixed',
                top: `${pos.value.top}px`,
                left: `${pos.value.left}px`,
                opacity: ready.value ? 1 : 0,
              }}
            >
              {props.content}
            </div>
          )}
        </Teleport>
      </>
    )
  },
})
