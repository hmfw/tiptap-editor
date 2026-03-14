<script setup lang="ts">
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'
import { Placeholder } from '@tiptap/extensions'

// --- Tiptap UI ---
import UndoRedoButton from './tiptap-ui/UndoRedoButton'
import TextStyleButton from './tiptap-ui/TextStyleButton'
import TextAlignButton from './tiptap-ui/TextAlignButton'
import ListButton from './tiptap-ui/ListButton'
import ImageButton from './tiptap-ui/ImageButton'

import './editor.scss'

const editor = new Editor({
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: '请输入内容...',
    }),
  ],
})
</script>
<template>
  <div class="tiptap-editor">
    <div class="tiptap-toolbar">
      <UndoRedoButton />
      <div class="tiptap-separator"></div>
      <TextStyleButton />
      <div class="tiptap-separator"></div>
      <ListButton />
      <div class="tiptap-separator"></div>
      <TextAlignButton />
      <div class="tiptap-separator"></div>
      <ImageButton />
    </div>
    <EditorContent class="editor-content" :editor="editor" />
  </div>
</template>
