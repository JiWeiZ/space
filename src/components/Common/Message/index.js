import MessageVue from './Message.vue'
import { debounce } from '@/store/utils'

let Message = {}

Message.install = function (Vue, options) {
  const MessageConstrutor = Vue.extend(MessageVue)
  let MessageInstance
  const initMessageInstance = function () {
    MessageInstance = new MessageConstrutor()
    let messageEl = MessageInstance.$mount().$el
    document.body.appendChild(messageEl)
  }

  Vue.prototype.$message = debounce(function (options) {
    if (!MessageInstance) {
      initMessageInstance()
    }
    if (typeof options === 'string') {
      MessageInstance.content = options
      MessageInstance.type = 'success'
    } else if (typeof options === 'object') {
      Object.assign(MessageInstance, options)
    }
    MessageInstance.showMsg()
  }, 1000, true)
}

export default Message
