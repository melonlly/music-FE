import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    routes: [
        {
            name: 'root',
            path: '/',
            redirect: '/recommend',
        },
        {
            name: 'recommend',
            path: '/recommend',
            // 路由懒加载 + webpack按组分包（code split）
            component: () => import(/* webpackChunkName: "recommend" */ '@/views/Recommend.vue'),
        },
        {
            name: 'singer',
            path: '/singer',
            component: () => import(/* webpackChunkName: "singer" */ '@/views/singer-list.vue'),
            children: [
                {
                    path: ':mid',
                    component: () => import(/* webpackChunkName: "singer" */ '@/views/singer-detail.vue'),
                }
            ]
        },
        {
            name: 'rank',
            path: '/rank',
            component: () => import(/* webpackChunkName: "rank" */ '@/views/rank.vue'),
            children: [
                {
                    path: ':mid',
                    component: () => import(/* webpackChunkName: "rank" */ '@/views/rank-detail.vue'),
                }
            ]
        },
        {
            name: 'search',
            path: '/search',
            component: () => import(/* webpackChunkName: "search" */ '@/views/search.vue'),
        },
        {
            name: 'user-center',
            path: '/user-center',
            component: () => import(/* webpackChunkName: "user" */ '@/views/user-center.vue'),
            meta: {
                requiresAuth: true
            }
        },
    ],
})

export default router
