import { throttle } from '@/store/utils'
const packingBox = new WeakMap()

function didReachedBottom (el) {
  const { scrollTop, clientHeight, scrollHeight } = el
  return scrollTop + clientHeight >= scrollHeight
}

function inserted (el, binding) {
  if (packingBox.has(el)) {
    throw new Error(`Tried to add multiple bottom directives for ${el}`)
  }
  const callback = binding.value
  const excuteIfBottomReached = () => {
    if (didReachedBottom(el)) { callback() }
  }
  const excuteIfBottomReachedThrottled = throttle(excuteIfBottomReached, 300)
  if (binding.modifierss.immediate) { excuteIfBottomReached() }
  el.addEventListener('scroll', excuteIfBottomReachedThrottled)
  window.addEventListener('resize', excuteIfBottomReachedThrottled)
  packingBox.set(el, excuteIfBottomReachedThrottled)
}

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
