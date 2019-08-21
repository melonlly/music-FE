const hasClass = (el: Element, name: string) => new RegExp('(^|\\s)' + name + '(\\s|$)').test(el.className)

const addClass = (el: Element, name: string) => {
    if (hasClass(el, name)) {
        return
    }
    const names = el.className.split(' ')
    names.push(name)
    el.className = names.join(' ')
}

export {
    hasClass, addClass,
}
