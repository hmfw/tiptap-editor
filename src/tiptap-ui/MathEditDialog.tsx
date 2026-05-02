import { defineComponent, ref, inject, watch, computed, type PropType, type ShallowRef } from 'vue'
import type { Editor } from '@tiptap/core'
import { ElDialog, ElInput, ElButton, ElRadioGroup, ElRadioButton } from 'element-plus'
import katex from 'katex'
import type { MathType } from '../types'

export default defineComponent({
  name: 'MathEditDialog',
  props: {
    visible: { type: Boolean, required: true },
    latex: { type: String, required: true },
    pos: { type: Number as PropType<number | null>, default: null },
    type: { type: String as PropType<MathType>, required: true },
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    const editor = inject<ShallowRef<Editor | undefined>>('editor')
    const editLatex = ref('')
    const editType = ref<MathType>('inline')

    watch(() => props.latex, (val) => { editLatex.value = val }, { immediate: true })
    watch(() => props.type, (val) => { editType.value = val }, { immediate: true })

    const isInsert = computed(() => props.pos === null)

    const preview = computed(() => {
      if (!editLatex.value.trim()) return ''
      return katex.renderToString(editLatex.value, {
        displayMode: editType.value === 'block',
        throwOnError: false,
      })
    })

    const confirm = () => {
      const e = editor?.value
      if (!e || !editLatex.value.trim()) return
      if (isInsert.value) {
        if (editType.value === 'inline') {
          e.chain().focus().insertInlineMath({ latex: editLatex.value }).run()
        } else {
          e.chain().focus().insertBlockMath({ latex: editLatex.value }).run()
        }
      } else if (editType.value === props.type) {
        if (props.type === 'inline') {
          e.commands.updateInlineMath({ latex: editLatex.value, pos: props.pos! })
        } else {
          e.commands.updateBlockMath({ latex: editLatex.value, pos: props.pos! })
        }
      } else {
        const pos = props.pos!
        if (props.type === 'inline') {
          e.chain().focus().deleteInlineMath({ pos }).insertBlockMath({ latex: editLatex.value }).run()
        } else {
          e.chain().focus().deleteBlockMath({ pos }).insertInlineMath({ latex: editLatex.value }).run()
        }
      }
      emit('update:visible', false)
    }

    return () => (
      <ElDialog
        modelValue={props.visible}
        title={isInsert.value ? '插入数学公式' : '编辑数学公式'}
        width="520px"
        onUpdate:modelValue={(val: boolean) => emit('update:visible', val)}
        v-slots={{
          footer: () => (
            <>
              <ElButton onClick={() => emit('update:visible', false)}>取消</ElButton>
              <ElButton
                type="primary"
                disabled={!editLatex.value.trim()}
                onClick={confirm}
              >
                确认
              </ElButton>
            </>
          ),
        }}
      >
        <div class="math-dialog">
          <ElRadioGroup modelValue={editType.value} onUpdate:modelValue={(val: any) => { editType.value = val as MathType }}>
            <ElRadioButton value="inline">行内公式</ElRadioButton>
            <ElRadioButton value="block">块级公式</ElRadioButton>
          </ElRadioGroup>
          <ElInput
            modelValue={editLatex.value}
            type="textarea"
            rows={3}
            placeholder="请输入 LaTeX 公式，例如：E=mc^2"
            onUpdate:modelValue={(val: string) => { editLatex.value = val }}
          />
          <div class={['math-preview', { 'math-preview--empty': !preview.value }]}>
            {!preview.value ? (
              <span class="math-preview__placeholder">预览将在此处显示</span>
            ) : (
              <div v-html={preview.value} />
            )}
          </div>
        </div>
      </ElDialog>
    )
  },
})

