<script setup lang="ts">
import { NTooltip } from 'naive-ui'
</script>

<template>
  <div p="x-2 y-1" flex>
    <NTooltip>
      <template #trigger>
        <div
          class="i-iconoir:pause-window icon"
          text-xl mx-2 cursor-pointer transition-300 z-max
          hover="color-orange"
        />
      </template>
      <div>抓取屏幕</div>
    </NTooltip>
    <NTooltip>
      <template #trigger>
        <div
          class="i-ic:outline-photo-size-select-small icon"
          text-xl mx-2 cursor-pointer transition-300 z-max
          hover=" color-orange"
        />
      </template>
      <div>抓取范围</div>
    </ntooltip>
  </div>
</template>
