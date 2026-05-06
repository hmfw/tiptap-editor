import { defineComponent, provide, watch, computed, type PropType } from 'vue'
import StarterKit from '@tiptap/starter-kit'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { TextAlign } from '@tiptap/extension-text-align'
import { Placeholder } from '@tiptap/extension-placeholder'

import BubbleMenuBar from './tiptap-ui/BubbleMenuBar'
import type { FeaturePlugin } from './types/plugin'
import type { UploadFn } from './types'

import './editor.scss'

export default defineComponent({
  name: 'TiptapEditor',
  props: {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: '请输入内容...' },
    readonly: { type: Boolean, default: false },
    upload: { type: Function as PropType<UploadFn>, default: undefined },
    features: { type: Array as PropType<FeaturePlugin[]>, default: () => [] },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const isReadonly = computed(() => props.readonly ?? false)
    provide('readonly', isReadonly)

    const installed = props.features.map(plugin => ({
      plugin,
      result: plugin.install({
        readonly: isReadonly,
        provide: (key, value) => provide(key, value),
        upload: props.upload,
      }),
    }))

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
        Placeholder.configure({ placeholder: props.placeholder }),
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        TaskList,
        TaskItem.configure({ nested: true }),
        ...installed.flatMap(({ result }) => result.extensions),
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
            {installed.map(({ plugin }) => {
              const Btn = plugin.toolbarComponent as any
              return Btn ? <Btn key={plugin.name} /> : null
            })}
          </div>
        )}
        <EditorContent class="tiptap-content" editor={editor.value} />
        <BubbleMenuBar />
        {installed.map(({ plugin, result }) => {
          const Control = result.controlComponent as any
          return Control ? <Control key={`${plugin.name}-control`} /> : null
        })}
      </div>
    )
  },
})
