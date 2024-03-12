<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useXDrag } from './useXDrag'

const props = defineProps<{
  src: string
}>()

/* 尺子功能 */
const videoRef = ref<HTMLVideoElement | null>(null)

const rulerRef = ref<HTMLDivElement | null>(null)
const leftRef = ref<HTMLDivElement | null>(null)
const rightRef = ref<HTMLDivElement | null>(null)
const rulerWidth = ref(0)

const leftHookResult = ref<any>({})
const rightHookResult = ref<any>({})

const coverWidth = ref(0)
const coverLeft = ref(0)

const popupX = ref(0)

watch(
  () => [leftHookResult.value.x, rightHookResult.value.x], // 只要x变了代表在移动
  ([l, r], [ol, or]) => {
    // 先获取尺子到的clientX
    const rulerClientX = rulerRef.value!.getBoundingClientRect().left
    // 获取leftRef的clientX
    const leftClientX = leftRef.value!.getBoundingClientRect().left
    // 获取rightRef的clientX
    const rightClientX = rightRef.value!.getBoundingClientRect().left

    // 计算cover的宽度和left
    coverWidth.value = Math.abs(rightClientX - leftClientX)
    coverLeft.value = Math.min(leftClientX, rightClientX) - rulerClientX

    // 判断是l在移动还是r在移动
    if (l !== ol) {
      // l在移动
      popupX.value = leftClientX - rulerClientX
    }
    if (r !== or) {
      // r在移动
      popupX.value = rightClientX - rulerClientX
    }
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

const frames = ref<string[]>([])
watch(
  () => props.src,
  () => getFrames(),
  { immediate: true },
)
function getFrames() {
  if (!videoRef.value)
    return frames.value = []
  if (!props.src)
    return frames.value = []

  // todo 获取视频帧
}

onMounted(() => {
  initRuler()
})
</script>

<template>
  <div
    ref="rulerRef"
    w="90%" b="0.25rem solid dark" m-auto h-50px my-4
    flex relative
  >
    <img
      v-for="(item, index) of frames" :key="index"
      :src="item" alt="video"
      flex-1
    >
    <div
      ref="leftRef"
      h-full w="4px" bg-blue
      absolute z-9 cursor-pointer
    />
    <div
      ref="rightRef"
      h-full w="4px" bg-red
      absolute z-9 cursor-pointer
    />
    <!--    红蓝边界中间的部分 -->
    <div
      absolute z-5 bg="#ff440022" h-full
      :style="{ left: `${coverLeft}px`, width: `${coverWidth}px` }"
    />
    <!--    图像弹出层 -->
    <div
      w-120px h-80px flex-center
      absolute z-1000 bottom-60px bg-gray-2
      :style="{ left: `${popupX}px` }" translate-x="-50%"
    >
      <img v-if="0" src="" alt="">
      <div h-10 w-10 class="i-tabler:error-404" />
    </div>
  </div>
</template>
