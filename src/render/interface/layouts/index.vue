<script setup lang="ts">
import { NLayout, NLayoutContent, NLayoutFooter, NLayoutHeader, NLayoutSider } from 'naive-ui'
</script>

<template>
  <NLayout has-sider>
    <NLayoutSider content-style="padding: 8px;">
      海淀桥
    </NLayoutSider>
    <NLayout>
      <NLayoutHeader>颐和园路</NLayoutHeader>
      <NLayoutContent content-style="padding: 24px;">
        平山道
      </NLayoutContent>
      <NLayoutFooter>成府路</NLayoutFooter>
    </NLayout>
  </NLayout>
</template>

<style scoped>

</style>
