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

export {
    formatNum,
}
