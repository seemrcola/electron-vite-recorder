<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NCard, NButton } from 'naive-ui'

interface ConfigItem {
  label: string
  status: boolean
  icon: string
  type: string
}

const config = ref<ConfigItem[]>([
  { label: '屏幕录制', type:'scrren', status: false, icon: 'i-fluent:calendar-record-48-regular' },
  { label: '画布录制', type: 'canvas', status: false, icon: 'i-fluent:video-48-regular' },
])

function handleClick(index: number) {
  const item = config.value[index]
  if(item.type ==='scrren') recordScreen(item)
  if(item.type === 'canvas') recordCanvas(item)
}

function recordScreen(item: ConfigItem) {
  item.status 
   ? window.useRecord.stop() 
   : window.useRecord.start() 
}

function recordCanvas(item: ConfigItem) {
  item.status 
   ? window.useCanvasRecord.stop() 
   : window.useCanvasRecord.start() 
}

const computedButtonDisabled = computed(() => (item: ConfigItem) => {
  if (config.value.every(i => !i.status)) return false
  return !item.status
})

window.useRecord.onChangeIcon((status: boolean) => {
  const item = config.value.find(i => i.type ==='scrren')!
  item.status = status
  item.label = status ? '停止录制' : '屏幕录制'
})
</script>

<template>
  <div flex justify-around items-center flex-wrap>
    <n-card hoverable h-50 flex-1 v-for="(item, index) in config" :key="item.label" mx-4>
      <div flex flex-col justify-center items-center cursor-pointer>
        <div :class="[{ 'text-red': item.status }, `icon ${item.icon}`]" w-24 h-24 mb-8 />
        <n-button 
          @click="() => handleClick(index)" 
          :disabled="computedButtonDisabled(item)"
          :type="item.status ? 'primary' : 'default'">
          {{ item.label }}
        </n-button>
      </div>
    </n-card>
  </div>
</template>
