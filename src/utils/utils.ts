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

export {
    formatNum,
    shuffle,
    getIndex,
    getRandomItem,
}
