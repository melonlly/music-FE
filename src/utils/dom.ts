const hasClass = (el: Element, name: string) => new RegExp('(^|\\s)' + name + '(\\s|$)').test(el.className)

const addClass = (el: Element, name: string) => {
    if (hasClass(el, name)) {
        return
    }
    const names = el.className.split(' ')
    names.push(name)
    el.className = names.join(' ')
}

const removeClass = (el: HTMLElement, name: string) => {
    if (hasClass(el, name)) {
        const names = el.className
        el.className = names.replace(name, '')
    } else {
        return
    }
}

const setData = (el: HTMLElement, name: string, val: string) => el.setAttribute('data-' + name, val)
const getData = (el: HTMLElement, name: string) => el.getAttribute('data-' + name)

const eleStyle: CSSStyleDeclaration = document.createElement('div').style
// 获取当前样式前缀
const prefix = (() => {
    const transformNames: any = {
        webkit: 'webkitTransform',
        Moz: 'MozTransform',
        O: 'OTransform',
        ms: 'msTransform',
        standard: 'transform'
    }
    for (const key of Object.keys(transformNames)) {
        if (eleStyle[transformNames[key]] !== undefined) {
            return key
        }
    }
    return false
})()
const autoprefixer = (style: string): string => {
    if (!prefix) return ''
    if (prefix === 'standard') return style
    return `${prefix + style.charAt(0).toUpperCase() + style.substr(1)}`
}

// 当前容器是否包含目标元素
const isContain = (container: HTMLElement, target: HTMLElement) => {
    if (container && target) {
        let flag = false
        while (target.parentNode) {
            if (target.parentNode === container) {
                flag = true
                break
            } else {
                flag = false
            }
            target = target.parentNode as HTMLElement
        }
        return flag
    } else {
        return false
    }
}

export {
    hasClass,
    addClass,
    removeClass,
    setData, getData,
    autoprefixer,
    isContain
}
