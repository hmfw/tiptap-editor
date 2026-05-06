import TextAlignButton from '../tiptap-ui/TextAlignButton'
import type { FeaturePlugin } from '../types/plugin'

export const TextAlignFeature: FeaturePlugin = {
  name: 'text-align',
  install: () => ({ extensions: [] }),
  toolbarComponent: TextAlignButton,
}
