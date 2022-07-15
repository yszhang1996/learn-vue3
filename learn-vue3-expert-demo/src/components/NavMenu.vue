<template>
    <div class="navmenu-container">
        <el-menu class="el-menu-vertical-demo" :default-active="onRouteChange" router>
            <el-menu-item :index="item.path" v-for="item in menuRouterList" :key="item.path">
                <span>{{ item.meta.title }}</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter, RouteRecordNormalized } from 'vue-router';
import { computed, ref } from "vue";
// 一个计算属性 ref
const onRouteChange = computed(() => {
    const route = useRoute()
    const { path, meta } = route;
    if (meta.activePath) {
        return meta.activePath;
    }
    return path;
})
// 获取所有的路由列表
const routerList = useRouter().getRoutes()
const menuRouterList: RouteRecordNormalized[] = routerList.filter(v => v.meta.isShow)
// // 获取后端返回的该用户拥有权限的路由列表
// const pagePermissionList = JSON.parse(localStorage.getItem('pagePermissionList') as string)
// // 根据路由列表和权限路由列表筛选出左侧菜单栏应该展示的数据
// const menuRouterList:RouteRecordNormalized[] = []
// pagePermissionList.forEach((item: string) => {
//     for (let i = 0; i < routerList.length; i++) {
//         if (routerList[i].path === item) {
//             menuRouterList.push(routerList[i])
//         }
//     }
// });
console.log(menuRouterList);

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