import { defineComponent, inject, ref, watch, nextTick, type ShallowRef } from 'vue'
import type { Editor } from '@tiptap/core'
import { ElPopover, ElInput, ElButton, ElTooltip } from 'element-plus'

import LinkIcon from '../tiptap-icons/LinkIcon'
import CornerDownLeftIcon from '../tiptap-icons/CornerDownLeftIcon'
import ExternalLinkIcon from '../tiptap-icons/ExternalLinkIcon'
import TrashIcon from '../tiptap-icons/TrashIcon'
import IconButton from '../components/IconButton'

export default defineComponent({
  name: 'LinkPopover',
  setup() {
    const editor = inject<ShallowRef<Editor | undefined>>('editor')
    const isOpen = ref(false)
    const url = ref('')
    let isSettingLink = false

    // Auto-open and pre-fill when cursor moves into an existing link
    watch(
      () => editor?.value?.isActive('link'),
      (active) => {
        if (isSettingLink) return
        if (active) {
          url.value = editor?.value?.getAttributes('link').href ?? ''
          nextTick(() => {
            isOpen.value = true
          })
        }
      },
    )

    const setLink = () => {
      const e = editor?.value
      if (!e || !url.value) return
      isSettingLink = true

      const { empty } = e.state.selection
      let chain = e.chain().focus().extendMarkRange('link').setLink({ href: url.value })
      if (empty) {
        chain = chain.insertContent({ type: 'text', text: url.value })
      }
      chain.run()

      isOpen.value = false
      nextTick(() => {
        isSettingLink = false
      })
    }

    const removeLink = () => {
      const e = editor?.value
      if (!e) return
      isSettingLink = true
      e.chain().focus().extendMarkRange('link').unsetLink().run()
      url.value = ''
      isOpen.value = false
      nextTick(() => {
        isSettingLink = false
      })
    }

    const openLink = () => {
      const href = editor?.value?.getAttributes('link').href
      if (href) window.open(href, '_blank', 'noopener,noreferrer')
    }

    const handleKeyDown = (e: KeyboardEvent | Event) => {
      if ((e as KeyboardEvent).key === 'Enter') {
        e.preventDefault()
        setLink()
      }
    }

    const handleVisibleChange = (v: boolean) => {
      if (v) url.value = editor?.value?.getAttributes('link').href ?? ''
      isOpen.value = v
    }
    const handleUrlInput = (v: string) => {
      url.value = v
    }

    return () => {
      const isActive = editor?.value?.isActive('link') ?? false

      return (
        <ElPopover
          visible={isOpen.value}
          onUpdate:visible={handleVisibleChange}
          placement="bottom"
          width={300}
          trigger="click"
          showArrow={false}
          popperClass="link-popover-popper"
          offset={6}
        >
          {{
            reference: () => (
              <span>
                <IconButton
                  tooltip="链接"
                  icon={LinkIcon}
                  class={['tiptap-button', { 'is-active': isActive }]}
                />
              </span>
            ),
            default: () => (
              <div class="link-popover-inner">
                <ElInput
                  modelValue={url.value}
                  onUpdate:modelValue={handleUrlInput}
                  type="url"
                  placeholder="请输入链接..."
                  size="small"
                  autofocus
                  onKeydown={handleKeyDown}
                />
                <div class="link-popover-actions">
                  <ElTooltip content="确认" showArrow={false} offset={4}>
                    <ElButton
                      text
                      icon={CornerDownLeftIcon}
                      disabled={!url.value}
                      onClick={setLink}
                    />
                  </ElTooltip>
                  <ElTooltip content="在新标签页打开" showArrow={false} offset={4}>
                    <ElButton
                      text
                      icon={ExternalLinkIcon}
                      disabled={!url.value && !isActive}
                      onClick={openLink}
                    />
                  </ElTooltip>
                  <ElTooltip content="移除链接" showArrow={false} offset={4}>
                    <ElButton text icon={TrashIcon} disabled={!isActive} onClick={removeLink} />
                  </ElTooltip>
                </div>
              </div>
            ),
          }}
        </ElPopover>
      )
    }
  },
})
