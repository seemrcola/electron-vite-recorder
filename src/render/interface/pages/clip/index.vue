<script setup lang="ts">
import { ref } from 'vue'
import Player from './components/player.vue'

const filePath = ref<string>('')
const fileName = ref<string>('')
const objectURL = ref<string>('')
const fileSelector = ref<HTMLInputElement | null>(null)

function handleFileChange() {
  if (fileSelector.value?.files) {
    const file = fileSelector.value.files[0]
    fileName.value = file.name
    filePath.value = file.path
    objectURL.value = URL.createObjectURL(file)
  }
}
</script>

<template>
  <main>
    <label
      v-if="!objectURL"
      for="select-file"
      w-full h-200px flex-center bg-gray-1
      b="1px dashed gray-3" rounded-1
    >
      选择文件上传
      <input

        id="select-file"
        ref="fileSelector"
        type="file"
        fixed z--1 top--100 left--100 rounded-1
        @change="handleFileChange"
      >
    </label>
    <Player
      v-else
      w-full m-auto aspect-ratio="16/9"
      :src="objectURL"
      :path="filePath"
      :name="fileName"
    />
  </main>
</template>
