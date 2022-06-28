<template>
    <div class="navmenu-container">
        <el-menu class="el-menu-vertical-demo" :default-active="onRouteChange" router>
            <el-menu-item :index="item.path" v-for="item in routerList" :key="item.path">
                <span>{{ item.meta.title }}</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { computed } from "vue";
const routerList = useRouter().getRoutes().filter(v => v.meta.isShow)
// 一个计算属性 ref
const onRouteChange = computed(() => {
    const route = useRoute()
    const { path } = route;
    return path;
})

</script>

<style>
.navmenu-container {
    height: calc(100vh - 60px);
}

.el-menu {
    height: 100%;
    ;
}
</style>