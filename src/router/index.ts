import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
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
    ],
})
