import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import CodeBlockButton from '../tiptap-ui/CodeBlockButton'
import type { FeaturePlugin } from '../types/plugin'

const lowlight = createLowlight(common)

export const CodeBlockFeature: FeaturePlugin = {
  name: 'code-block',
  install: () => ({
    extensions: [CodeBlockLowlight.configure({ lowlight, defaultLanguage: 'plaintext' })],
  }),
  toolbarComponent: CodeBlockButton,
}
