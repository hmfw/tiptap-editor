import { ref, defineComponent, h } from 'vue'
import { Mathematics } from '@tiptap/extension-mathematics'
import MathButton from '../tiptap-ui/MathButton'
import MathEditDialog from '../tiptap-ui/MathEditDialog'
import type { FeaturePlugin, PluginInstallContext } from '../types/plugin'
import type { MathType } from '../types'
import 'katex/dist/katex.min.css'

export const MathFeature: FeaturePlugin = {
  name: 'math',
  toolbarComponent: MathButton,

  install(ctx: PluginInstallContext) {
    const mathEditVisible = ref(false)
    const mathEditLatex = ref('')
    const mathEditPos = ref<number | null>(null)
    const mathEditType = ref<MathType>('inline')

    const openMathDialog = (opts: { latex?: string; pos?: number | null; type?: MathType } = {}) => {
      if (ctx.readonly.value) return
      mathEditLatex.value = opts.latex ?? ''
      mathEditPos.value = opts.pos ?? null
      mathEditType.value = opts.type ?? 'inline'
      mathEditVisible.value = true
    }

    ctx.provide('openMathDialog', openMathDialog)

    const MathDialogWrapper = defineComponent({
      name: 'MathEditDialogWrapper',
      setup: () => () => h(MathEditDialog, {
        visible: mathEditVisible.value,
        latex: mathEditLatex.value,
        pos: mathEditPos.value,
        type: mathEditType.value,
        'onUpdate:visible': (val: boolean) => { mathEditVisible.value = val },
      }),
    })

    return {
      extensions: [
        Mathematics.configure({
          inlineOptions: {
            onClick: (node, pos) => openMathDialog({ latex: node.attrs.latex, pos, type: 'inline' }),
          },
          blockOptions: {
            onClick: (node, pos) => openMathDialog({ latex: node.attrs.latex, pos, type: 'block' }),
          },
        }),
      ],
      controlComponent: MathDialogWrapper,
    }
  },
}
