import MessageAlertVue from './MessageAlert.vue'
import { debounce } from '@/store/utils'

let MessageAlert = {}

MessageAlert.install = function (Vue, options) {
  const MessageAlertConstrutor = Vue.extend(MessageAlertVue)
  let MessageAlertInstance
  const initMessageAlertInstance = function () {
    MessageAlertInstance = new MessageAlertConstrutor()
    let MessageAlertEl = MessageAlertInstance.$mount().$el
    document.body.appendChild(MessageAlertEl)
  }

  Vue.prototype.$alert = debounce(function (options) {
    if (!MessageAlertInstance) {
      initMessageAlertInstance()
    }
    if (typeof options === 'string') {
      MessageAlertInstance.content = options
      MessageAlertInstance.type = 'info'
    } else if (typeof options === 'object') {
      Object.assign(MessageAlertInstance, options)
    }
    MessageAlertInstance.showMsg()
  }, 1000, true)
}

export default MessageAlert
