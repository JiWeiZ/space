import MessageBoxVue from './MessageBox.vue'

let MessageBox = {}

MessageBox.install = function (Vue, options) {
  const MessageBoxConstrutor = Vue.extend(MessageBoxVue)
  let MessageBoxInstance
  const initMessageBoxInstance = function () {
    MessageBoxInstance = new MessageBoxConstrutor()
    let MessageBoxEl = MessageBoxInstance.$mount().$el
    document.body.appendChild(MessageBoxEl)
  }

  Vue.prototype.$confirm = function (options) {
    if (!MessageBoxInstance) {
      initMessageBoxInstance()
    }
    if (typeof options === 'string') {
      MessageBoxInstance.content = options
    } else if (typeof options === 'object') {
      Object.assign(MessageBoxInstance, options)
    }
    return MessageBoxInstance.showMsgBox()
  }
}

export default MessageBox
