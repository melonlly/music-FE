import Vue from 'vue'
import { AxiosInstance } from 'axios';
import { ECharts } from 'echarts';

declare module "vue/types/vue" {
	interface Vue {
		// 全局定义的属性
		$OK: number,
		$axios: AxiosInstance,
		// 非响应式属性挂载点
		$nRpsPty: any,
		$bus: Vue,
		$echarts: {
			init: (
				dom: HTMLDivElement | HTMLCanvasElement,
				theme?: object | string,
				opts?: {
					devicePixelRatio?: number
					renderer?: string
					width?: number | string
					height?: number | string
				}
			) => ECharts
		},
	}
}

declare module 'vue/types/options' {
	interface ComponentOptions<V extends Vue> {

	}
}