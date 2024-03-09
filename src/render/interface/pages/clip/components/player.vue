<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useXDrag } from '../../../composables/useXDrag'

const props = defineProps<{
  src: string
}>()

const videoRef = ref<HTMLVideoElement | null>(null)

function toggleVideo() {
  const video = videoRef.value!
  video.paused ? video.play() : video.pause()
}

/* 尺子功能 */
const rulerRef = ref<HTMLDivElement | null>(null)
const leftRef = ref<HTMLDivElement | null>(null)
const rightRef = ref<HTMLDivElement | null>(null)
const rulerWidth = ref(0)

function initRuler() {
  const ruler = rulerRef.value!
  rulerWidth.value = ruler.clientWidth

  // 左侧右侧的先定位
  leftRef.value!.style.left = '0'
  rightRef.value!.style.left = `${rulerWidth.value - 1}px`

  // 左侧右侧的拖动
  const left = leftRef.value!
  const right = rightRef.value!
  useXDrag(left)
  useXDrag(right)
}

onMounted(() => {
  initRuler()
})
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
    <div ref="rulerRef" w="90%" b="0.25rem solid dark" m-auto h-50px my-4 relative>
      <div
        ref="leftRef" h-full w-1 bg-blue
        absolute cursor-pointer
      />
      <div
        ref="rightRef" h-full w-1 bg-red
        absolute cursor-pointer
      />
    </div>
  </div>
</template>
