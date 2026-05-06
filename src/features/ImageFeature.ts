import { ImageWithAlign } from '../tiptap-extension/ImageWithAlign'
import { ImageUpload } from '../tiptap-extension/ImageUpload'
import ImageButton from '../tiptap-ui/ImageButton'
import ImageControls from '../tiptap-ui/ImageControls'
import type { FeaturePlugin } from '../types/plugin'

export const ImageFeature: FeaturePlugin = {
  name: 'image',
  install: (ctx) => ({
    extensions: [
      ImageWithAlign.configure({
        allowBase64: true,
        resize: {
          enabled: true,
          directions: ['top', 'right', 'bottom', 'left', 'top-right', 'top-left', 'bottom-right', 'bottom-left'],
          minWidth: 50,
          minHeight: 50,
          alwaysPreserveAspectRatio: false,
        },
      }),
      ImageUpload.configure({ ...(ctx.upload ? { upload: ctx.upload } : {}) }),
    ],
    controlComponent: ImageControls,
  }),
  toolbarComponent: ImageButton,
}
