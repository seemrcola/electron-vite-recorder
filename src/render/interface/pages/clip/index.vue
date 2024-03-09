<script setup lang="ts">
import { ref } from 'vue'
import Player from './components/player.vue'

const fileName = ref<string>('')
const objectURL = ref<string>('')
const fileSelector = ref<HTMLInputElement | null>(null)
function handleFileChange() {
  if (fileSelector.value?.files) {
    const file = fileSelector.value.files[0]
    fileName.value = file.name
    objectURL.value = URL.createObjectURL(file)
  }
}
</script>

<template>
  <main>
    <header
      h-32px flex-center bg="gray-2" color-blue-5 font-bold rounded-1
      class="text-white-shadow"
    >
      视频裁剪
    </header>
    <div w-full h-60px my-4 flex-center b="1px dashed gray-2">
      <label for="select-file" w-full h-full flex-center>
        <span class="text-black-shadow" text-light text-xs px-4 cursor-pointer>
          {{ fileName || '选择文件' }}
        </span>
        <input
          id="select-file"
          ref="fileSelector"
          type="file"
          fixed z--1 top--100 left--100 rounded-1
          @change="handleFileChange"
        >
      </label>
    </div>
    <Player
      w-full m-auto aspect-ratio="16/9"
      :src="objectURL"
    />
  </main>
</template>

<style scoped>
.text-white-shadow {
  text-shadow:
      -1px -1px 0 #fff,
      1px -1px 0 #fff,
      -1px  1px 0 #fff,
      1px  1px 0 #fff; /* 创建白色边缘 */
}
.text-black-shadow {
  text-shadow:
      -1px -1px 0 #000,
      1px -1px 0 #000,
      -1px  1px 0 #000,
      1px  1px 0 #000; /* 创建黑色边缘 */
}
</style>
