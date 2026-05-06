import TextStyleButton from '../tiptap-ui/TextStyleButton'
import type { FeaturePlugin } from '../types/plugin'

export const TextStyleFeature: FeaturePlugin = {
  name: 'text-style',
  install: () => ({ extensions: [] }),
  toolbarComponent: TextStyleButton,
}
