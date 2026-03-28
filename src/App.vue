<script setup lang="ts">
import { ref } from 'vue'
import TiptapEditor from './TiptapEditor.vue'

const content = ref('')
</script>
<template>
  <TiptapEditor v-model="content" />
</template>
