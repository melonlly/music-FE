import axios, { AxiosResponse, CancelTokenStatic, Canceler, MAxiosRequestConfig } from 'axios';
import Vue from 'vue'
import Bus from "@/components/Bus.vue";
import echarts from "echarts";

/* 防止重复提交，利用axios的cancelToken
   如需允许多个提交同时发出。则需要在请求配置config中增加 neverCancel 属性，并设置为true
*/
let pending: CancelTokenStatic[] = [] // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
const CancelToken: CancelTokenStatic = axios.CancelToken

const removePending = (config: any, cancel?: Canceler) => {
    const url = config.url // 获取请求的url
    // 判断该请求是否在请求队列中
    if (pending.indexOf(url) !== -1) {
        if (cancel) {
            cancel('取消重复请求')
        } else {
            pending.splice(pending.indexOf(url), 1) // 移除当前请求
        }
    } else {
        // 如果不存在在请求队列中，加入队列（request时）
        if (cancel) {
            pending.push(url)
        }
    }
}

// 创建axios实例
const getService = (options: any) => {
    const service = axios.create({
        baseURL: `${options.url}/api`,
        // 即将被发送的自定义请求头
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
        },
        timeout: 60000,
        // 服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
        responseType: 'json',
    })

    // request拦截器
    service.interceptors.request.use(
        (reqConfig: MAxiosRequestConfig) => {
            // neverCancel配置项，允许多个请求
            if (reqConfig.neverCancel) {
                // 生成cancelToken
                reqConfig.cancelToken = new CancelToken((cancel: Canceler) => {
                    removePending(reqConfig, cancel)
                })
            }

            // 统一修改请求头 TODO

            return reqConfig
        },
        (error: any) => {
            console.error(error)
            return Promise.reject(error)
        },
    )

    // response拦截器
    service.interceptors.response.use(
        (response: AxiosResponse) => {
            removePending(response.config)
            return response && response.data
        },
        (error: any) => {
            console.error(error)
            pending = []
            return Promise.reject(error)
        },
    )

    return service
}

// 事件bus
const bus = new Bus()

export default {
    install(V: typeof Vue, options: any) {
        V.prototype.$axios = getService(options)
        V.prototype.$OK = 0
        V.prototype.$bus = bus
        V.prototype.$echarts = echarts

        // 聚焦输入框的指令
        V.directive("focus", {
            // 当被绑定的元素插入到 DOM 中时
            inserted: (el: HTMLElement) => {
                el.focus()
            },
            // 指令所在组件的 VNode 及其子 VNode 全部更新后调用
            // componentUpdated: (el: HTMLElement) => {
            //     console.log(el)
            //     el.focus()
            // },
        })

        // 格式化数字过滤器
        V.filter('formatNum', (num: number, payload: {}) => {
            let formatStr = ''
            if (num === 0) {
                formatStr = '0'
            } else if (num) {
                const result = num / 10000
                if (result >= 1) {
                    formatStr = Math.floor(result).toFixed(1) + '万'
                } else {
                    formatStr = num + ''
                }
            } else {
                formatStr = '--'
            }
            return formatStr
        })
        // 格式化时间过滤器
        V.filter('formatTime', (seconds: number, payload: {}) => {
            if (seconds && seconds > 0) {
                const minute = Math.floor(seconds / 60)
                const second = seconds % 60
                return `${minute}:${second < 10 ? '0' + second : second}`
            } else {
                return '0:00'
            }
        })

    },
}
