import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table'
import TableButton from '../tiptap-ui/TableButton'
import TableControls from '../tiptap-ui/TableControls'
import type { FeaturePlugin } from '../types/plugin'

export const TableFeature: FeaturePlugin = {
  name: 'table',
  install: () => ({
    extensions: [Table.configure({ resizable: true }), TableRow, TableHeader, TableCell],
    controlComponent: TableControls,
  }),
  toolbarComponent: TableButton,
}
