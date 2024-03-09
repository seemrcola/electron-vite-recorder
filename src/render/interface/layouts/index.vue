<script setup lang="ts">
import { NLayout, NLayoutContent, NLayoutSider } from 'naive-ui'
import Sider from './components/Sider.vue'
</script>

<template>
  <NLayout has-sider>
    <NLayoutSider width="40" content-style="padding: 8px;" b-r="1px solid gray-2">
      <Sider />
    </NLayoutSider>
    <NLayoutContent content-style="padding: 16px;">
      <router-view />
    </NLayoutContent>
  </NLayout>
</template>
