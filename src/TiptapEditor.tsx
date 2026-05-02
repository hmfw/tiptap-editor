import { defineComponent, provide, ref, watch, computed, type PropType } from 'vue'
import StarterKit from '@tiptap/starter-kit'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { TextAlign } from '@tiptap/extension-text-align'
import { Placeholder } from '@tiptap/extension-placeholder'
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { ImageWithAlign } from './tiptap-extension/ImageWithAlign'
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table'
import { Mathematics } from '@tiptap/extension-mathematics'

import { ImageUpload } from './tiptap-extension/ImageUpload'
import type { UploadFn, MathType } from './types'

const lowlight = createLowlight(common)

import UndoRedoButton from './tiptap-ui/UndoRedoButton'
import TextStyleButton from './tiptap-ui/TextStyleButton'
import TextAlignButton from './tiptap-ui/TextAlignButton'
import ListButton from './tiptap-ui/ListButton'
import ImageButton from './tiptap-ui/ImageButton'
import TableButton from './tiptap-ui/TableButton'
import TableControls from './tiptap-ui/TableControls'
import MathButton from './tiptap-ui/MathButton'
import MathEditDialog from './tiptap-ui/MathEditDialog'
import ImageControls from './tiptap-ui/ImageControls'
import CodeBlockButton from './tiptap-ui/CodeBlockButton'
import BubbleMenuBar from './tiptap-ui/BubbleMenuBar'

import 'katex/dist/katex.min.css'
import './editor.scss'

export default defineComponent({
  name: 'TiptapEditor',
  props: {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: '请输入内容...' },
    upload: { type: Function as PropType<UploadFn>, default: undefined },
    readonly: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const mathEditVisible = ref(false)
    const mathEditLatex = ref('')
    const mathEditPos = ref<number | null>(null)
    const mathEditType = ref<MathType>('inline')

    const isReadonly = computed(() => props.readonly ?? false)

    const openMathDialog = (opts: { latex?: string; pos?: number | null; type?: MathType } = {}) => {
      if (isReadonly.value) return
      mathEditLatex.value = opts.latex ?? ''
      mathEditPos.value = opts.pos ?? null
      mathEditType.value = opts.type ?? 'inline'
      mathEditVisible.value = true
    }

    provide('openMathDialog', openMathDialog)
    provide('readonly', isReadonly)

    const editor = useEditor({
      content: props.modelValue,
      editable: !props.readonly,
      extensions: [
        StarterKit.configure({
          codeBlock: false,
          link: {
            openOnClick: false,
            enableClickSelection: true,
          },
        }),
        Placeholder.configure({
          placeholder: props.placeholder,
        }),
        CodeBlockLowlight.configure({
          lowlight,
          defaultLanguage: 'plaintext',
        }),
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        TaskList,
        TaskItem.configure({ nested: true }),
        ImageWithAlign.configure({
          allowBase64: true,
          resize: {
            enabled: true,
            directions: [
              'top',
              'right',
              'bottom',
              'left',
              'top-right',
              'top-left',
              'bottom-right',
              'bottom-left',
            ],
            minWidth: 50,
            minHeight: 50,
            alwaysPreserveAspectRatio: false,
          },
        }),
        ImageUpload.configure({
          ...(props.upload ? { upload: props.upload } : {}),
        }),
        Table.configure({ resizable: true }),
        TableRow,
        TableHeader,
        TableCell,
        Mathematics.configure({
          inlineOptions: {
            onClick: (node, pos) => openMathDialog({ latex: node.attrs.latex, pos, type: 'inline' }),
          },
          blockOptions: {
            onClick: (node, pos) => openMathDialog({ latex: node.attrs.latex, pos, type: 'block' }),
          },
        }),
      ],
      onUpdate: ({ editor: e }) => {
        emit('update:modelValue', e.getHTML())
      },
    })

    provide('editor', editor)

    watch(() => props.modelValue, (val) => {
      if (editor.value && val !== editor.value.getHTML()) {
        editor.value.commands.setContent(val, { emitUpdate: false })
      }
    })

    watch(() => props.readonly, (val) => {
      editor.value?.setEditable(!val)
    })

    return () => (
      <div class="tiptap-editor">
        {!props.readonly && (
          <div class="tiptap-toolbar">
            <UndoRedoButton />
            <div class="tiptap-separator" />
            <TextStyleButton />
            <CodeBlockButton />
            <div class="tiptap-separator" />
            <ListButton />
            <div class="tiptap-separator" />
            <TextAlignButton />
            <div class="tiptap-separator" />
            <ImageButton />
            <TableButton />
            <MathButton />
          </div>
        )}
        <EditorContent class="tiptap-content" editor={editor.value} />
        <BubbleMenuBar />
        <TableControls />
        <ImageControls />
        <MathEditDialog
          visible={mathEditVisible.value}
          latex={mathEditLatex.value}
          pos={mathEditPos.value}
          type={mathEditType.value}
          onUpdate:visible={(val: boolean) => { mathEditVisible.value = val }}
        />
      </div>
    )
  },
})

