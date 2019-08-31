import {
	AxiosRequestConfig,
	AxiosInstance,
	AxiosInterceptorManager,
	AxiosResponse,
	AxiosStatic,
} from 'axios'

declare module 'axios' {
	export interface MAxiosRequestConfig extends AxiosRequestConfig {
		neverCancel?: boolean
	}
	
	// export interface MAxiosInstance extends AxiosInstance {
	// 	interceptors: {
	// 		request: AxiosInterceptorManager<MAxiosRequestConfig>;
	// 		response: AxiosInterceptorManager<AxiosResponse>;
	// 	}
	// }
	
	// export interface MAxiosStatic extends AxiosStatic {
	// 	create(config?: MAxiosRequestConfig): MAxiosInstance;
	// }
	
	// export const Axios: AxiosStatic
}