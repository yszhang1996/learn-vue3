import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

declare module 'vue-router' {
    interface routeMeta {
        title: string
    }
}

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('../views/Index.vue'),
        redirect: '/home',
        children: [
            {
                path: 'home',
                component: () => import('../views/Home.vue'),
                meta: {
                    title: '商品列表',
                    isShow: true,
                },
            },
            {
                path: 'user',
                component: () => import('../views/User.vue'),
                meta: {
                    title: '用户列表',
                    isShow: true,
                },
            }
        ]
    },
    {
        path: '/login',
        component: () => import('../views/Login.vue'),
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router