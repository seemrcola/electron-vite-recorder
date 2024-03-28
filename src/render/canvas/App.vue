<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useDrag } from '../_common/useDrag'

const { run } = useDrag({
  afterDrag: ((opt: { x: number, y: number }) => {
    window.useDrag['canvas:drag']({ x: opt.x, y: opt.y })
  })
})

onMounted(() => {
  run()
})
</script>

<template>
  <Suspense>
    <div w-full h-full relative>
      hello world
    </div>
  </Suspense>
</template>
