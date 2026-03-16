<script setup lang="ts">
import { ref, inject, watch, computed, type ShallowRef } from 'vue'
import type { Editor } from '@tiptap/core'
import { ElDialog, ElInput, ElButton, ElRadioGroup, ElRadioButton } from 'element-plus'
import katex from 'katex'

const props = defineProps<{
  visible: boolean
  latex: string
  pos: number | null
  type: 'inline' | 'block'
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

const editor = inject<ShallowRef<Editor | undefined>>('editor')
const editLatex = ref('')
const editType = ref<'inline' | 'block'>('inline')

watch(() => props.latex, val => { editLatex.value = val }, { immediate: true })
watch(() => props.type, val => { editType.value = val }, { immediate: true })

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
    // 类型未变，直接更新
    if (props.type === 'inline') {
      e.commands.updateInlineMath({ latex: editLatex.value, pos: props.pos! })
    } else {
      e.commands.updateBlockMath({ latex: editLatex.value, pos: props.pos! })
    }
  } else {
    // 类型改变：删除旧节点，插入新类型节点
    const pos = props.pos!
    if (props.type === 'inline') {
      e.chain().focus().deleteInlineMath({ pos }).insertBlockMath({ latex: editLatex.value }).run()
    } else {
      e.chain().focus().deleteBlockMath({ pos }).insertInlineMath({ latex: editLatex.value }).run()
    }
  }
  emit('update:visible', false)
}
</script>

<template>
  <ElDialog
    :model-value="visible"
    :title="isInsert ? '插入数学公式' : '编辑数学公式'"
    width="520px"
    @update:model-value="emit('update:visible', $event)"
  >
    <div class="math-dialog">
      <ElRadioGroup v-model="editType">
        <ElRadioButton value="inline">行内公式</ElRadioButton>
        <ElRadioButton value="block">块级公式</ElRadioButton>
      </ElRadioGroup>
      <ElInput
        v-model="editLatex"
        type="textarea"
        :rows="3"
        placeholder="请输入 LaTeX 公式，例如：E=mc^2"
      />
      <div class="math-preview" :class="{ 'math-preview--empty': !preview }">
        <span v-if="!preview" class="math-preview__placeholder">预览将在此处显示</span>
        <div v-else v-html="preview" />
      </div>
    </div>
    <template #footer>
      <ElButton @click="emit('update:visible', false)">取消</ElButton>
      <ElButton type="primary" :disabled="!editLatex.trim()" @click="confirm">确认</ElButton>
    </template>
  </ElDialog>
</template>

<style scoped>
.math-dialog {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.math-preview {
  min-height: 56px;
  padding: 12px 16px;
  background: var(--el-fill-color-light);
  border-radius: 4px;
  text-align: center;
  overflow-x: auto;
  transition: background 0.2s;
}
.math-preview:hover {
  background: #eee;
}
.math-preview--empty {
  display: flex;
  align-items: center;
  justify-content: center;
}
.math-preview__placeholder {
  color: var(--el-text-color-placeholder);
  font-size: 13px;
}
</style>
