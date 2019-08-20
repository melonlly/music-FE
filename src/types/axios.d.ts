import {
	AxiosRequestConfig as MAxiosRequestConfig,
	AxiosInstance as MAxiosInstance,
	AxiosInterceptorManager,
	AxiosResponse,
	AxiosStatic as MAxiosStatic,
} from 'axios'

export declare interface AxiosRequestConfig extends MAxiosRequestConfig {
	neverCancel?: boolean
}

export declare interface AxiosInstance extends MAxiosInstance {
	interceptors: {
		request: AxiosInterceptorManager<AxiosRequestConfig>;
		response: AxiosInterceptorManager<AxiosResponse>;
	}
}

export declare interface AxiosStatic extends MAxiosStatic {
	create(config?: MAxiosRequestConfig): AxiosInstance;
}

declare const Axios: AxiosStatic;

export default Axios