export function range (start, end, step = 1) {
  let result = []
  for (let i = start; i < end; i += step) {
    result.push(i)
  }
  return result
}

export function throttle (func, wait) {
  let previous = 0
  let timer = null
  return function () {
    if (timer) { clearTimeout(timer) }
    let now = Date.now()
    if (!previous) { previous = now }
    let [remaining, that, args] = [wait - (now - previous), this, arguments]
    timer = setTimeout(function () {
      previous = now
      const result = func.apply(that, args)
      timer = that = args = null
      return result
    }, remaining)
  }
}

export function debounce (func, wait, immediate) {
  let timer, previous, result

  let later = function () {
    // last是最近一次触发的时间间隔
    let last = Date.now() - previous
    // 如果时间间隔小于wait，说明还没到触发的点，这个时候触发事件，就需要重新计时
    if (last < wait && last >= 0) {
      timer = setTimeout(later, wait - last)
    } else {
      // 时间间隔大于等于wait，可以触发事件
      // 首先清空定时器
      timer = null
      // 判断是否立即执行，
      if (!immediate) {
        // 如果是立即执行，说明前面已经执行过func了
        // 如果不是立即执行，随即执行func
        result = func.apply(this, arguments)
      }
    }
  }

  // 防抖函数返回一个闭包
  return function () {
    previous = Date.now()
    // callNow是立即触发的标志
    // 立即触发要满足2个条件，第一是immediate 参数为 true，第二是timeout为空
    // 因为第一次触发后已经设置了 timeout，所以根据 timer 是否为空可以判断是否是首次触发
    let callNow = immediate && !timer

    // 如果是首次触发，设置timeout，延迟执行later
    if (!timer) {
      timer = setTimeout(later, wait)
    }

    // 如果是立即触发，就立即返回func函数调用的结果
    if (callNow) {
      result = func.apply(this, arguments)
    }

    return result
  }
}

export function floor (value, precision) {
  const multiplier = Math.pow(10, precision || 0)
  return Math.floor(value * multiplier) / multiplier
}

export function getCookiesObj () {
  return document.cookie.split('; ').map(e => {
    const entry = e.split('=')
    let res = {}
    res[entry[0]] = entry[1]
    return res
  }).reduce((acc, cur) => Object.assign(acc, cur), {})
}

export function parsingObjToStr (obj, objName = 'findParams') {
  return Object.entries(obj).map(e => `${objName}[${e[0]}]=${e[1]}`).join('**')
}

export function parsingStrToObj (str) {
  let ret
  if (str === 'undefined') {
    ret = {}
  } else {
    ret = str.split('**')
      .map(e => e.match(/(\w+)\[(\w+)\]=(\w+)/))
      .map(i => {
        return {[i[2]]: i[3]}
      })
      .reduce((p, c) => Object.assign(p, c), {})
  }
  return ret
}

export function timeStampToLocaleString (timeStamp) {
  let d = new Date(timeStamp)
  function addZero (n) {
    return n >= 0 && n < 10 ? `0${n}` : `${n}`
  }
  let arr1 = [d.getFullYear(), d.getMonth() + 1, d.getDate()]
  let arr2 = [d.getHours(), d.getMinutes(), d.getSeconds()].map(e => addZero(e))
  let arr = arr1.concat(arr2)
  return `${arr[0]}年${arr[1]}月${arr[2]}日 ${arr[3]}:${arr[4]}:${arr[5]}`
}

export function toText (Html) {
  var input = Html
  return input.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, '').replace(/<[^>]+?>/g, '').replace(/\s+/g, '').replace(/ /g, '').replace(/>/g, '')
}
