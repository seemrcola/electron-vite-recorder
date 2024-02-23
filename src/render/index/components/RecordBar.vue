<script setup lang="ts">
import { ref } from 'vue'

const recordingStatus = ref(false)

async function startRecording() {
  console.log('start recording')
  // start recording
  const [err] = await window.useRecord.start()
  if (err)
    console.error(err)
}

async function stopRecording() {
  console.log('stop recording')
  // stop recording
  const [err] = await window.useRecord.stop()
  if (err)
    console.error(err)
}
</script>

<template>
  <div
    class="fade-in"
    rounded-full
    absolute bottom-2 x-center z-max
    cursor-pointer
  >
    <div
      v-if="!recordingStatus"
      class="i-ic:baseline-not-started icon hover:scale-110 transition-300"
      h-8 w-8 text-light
      @click="startRecording"
    />
    <div
      v-else
      class="i-material-symbols:stop-circle-outline icon hover:scale-110 transition-300"
      h-8 w-8 text-red-5
      @click="stopRecording"
    />
  </div>
</template>

<style scoped>
.fade-in {
  animation: FadeIn 0.3s ease-in-out;
}

@keyframes FadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
