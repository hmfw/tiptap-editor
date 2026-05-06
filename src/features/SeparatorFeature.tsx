import { defineComponent } from 'vue'
import type { FeaturePlugin } from '../types/plugin'

export const SeparatorFeature: FeaturePlugin = {
  name: 'separator',
  install: () => ({ extensions: [] }),
  toolbarComponent: defineComponent({
    name: 'ToolbarSeparator',
    setup: () => () => <div class="tiptap-separator" />,
  }),
}
