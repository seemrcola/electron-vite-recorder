<script setup lang="ts">
import { onMounted } from 'vue'
import { useSvgRegion } from './composables/useSvgRegion'

onMounted(() => {
  const { start } = useSvgRegion()
  start()
})
</script>

<template>
  <div w-full h-full class="mask" />
</template>

<style scoped>
.mask {
  position: fixed;
  overflow: hidden;
  background: transparent;
}
</style>
