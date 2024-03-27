<script setup lang="ts">
import { NTooltip } from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div w-full h-full overflow-hidden>
    <NTooltip placement="right">
      <template #trigger>
        <div class="i-icon-park:adobe-photoshop" w-6 h-6 cursor-pointer />
      </template>
      todo
    </NTooltip>

    <NTooltip placement="right">
      <template #trigger>
        <div class="i-icon-park:compression" w-6 h-6 my-4 cursor-pointer />
      </template>
      todo
    </NTooltip>

    <NTooltip placement="right">
      <template #trigger>
        <div class="i-icon-park:file-settings" w-6 h-6 cursor-pointer />
      </template>
      todo
    </NTooltip>
  </div>
</template>

<style scoped>

</style>
