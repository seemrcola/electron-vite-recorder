<script setup lang="ts">
import { ref } from 'vue'
import Ruler from './ruler/index.vue'

const props = defineProps<{
  src: string
  path: string
  name: string
}>()

const videoRef = ref<HTMLVideoElement | null>(null)

function toggleVideo() {
  const video = videoRef.value!
  video.paused ? video.play() : video.pause()
}
</script>

<template>
  <div w-full h-full b="1px solid gray-2" rounded-1>
    <video
      ref="videoRef"
      :controls="false" autoplay muted
      :src="props.src"
      w-full h-full rounded-1
      @dblclick="toggleVideo"
    />
    <Ruler :src="props.src" :name="props.name" :path="props.path" />
  </div>
</template>
