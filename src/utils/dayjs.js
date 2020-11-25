import dayjs from 'dayjs'
import Vue from 'vue'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

// 加载中文语言包
dayjs.locale('zh-cn')

// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

// 全局过滤器：处理相对时间
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})
