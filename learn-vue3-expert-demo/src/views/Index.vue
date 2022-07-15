<template>
  <div class="container common-layout">
    <el-container>
      <el-header class="common-layout-header">
        <Header />
      </el-header>
      <el-container>
        <el-aside width="200px">
          <NavMenu />
        </el-aside>
        <el-container>
          <el-main class="common-layout-main">
            <router-view></router-view>
          </el-main>
          <el-footer class="common-layout-footer">
            <Footer />
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import Header from "../components/Header.vue";
import NavMenu from "../components/NavMenu.vue";
import Footer from "../components/Footer.vue";
</script>

<style lang="scss">
.common-layout-header {
  padding: 0;
}

.common-layout-footer {
  height: 30px;
}

.common-layout-main {
  padding: 0;
}
</style>