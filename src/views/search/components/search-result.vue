<template>
  <div class="search-result">
    <van-list
      @load="onLoad"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
    >
      <van-cell v-for="item in list" :key="item.art_id">
        <span slot="title">{{ item.title }}</span>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'

export default {
  // 组件名称
  name: 'SearchResult',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    searchText: {
      type: String,
      require: true
    }
  },
  // 组件状态值
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      per_page: 20,
      error: false
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
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
    async onLoad() {
      try {
        const { data } = await getSearchResult({
          page: this.page,
          per_page: this.per_page,
          q: this.searchText
        })
        this.list.push(...data.results)

        this.loading = false
        if (data.length) {
          this.page++
        } else {
          // 没有更多结果
          this.finished = true
        }
      } catch (error) {
        this.error = true
        // 加载失败了 loading 也要关闭

        this.loading = false
      }
    }
  }
}
</script>
<style scoped lang="less"></style>
