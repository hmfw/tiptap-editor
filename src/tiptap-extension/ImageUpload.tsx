import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import type { NodeType } from '@tiptap/pm/model'
import ImageUploadView from './ImageUploadView.vue'

export type UploadFn = (file: File) => Promise<string>

export interface ImageUploadOptions {
  type: string | NodeType
  accept: string
  limit: number
  maxSize: number
  upload?: UploadFn
  onError?: (error: Error) => void
  onSuccess?: (url: string) => void
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageUpload: {
      setImageUploadNode: () => ReturnType
    }
  }
}

export const ImageUpload = Node.create<ImageUploadOptions>({
  name: 'imageUpload',

  group: 'block',

  draggable: true,

  selectable: true,

  atom: true,

  addOptions() {
    return {
      type: 'image',
      accept: 'image/*',
      limit: 1,
      maxSize: 0,
      upload: (file: File) =>
        new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        }),
      onError: undefined,
      onSuccess: undefined,
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      accept: { default: this.options.accept },
      limit: { default: this.options.limit },
      maxSize: { default: this.options.maxSize },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="image-upload"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-type': 'image-upload' }, HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(ImageUploadView)
  },

  addCommands() {
    return {
      setImageUploadNode:
        () =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name })
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { selection } = editor.state
        const { nodeAfter } = selection.$from

        if (nodeAfter?.type.name === 'imageUpload' && editor.isActive('imageUpload')) {
          const nodeEl = editor.view.nodeDOM(selection.$from.pos)
          if (nodeEl instanceof HTMLElement) {
            const firstChild = nodeEl.firstChild
            if (firstChild instanceof HTMLElement) {
              firstChild.click()
              return true
            }
          }
        }
        return false
      },
    }
  },
})
