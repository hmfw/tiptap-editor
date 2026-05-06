import ListButton from '../tiptap-ui/ListButton'
import type { FeaturePlugin } from '../types/plugin'

export const ListFeature: FeaturePlugin = {
  name: 'list',
  install: () => ({ extensions: [] }),
  toolbarComponent: ListButton,
}
