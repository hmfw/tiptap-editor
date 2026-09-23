import { Image } from '@tiptap/extension-image'
import { Decoration } from '@tiptap/core'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'

export const ImageWithAlign = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: 'left',
        parseHTML: (element) => element.getAttribute('data-align') ?? 'left',
        renderHTML: (attributes) => ({ 'data-align': attributes.align }),
      },
    }
  },

  addDecorations() {
    const name = this.name
    const collect = (doc: ProseMirrorNode, from: number, to: number) => {
      const decorations: ReturnType<typeof Decoration.Node>[] = []
      doc.nodesBetween(from, to, (node, pos) => {
        if (node.type.name === name && node.attrs.align) {
          decorations.push(
            Decoration.Node(pos, pos + node.nodeSize, { 'data-align': node.attrs.align }),
          )
        }
      })
      return decorations
    }

    return {
      update: 'changedRanges',
      create: ({ state }) => collect(state.doc, 0, state.doc.content.size),
      createInRange: ({ state, from, to }) => collect(state.doc, from, to),
    }
  },
})
