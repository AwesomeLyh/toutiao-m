import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
// 加载 Vant 核心组件库
import Vant from 'vant'
// 导入 NProgress 包对应的JS和CSS
import NProgress from 'nprogress'

import 'nprogress/nprogress.css'
// 全局样式
import './styles/index.less'
// 加载 Vant 全局样式
import 'vant/lib/index.css'

Vue.use(Vant)

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/app/'

axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

axios.interceptors.response.use(config => {
  NProgress.done()
  return config.data
})

Vue.prototype.$http = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
