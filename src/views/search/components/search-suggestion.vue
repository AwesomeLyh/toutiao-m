<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(text, index) in suggestions"
      :key="index"
      @click="$emit('search', text)"
    >
      <span slot="title" v-html="hightLight(text)"></span>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
// 引入防抖
import { debounce } from 'lodash'

export default {
  // 组件名称
  name: 'SearchSuggestion',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  // 组件状态值
  data() {
    return {
      suggestions: []
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {
    searchText: {
      // debounce 函数
      // 参数1：函数
      // 参数2：防抖时间
      // 返回值：防抖之后的函数，和参数1功能是一样的
      handler: debounce(function(val) {
        this.loadSearchSuggestions(val)
      }, 300),
      immediate: true
    }
  },
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created() {},
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {},
  // 组件方法
  methods: {
    // 获取搜索建议
    async loadSearchSuggestions(q) {
      try {
        const res = await getSearchSuggestions(q)
        this.suggestions = res.data.options
      } catch (error) {
        this.$toast('获取失败')
      }
    },
    // 高亮文本
    hightLight(text) {
      const hightLightString = `<span class='active'>${this.searchText}</span>`
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, hightLightString)
    }
  }
}
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>
