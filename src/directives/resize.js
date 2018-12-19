// import { throttle } from '@/store/utils'
import { debounce } from '@/store/utils'

const packingBox = new WeakMap()

// 给window绑定resize事件
function inserted (el, binding) {
  const callback = binding.value
  const callbackThrottled = debounce(callback, 100)
  if (packingBox.has(el)) {
    throw new Error(`Tried to add multiple resize directives to ${el}`)
  }
  packingBox.set(el, callbackThrottled)
  window.addEventListener('resize', callbackThrottled)
}

// 指令与元素解绑时移除window绑定的resize事件
function unbind (el) {
  if (packingBox.has(el)) {
    const callback = packingBox.get(el)
    packingBox.delete(el)
    window.removeEventListener('resize', callback)
  }
}

export default {
  inserted,
  unbind
}
