<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { NSlider } from 'naive-ui'
import Ruler from '../ruler/index.vue'

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

function updateTime(time: number) {
  // 获取到视频的时长 将src处理成file
  videoRef.value!.currentTime = time
}

const playStatus = ref(false)
const showControlBar = ref(false)
function addVideoListener(video: HTMLVideoElement) {
  video.oncanplay = () => {
    video.play()
  }
  video.onplay = () => {
    playStatus.value = true
  }
  video.onpause = () => {
    playStatus.value = false
  }
  video.ontimeupdate = () => {
    dragBarValue.value = video.currentTime
    // 将这段动画做的丝滑一点
    
  }
}

// 处理拖动条
const dragBarValue = ref(0)
// todo: 如何处理拖动条和时间轴的同步

onMounted(() => {
  addVideoListener(videoRef.value!)
})
</script>

<template>
  <div w-full h-full b="1px solid gray-2" rounded-1 relative p-2 box-border>
    <div w-full h-full box-border relative="" overflow-hidden>
      <video
        ref="videoRef"
        :controls="false"
        :src="props.src"
        w-full h-full rounded-1
        @dblclick="toggleVideo"
        @mouseenter="showControlBar = true"
      />
      <!--    遮罩 -->
      <div
        v-show="!playStatus" absolute z-max left-0
        top-0 w-full
        h-full
        flex-center
        @dblclick="toggleVideo"
      >
        <div
          w-10 h-10 text-light-3 cursor-pointer
          class="i-material-symbols:play-circle-outline"
          @click="() => videoRef?.play()"
        />
      </div>
      <!--      控制条 -->
      <div
        v-show="showControlBar"
        class="moveUp"
        absolute w-full h-40px left-0 bottom-0
        bg="[rgba(0,0,0,0.7)]" text-light
        flex items-center
        @click.stop
      >
        <div flex-center>
          <div
            v-show="playStatus"
            w-8 h-8 text-light-3 cursor-pointer transition-300 hover="scale-105 text-blue-3"
            class="i-material-symbols:pause-circle-outline"
            @click="() => videoRef?.pause()"
          />
          <div w-4 />
          <NSlider v-model:value="dragBarValue" w-100 :step="0.01" :min="0" :max="videoRef?.duration" />
        </div>
      </div>
    </div>
    <Ruler
      v-if="0"
      mt-4
      :src="props.src" :name="props.name" :path="props.path"
      @update-time="updateTime"
    />
  </div>
</template>

<style scoped>
.moveUp {
  animation: MoveUp linear 0.5s;
}

@keyframes MoveUp {
  0% {
    transform: translateY(100%);
  }
  50% {
    transform: translateY(60%);
  }
  100% {
    transform: translateY(0%);
  }
}
</style>
