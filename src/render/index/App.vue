<script setup lang="ts">
import { onMounted, ref } from 'vue'
import UserMedia from './components/UserMedia.vue'
import Settings from './components/Settings.vue'
import RecordBar from './components/RecordBar.vue'
import { useDrag } from './composables/useDrag'

const { run } = useDrag()

const type = ref<'video' | 'settings'>('video')
const showFooter = ref(false)

onMounted(() => {
  run()
})
</script>

<template>
  <Suspense>
    <div
      w-full h-full relative
      @mouseenter="showFooter = true"
      @mouseleave="showFooter = false"
    >
      <UserMedia v-if="type === 'video'" />
      <Settings v-if="type === 'settings'" />
      <RecordBar v-show="showFooter" />
    </div>
  </Suspense>
</template>
