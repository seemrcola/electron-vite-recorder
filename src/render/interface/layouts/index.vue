<script setup lang="ts">
import { NLayout, NLayoutContent, NLayoutSider } from 'naive-ui'
</script>

<template>
  <NLayout has-sider>
    <NLayoutSider width="80" content-style="padding: 8px;" b-r="1px solid gray-2">
      <slot name="side" />
    </NLayoutSider>
    <NLayoutContent content-style="padding: 8px;">
      <router-view />
    </NLayoutContent>
  </NLayout>
</template>
