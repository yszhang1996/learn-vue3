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
        redirect: '/projectinfo',
        children: [
            {
                path: 'projectinfo',
                component: () => import('../views/ProjectInfo/ProjectInfo.vue'),
                meta: {
                    title: '评标项目信息',
                    isShow: true,
                },
            },
            {
                path: "/myTrain",
                component: () => import('../views/MyTrain/MyTrain.vue'),
                meta: {
                    title: '我的培训',
                    isShow: true,
                },
            },
            {
                path: "/traindetail",
                component: () => import('../views/MyTrain/TrainDetail.vue'),
                meta: {
                    title: '培训详情',
                    isShow: false,
                    activePath: '/myTrain'
                },
            },
            {
                path: "/coursedetail",
                component: () => import('../views/MyTrain/CourseDetail.vue'),
                meta: {
                    title: '培训课程详情',
                    isShow: false,
                    activePath: '/myTrain'
                },
            },
            {
                path: "/examination",
                component: () => import('../views/MyExam/MyExam.vue'),
                meta: {
                    title: '我的考试',
                    isShow: true,
                },
            },
            {
                path: "/randompractice",
                component: () => import('../views/MyExam/RandomPractice.vue'),
                meta: {
                    title: '随机练习',
                    isShow: false,
                    activePath: '/examination'
                },
            },
            {
                path: "/exampaper",
                component: () => import('../views/MyExam/ExamPaper.vue'),
                meta: {
                    title: '考试试卷',
                    isShow: false,
                    activePath: '/examination'
                },
            },
            {
                path: "/usercenter",
                component: () => import('../views/UserCenter/UserCenter.vue'),
                meta: {
                    title: '个人中心',
                    isShow: true,
                },
            },
            {
                path: "/message",
                component: () => import('../views/Message/Message.vue'),
                meta: {
                    title: '消息通知',
                    isShow: false,
                    activePath: '/usercenter'
                },
            },
            {
                path: "/leave",
                component: () => import('../views/UserCenter/Leave.vue'),
                meta: {
                    title: '请假',
                    isShow: false,
                    activePath: '/usercenter'
                },
            },
            {
                path: "/evaluatelist",
                component: () => import('../views/UserCenter/EvaluateList.vue'),
                meta: {
                    title: '我的评价',
                    isShow: false,
                    activePath: '/usercenter'
                },
            },
            {
                path: "/punishlist",
                component: () => import('../views/UserCenter/PunishList.vue'),
                meta: {
                    title: '违规记录',
                    isShow: false,
                    activePath: '/usercenter'
                },
            },
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