import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

declare module 'vue-router'{
    interface routeMeta{
        title: string
    }
}

const routes:Array<RouteRecordRaw> = [
    {
        path: '/',
        component: ()=> import('../views/Index.vue'),
        redirect: '/home',
        children:[{
            path:'home',
            component: ()=> import('../views/Home.vue'),
            meta: {
                title: '首页'
            },
        }]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router