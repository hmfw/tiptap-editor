import { defineComponent, inject, ref, type Ref } from 'vue'
import type { Editor } from '@tiptap/core'
import { ElPopover, ElButton, ElTooltip } from 'element-plus'
import TableIcon from '../tiptap-icons/TableIcon'
import './TableButton.scss'

const COLS = 8
const ROWS = 8

export default defineComponent({
  name: 'TableButton',
  setup() {
    const editor = inject<Ref<Editor | undefined>>('editor')
    const visible = ref(false)
    const hoverCol = ref(0)
    const hoverRow = ref(0)

    const onCellHover = (col: number, row: number) => {
      hoverCol.value = col
      hoverRow.value = row
    }

    const onGridLeave = () => {
      hoverCol.value = 0
      hoverRow.value = 0
    }

    const onCellClick = (col: number, row: number) => {
      editor?.value
        ?.chain()
        .focus()
        .insertTable({ rows: row, cols: col, withHeaderRow: true })
        .run()
      visible.value = false
    }

    return () => (
      <ElPopover
        v-model:visible={visible.value}
        trigger="click"
        placement="bottom-start"
        popperClass="tiptap-table-picker-popper"
        width="auto"
        showArrow={false}
        v-slots={{
          reference: () => (
            <span>
              <ElTooltip content="表格" showArrow={false} offset={6} disabled={visible.value}>
                <ElButton
                  text
                  class={['tiptap-button', { 'is-active': visible.value }]}
                >
                  <TableIcon class="tiptap-button-icon" />
                </ElButton>
              </ElTooltip>
            </span>
          ),
          default: () => (
              <div class="tiptap-table-picker">
                <div class="tiptap-table-picker-grid" onMouseleave={onGridLeave}>
                  {Array.from({ length: ROWS }, (_, r) => (
                    <div key={r} class="tiptap-table-picker-row">
                      {Array.from({ length: COLS }, (_, c) => (
                        <div
                          key={c}
                          class={[
                            'tiptap-table-picker-cell',
                            { 'is-active': c < hoverCol.value && r < hoverRow.value },
                          ]}
                          onMouseenter={() => onCellHover(c + 1, r + 1)}
                          onClick={() => onCellClick(c + 1, r + 1)}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div class="tiptap-table-picker-footer">
                  <div class="tiptap-table-picker-counter">
                    <span>列</span>
                    <span>{hoverCol.value || 1}</span>
                  </div>
                  <span class="tiptap-table-picker-x">x</span>
                  <div class="tiptap-table-picker-counter">
                    <span>行</span>
                    <span>{hoverRow.value || 1}</span>
                  </div>
                </div>
              </div>
            ),
          }}
      />
    )
  },
})
