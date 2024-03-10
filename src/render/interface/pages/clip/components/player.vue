<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
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

const leftHookResult = ref<any>({})
const rightHookResult = ref<any>({})

const coverWidth = ref(0)
const coverLeft = ref(0)

watch(
  () => [leftHookResult.value.x, rightHookResult.value.x], // 只要x变了代表在移动
  () => {
    // 先获取尺子到的clientX
    const rulerClientX = rulerRef.value!.getBoundingClientRect().left
    // 获取leftRef的clientX
    const leftClientX = leftRef.value!.getBoundingClientRect().left
    // 获取rightRef的clientX
    const rightClientX = rightRef.value!.getBoundingClientRect().left

    // 计算cover的宽度和left
    coverWidth.value = Math.abs(rightClientX - leftClientX)
    coverLeft.value = Math.min(leftClientX, rightClientX) - rulerClientX
  },
)

function initRuler() {
  const ruler = rulerRef.value!
  rulerWidth.value = ruler.clientWidth

  // 左侧右侧的先定位
  leftRef.value!.style.left = '-4px'
  rightRef.value!.style.left = `${rulerWidth.value}px`

  // 左侧右侧的拖动
  const left = leftRef.value!
  const right = rightRef.value!
  leftHookResult.value = useXDrag(left, { border: rulerWidth.value - 4 })
  rightHookResult.value = useXDrag(right, { border: rulerWidth.value - 4 })
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
        ref="leftRef" h-full w="4px" bg-blue
        absolute z-9 cursor-pointer
      />
      <div
        ref="rightRef" h-full w="4px" bg-red
        absolute z-9 cursor-pointer
      />
      <div
        absolute z-1 bg-red-1 h-full
        :style="{ left: `${coverLeft}px`, width: `${coverWidth}px` }"
      />
    </div>
  </div>
</template>
