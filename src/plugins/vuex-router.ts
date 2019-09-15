import router from "@/router"
import { Store } from 'vuex'
import { SET_SHOWLOGIN, SET_TO, SET_FROM } from '@/store/mutation-types'

const vuexRouterInterceptor = () => {
	return (store: Store<any>) => {
		router.beforeEach((to, from, next) => {
			// 判断是否需要做认证
			if (to.matched.some(record => record.meta.requiresAuth)) {
				if (!store.getters.getUserInfo) {
					// 认证未通过（登录验证）
					// 提示登录
					store.commit(SET_SHOWLOGIN, true)
					// 设置来源path
					store.commit(SET_FROM, from.path)
					// 设置登陆后要跳转的path
					store.commit(SET_TO, to.path)
				} else {
					next()
				}
			} else {
				next()
			}
		})
	}
}

export default vuexRouterInterceptor
