<template>
    <div class="navmenu-container">
        <el-menu class="el-menu-vertical-demo" router>
            <el-menu-item :index="item.path" v-for="item in routerList" :key="item.path">
                <span>{{ item.meta.title }}</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
const routerList = useRouter().getRoutes().filter(v => v.meta.isShow)
console.log(routerList);

</script>

<style>
.navmenu-container {
    height: calc(100vh - 60px);
}
</style>