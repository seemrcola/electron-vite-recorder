<script setup lang="ts">
import { onMounted } from 'vue'
import { useSvgRegion } from './composables/useSvgRegion'

onMounted(() => {
  const { start } = useSvgRegion()
  start()

  console.dir(document.querySelector('body'))
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
