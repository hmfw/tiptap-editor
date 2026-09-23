import { defineComponent, Teleport, onMounted, onBeforeUnmount } from 'vue'

/**
 * 模态对话框，替代 element-plus 的 ElDialog。
 * modelValue 控制显隐（支持 v-model），default 插槽为主体，footer 插槽为底部按钮区。
 * 遮罩点击、右上角关闭按钮、Esc 键均可关闭。整体 Teleport 到 body。
 */
export default defineComponent({
  name: 'UiDialog',
  props: {
    modelValue: { type: Boolean, default: false },
    title: { type: String, default: '' },
    width: { type: String, default: '50%' },
  },
  emits: ['update:modelValue'],
  setup(props, { slots, emit }) {
    const close = () => emit('update:modelValue', false)

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && props.modelValue) close()
    }
    onMounted(() => document.addEventListener('keydown', onKeydown))
    onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))

    return () => (
      <Teleport to="body">
        {props.modelValue && (
          <div
            class="ui-dialog-overlay"
            onMousedown={(e: MouseEvent) => {
              if (e.target === e.currentTarget) close()
            }}
          >
            <div class="ui-dialog" style={{ width: props.width }}>
              <div class="ui-dialog__header">
                <span class="ui-dialog__title">{props.title}</span>
                <button type="button" class="ui-dialog__close" aria-label="关闭" onClick={close}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  >
                    <path d="M3 3l10 10M13 3L3 13" />
                  </svg>
                </button>
              </div>
              <div class="ui-dialog__body">{slots.default?.()}</div>
              {slots.footer && <div class="ui-dialog__footer">{slots.footer()}</div>}
            </div>
          </div>
        )}
      </Teleport>
    )
  },
})
