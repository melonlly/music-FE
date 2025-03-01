import CryptoJS from "crypto-js"
import config from "../config"
import VueRouter, { RawLocation } from 'vue-router'

// 加密
const encrypt = (msg: string) => CryptoJS.AES.encrypt(msg, config.key).toString()
// 解密
const decrypt = (ciphertext: string) => CryptoJS.AES.decrypt(ciphertext, config.key).toString(CryptoJS.enc.Utf8)

// 格式化数字（万）
const formatNum = (num: number) => {
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
}
// 格式化时间（分：秒）
const formatTime = (seconds: number) => {
    if (seconds && seconds > 0) {
        const minute = Math.floor(seconds / 60)
        const second = seconds % 60
        return `${minute}:${second < 10 ? '0' + second : second}`
    } else {
        return '0:00'
    }
}

// 随机重新排列数组
const shuffle = (list: []) => {
    return list
}

// 获取当前元素在数组中的位置
const getIndex = (list: [], ele: any) => {
    return list.findIndex((item: any) => {
        return item.id === ele.id
    })
}

// 数组中随机获取一个元素
const getRandomItem = (arr: Array<any>) => {
    if (arr && arr.length > 0) {
        const random = Math.floor(Math.random() * arr.length)
        return arr[random]
    } else {
        return {}
    }
}

const getSingerPic = (mid: string) => `https://y.gtimg.cn/music/photo_new/T001R300x300M000${mid}.jpg?max_age=2592000`
const getAlbumPic = (mid: string) => `https://y.gtimg.cn/music/photo_new/T002R300x300M000${mid}.jpg?max_age=2592000`
const getZhidaPic2 = (mid: string) => `https://y.gtimg.cn/music/photo_new/T001R68x68M000${mid}.jpg?max_age=2592000`
const getZhidaPic3 = (mid: string) => `https://y.gtimg.cn/music/photo_new/T002R68x68M000${mid}.jpg?max_age=2592000`

// 去除数组中某个值
const removeItem = (arr: Array<any>, key: string, value: string) => {
    if (arr && arr.length > 0 && key && value) {
        const index = arr.findIndex(item => {
            return item[key] === value
        })
        arr.splice(index, 1)
    }
}

// 路由跳转函数（处理了返回的Promise）
const goto = (router: VueRouter, location: RawLocation) => {
    const routerPromise = router.push(location)
    if (routerPromise) {
        routerPromise.then(res => {
            console.log(res)
        }).catch(err => {
            console.error(`路由异常：${ err }`)
        })
    }
}

export {
    encrypt,
    decrypt,
    formatNum,
    formatTime,
    shuffle,
    getIndex,
    getRandomItem,
    getSingerPic,
    getAlbumPic,
    getZhidaPic2,
    getZhidaPic3,
    removeItem,
    goto,
}
