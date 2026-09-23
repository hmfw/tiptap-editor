import {
  defineComponent,
  ref,
  provide,
  inject,
  Teleport,
  nextTick,
  onMounted,
  onBeforeUnmount,
  type PropType,
} from 'vue'
import { computePosition, useClickOutside, type Placement } from './floating'

type Command = string | number

interface DropdownCtx {
  command: (cmd: Command | undefined) => void
}

const DropdownKey = Symbol('ui-dropdown')

/**
 * 下拉菜单，替代 element-plus 的 ElDropdown（trigger="click"）。
 * default 插槽为触发元素，dropdown 插槽为菜单内容。
 * 点击触发元素切换显隐，选择菜单项或点击外部关闭，选择时 emit command。
 * inheritAttrs=false：把外部传入的 style（如绝对定位）转发到触发元素包裹层。
 */
export const Dropdown = defineComponent({
  name: 'UiDropdown',
  inheritAttrs: false,
  props: {
    trigger: { type: String, default: 'click' },
    placement: { type: String as PropType<Placement>, default: 'bottom' },
  },
  emits: ['command'],
  setup(props, { slots, emit, attrs }) {
    const triggerEl = ref<HTMLElement>()
    const floatingEl = ref<HTMLElement>()
    const open = ref(false)
    const ready = ref(false)
    const pos = ref({ top: 0, left: 0 })

    const update = () => {
      if (!triggerEl.value || !floatingEl.value) return
      pos.value = computePosition(triggerEl.value, floatingEl.value, props.placement, 6)
      ready.value = true
    }

    const toggle = () => {
      open.value = !open.value
      if (open.value) {
        ready.value = false
        nextTick(update)
      }
    }

    provide<DropdownCtx>(DropdownKey, {
      command: (cmd) => {
        emit('command', cmd)
        open.value = false
      },
    })

    useClickOutside(
      () => [triggerEl.value, floatingEl.value],
      () => {
        open.value = false
      },
    )

    const onScrollResize = () => {
      if (open.value) update()
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
          class="ui-dropdown-trigger"
          style={attrs.style as string | undefined}
          onClick={toggle}
        >
          {slots.default?.()}
        </span>
        <Teleport to="body">
          {open.value && (
            <div
              ref={floatingEl}
              class="ui-dropdown-popper"
              style={{
                position: 'fixed',
                top: `${pos.value.top}px`,
                left: `${pos.value.left}px`,
                opacity: ready.value ? 1 : 0,
              }}
            >
              {slots.dropdown?.()}
            </div>
          )}
        </Teleport>
      </>
    )
  },
})

/**
 * 下拉菜单容器，替代 ElDropdownMenu。
 */
export const DropdownMenu = defineComponent({
  name: 'UiDropdownMenu',
  setup(_, { slots }) {
    return () => <ul class="ui-dropdown-menu">{slots.default?.()}</ul>
  },
})

/**
 * 下拉菜单项，替代 ElDropdownItem。
 * 点击时通过注入的上下文触发 command（并关闭菜单）。
 */
export const DropdownItem = defineComponent({
  name: 'UiDropdownItem',
  props: {
    command: { type: [String, Number] as PropType<Command>, default: undefined },
    disabled: { type: Boolean, default: false },
    divided: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    const ctx = inject<DropdownCtx>(DropdownKey)
    return () => (
      <li
        class={['ui-dropdown-item', { 'is-disabled': props.disabled, 'is-divided': props.divided }]}
        onClick={() => {
          if (!props.disabled) ctx?.command(props.command)
        }}
      >
        {slots.default?.()}
      </li>
    )
  },
})
