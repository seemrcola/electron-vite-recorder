<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NCard, NButton } from 'naive-ui'

interface ConfigItem {
  label: string
  status: boolean
  icon: string
}

enum RecordLabelEnum {
  RECORDPREPARATION = '启动录制',
  RECORDING = '正在录制',
}

const config = ref<ConfigItem[]>([
  { label: '屏幕录制', status: false, icon: 'i-fluent:calendar-record-48-regular' },
  { label: '画布录制', status: false, icon: 'i-fluent:video-48-regular' },
])

let initLabel = ''

function handleClick(item: ConfigItem) {
  if(item.label === '屏幕录制') recordScreen(item)
  if(item.label === '画布录制') console.log('画布录制 todo')
}

function recordScreen(item: ConfigItem) {
    if (!item.status) {
    initLabel = item.label
    item.label = RecordLabelEnum.RECORDPREPARATION
    window.useRecord.start()
  }
  else {
    window.useRecord.stop()
  }
}

const computedButtonDisabled = computed(() => (item: ConfigItem) => {
  if (config.value.every(i => !i.status)) return false
  return !item.status
})

window.useRecord.onChangeIcon((status: boolean) => {
  // 开启录制
  if (status) {
    // 如果有一个正在进行的录制，则禁止再次点击
    if (config.value.some(i => i.status)) return
    // 找到label为 启动录制 的按钮，更新状态
    const index = config.value.findIndex(i => i.label === RecordLabelEnum.RECORDPREPARATION)
    if (index !== -1) {
      config.value[index].status = true
      config.value[index].label = RecordLabelEnum.RECORDING
    }
  }
  // 结束录制
  else {
    // 找到label为 正在录制 的按钮，更新状态
    const index = config.value.findIndex(i => i.label === RecordLabelEnum.RECORDING)
    if (index !== -1) {
      config.value[index].status = false
      config.value[index].label = initLabel
    }
  }
})
</script>

<template>
  <div flex justify-around items-center flex-wrap>
    <n-card hoverable h-50 flex-1 v-for="(item, index) in config" :key="item.label" mx-4>
      <div flex flex-col justify-center items-center cursor-pointer>
        <div :class="[{ 'text-red': item.status }, `icon ${item.icon}`]" w-24 h-24 mb-8 />
        <n-button @click="() => handleClick(item)" :disabled="computedButtonDisabled(item)"
          :type="item.status ? 'primary' : 'default'">
          {{ item.label }}
        </n-button>
      </div>
    </n-card>
  </div>
</template>
