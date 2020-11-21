import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage'

Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    //  用户的登录状态信息
    user: getItem(TOKEN_KEY)
  },
  mutations: {
    setUser: function (state, user) {
      state.user = user
      setItem(TOKEN_KEY, user)
    }
  },
  actions: {},
  modules: {}
})
