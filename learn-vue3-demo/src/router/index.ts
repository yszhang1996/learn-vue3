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
        meta: {
            title: '首页'
        },
        redirect: '/shuffle',
        children:[
            {
                path: 'shuffle',
                component: () =>import('../views/Shuffle.vue'),
                meta: {
                    title: '洗牌动画'
                },
            },
            {
                path: 'drag',
                component: () =>import('../views/Drag.vue'),
                meta: {
                    title: '自定义指令实现拖拽'
                },
            }
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router