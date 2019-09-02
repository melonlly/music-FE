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
const getRandomItem = (arr: []) => {
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

export {
    formatNum,
    formatTime,
    shuffle,
    getIndex,
    getRandomItem,
    getSingerPic,
    getAlbumPic,
    getZhidaPic2,
    getZhidaPic3,
}
