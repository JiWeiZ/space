import { throttle } from '@/store/utils'

// 用来做钩子函数之间的数据共享
const packingBox = new WeakMap()

function inserted (el, binding) {
  if (packingBox.has(el)) {
    throw new Error(`Tried to add multiple scroll directives to ${el}`)
  }
  const callback = binding.value
  const callbackThrottled = throttle(callback, 300)
  packingBox.set(el, callbackThrottled)
  if (binding.modifiers.immediate) {
    callback()
  }
  el.addEventListener('scroll', callbackThrottled)
}

// 指令与元素解绑时移除el绑定的resize事件
function unbind (el) {
  if (packingBox.has(el)) {
    const callback = packingBox.get(el)
    packingBox.delete(el)
    el.removeEventListener('scroll', callback)
  }
}

export default {
  inserted,
  unbind
}
