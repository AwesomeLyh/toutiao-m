import axios from 'axios'
import store from '@/store'
import router from '@/router'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})

/**
 * 配置处理后端返回数据中超出 js 安全整数范围问题
 */
// request.defaults.transformResponse = [
//   function(data) {
//     try {
//       return jsonBig.parse(data)
//     } catch (err) {
//       return {}
//     }
//   }
// ]

// 请求拦截器
request.interceptors.request.use(config => {
  const user = store.state.user
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
})

// 相应拦截
request.interceptors.response.use(
  // 响应成功进入第1个函数
  // 该函数的参数是响应对象s
  config => {
    return config.data
  }
)

export default request
