
<template>
  <el-config-provider :locale="zhCn">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import { ElConfigProvider } from "element-plus"
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
// console.log(import.meta.env.VITE_BASE_API);
</script>

<style lang="scss">
* {
  margin: 0px;
  padding: 0px
}
</style>