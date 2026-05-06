import UndoRedoButton from '../tiptap-ui/UndoRedoButton'
import type { FeaturePlugin } from '../types/plugin'

export const UndoRedoFeature: FeaturePlugin = {
  name: 'undo-redo',
  install: () => ({ extensions: [] }),
  toolbarComponent: UndoRedoButton,
}
