import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import ElementPlus from 'unplugin-element-plus/vite'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    return {
      plugins: [
        vue(),
        vueJsx(),
        ElementPlus({}),
        dts({
          include: ['src/index.ts', 'src/TiptapEditor.vue', 'src/components', 'src/tiptap-extension'],
          outDir: 'dist',
          rollupTypes: true,
          tsconfigPath: './tsconfig.app.json',
        }),
      ],
      build: {
        copyPublicDir: false,
        lib: {
          entry: './src/index.ts',
          name: 'TiptapEditor',
          fileName: 'tiptap-editor',
          formats: ['es', 'umd'],
        },
        rollupOptions: {
          external: [
            'vue',
            'element-plus',
            /^@element-plus\//,
            /^@tiptap\//,
            'katex',
            'lowlight',
          ],
          output: {
            globals: {
              vue: 'Vue',
              'element-plus': 'ElementPlus',
              '@tiptap/core': 'TiptapCore',
              '@tiptap/vue-3': 'TiptapVue3',
              '@tiptap/vue-3/menus': 'TiptapVue3Menus',
              '@tiptap/starter-kit': 'TiptapStarterKit',
              '@tiptap/extension-list': 'TiptapExtensionList',
              '@tiptap/extension-text-align': 'TiptapExtensionTextAlign',
              '@tiptap/extension-placeholder': 'TiptapExtensionPlaceholder',
              '@tiptap/extension-image': 'TiptapExtensionImage',
              '@tiptap/extension-code-block-lowlight': 'TiptapExtensionCodeBlockLowlight',
              '@tiptap/extension-table': 'TiptapExtensionTable',
              '@tiptap/extension-mathematics': 'TiptapExtensionMathematics',
              '@tiptap/pm/state': 'TiptapPmState',
              '@tiptap/pm/view': 'TiptapPmView',
              katex: 'katex',
              lowlight: 'lowlight',
            },
          },
        },
      },
    }
  }

  return {
    base: '/tiptap-editor/',
    plugins: [vue(), vueJsx(), ElementPlus({})],
    build: {
      outDir: 'dist-app',
    },
  }
})
