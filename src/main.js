// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex'
import 'babel-polyfill'
import Message from './components/Common/Message/index'
import MessageBox from './components/Common/MessageBox/index'
import MessageAlert from './components/Common/MessageAlert/index'

Vue.use(Message)
Vue.use(MessageBox)
Vue.use(MessageAlert)
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
