import { ImageWithAlign } from '../tiptap-extension/ImageWithAlign'
import { ImageUpload } from '../tiptap-extension/ImageUpload'
import ImageButton from '../tiptap-ui/ImageButton'
import ImageControls from '../tiptap-ui/ImageControls'
import type { FeaturePlugin } from '../types/plugin'
import type { UploadFn } from '../types'

export function ImageFeature(upload?: UploadFn): FeaturePlugin {
  return {
    name: 'image',
    install: () => ({
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
        ImageUpload.configure({ ...(upload ? { upload } : {}) }),
      ],
      controlComponent: ImageControls,
    }),
    toolbarComponent: ImageButton,
  }
}
