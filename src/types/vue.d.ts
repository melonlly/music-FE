import Vue from 'vue'
import { AxiosInstance } from 'axios';

declare module "vue/types/vue" {
	interface Vue {
		// 全局定义的属性
		$OK: number,
		$axios: AxiosInstance,
		// 非响应式属性挂载点
		$nRpsPty: any,
	}
}

declare module 'vue/types/options' {
	interface ComponentOptions<V extends Vue> {

	}
}