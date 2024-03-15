<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useXDrag } from './useXDrag'

const props = defineProps<{
  src: string
  path: string
  name: string
}>()

const emits = defineEmits<{
  (e: 'updateTime', time: number): void
}>()

/* 尺子功能 */
const rulerRef = ref<HTMLDivElement | null>(null)
const leftRef = ref<HTMLDivElement | null>(null)
const rightRef = ref<HTMLDivElement | null>(null)
const rulerWidth = ref(0)

const leftHookResult = ref<any>({})
const rightHookResult = ref<any>({})

const coverWidth = ref(0)
const coverLeft = ref(0)

const popupX = ref(0)

const duration = ref(0)

watch(
  () => [leftHookResult.value.x, rightHookResult.value.x], // 只要x变了代表在移动
  ([l, r], [ol, or]) => moveLine(l, r, ol, or),
)

function moveLine(l: number, r: number, ol: number, or: number) {
  const rulerClientX = rulerRef.value!.getBoundingClientRect().left // 先获取尺子到的clientX
  const leftClientX = leftRef.value!.getBoundingClientRect().left // 获取leftRef的clientX
  const rightClientX = rightRef.value!.getBoundingClientRect().left // 获取rightRef的clientX

  // 计算cover的宽度和left
  coverWidth.value = Math.abs(rightClientX - leftClientX)
  coverLeft.value = Math.min(leftClientX, rightClientX) - rulerClientX

  // 判断是l在移动还是r在移动
  if (l !== ol)
    popupX.value = leftClientX - rulerClientX
  if (r !== or)
    popupX.value = rightClientX - rulerClientX

  emits('updateTime', popupX.value / rulerWidth.value * duration.value)
}

function initRuler() {
  const ruler = rulerRef.value!
  rulerWidth.value = ruler.clientWidth

  // 左侧右侧的先定位
  leftRef.value!.style.left = '0'
  rightRef.value!.style.left = `${rulerWidth.value - 4}px`

  // 左侧右侧的拖动
  const left = leftRef.value!
  const right = rightRef.value!
  leftHookResult.value = useXDrag(left, { border: rulerWidth.value - 4 })
  rightHookResult.value = useXDrag(right, { border: rulerWidth.value - 4 })
}

const frames = ref<string[]>([])
const showFrames = ref<string[]>([])
watch(
  () => props.src,
  () => getFrames(),
  { immediate: true },
)
function getFrames() {
  if (!props.src)
    return frames.value = []

  fetch('http://localhost:3000/frame', {
    method: 'POST',
    body: JSON.stringify({
      filePath: props.path,
      fileName: props.name,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then((data) => {
      const base64s = data.data.frames
      duration.value = data.data.duration
      frames.value = base64s
      showFrames.value = base64s.filter(
        (_: string, index: number) => index % 3 === 0 || index === base64s.length - 1,
      )
      console.log(showFrames.value.length)
    })
}

const showPopup = computed(() => {
  // 当距离左右边界距离大于4px的时候 返回true
  return (popupX.value > 4) && (rulerWidth.value - popupX.value > 4)
})

const currentFrame = computed(() => {
  // 根据坐标算出对应的url
  const len = frames.value.length
  if (len === 0)
    return

  const index = Math.floor((popupX.value / rulerWidth.value) * len)
  return frames.value[index]
})

onMounted(() => {
  initRuler()
})
</script>

<template>
  <div
    ref="rulerRef"
    relative
    w="90%" b="2px solid dark"
    rounded-1 m-auto h-50px
    flex box-border
  >
    <!--    loading -->
    <div
      v-if="duration === 0"
      absolute w-full h-full left-0 top-0 text-blue
      flex-center z-max
    >
      <div class="i-eos-icons:bubble-loading" w-6 h-6 />
    </div>
    <div w-full overflow-hidden flex>
      <img
        v-for="(base64, index) of showFrames" :key="index"
        :src="base64" alt="base64"
      >
    </div>
    <div
      ref="leftRef"
      h-full w="4px" bg-blue
      absolute z-999 cursor-pointer
    />
    <div
      ref="rightRef"
      h-full w="4px" bg-red
      absolute z-999 cursor-pointer
    />
    <!--    红蓝边界中间的部分 -->
    <div
      absolute z-5 bg="#ff666620" h-full
      :style="{ left: `${coverLeft}px`, width: `${coverWidth}px` }"
    />
    <!--    图像弹出层 -->
    <div
      v-show="showPopup"
      w-120px h-80px flex-center
      absolute z-max top--90px translate-x="-50%"
      bg-gray-1 :style="{ left: `${popupX}px` }"
    >
      <img v-if="currentFrame" w-full h-full :src="currentFrame" alt="">
      <div h-10 w-10 class="i-tabler:error-404" />
    </div>
  </div>
</template>
