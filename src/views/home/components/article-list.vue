<template>
  <div class="article-list">
    <van-pull-refresh
      :success-text="refreshSuccessText"
      :success-duration="1500"
      v-model="isRefreshLoading"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <article-list-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        >
        </article-list-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleListItem from '@/components/article-item'
export default {
  // 组件名称
  name: 'ArticleList',
  // 局部注册的组件
  components: {
    ArticleListItem
  },
  // 组件参数 接收来自父组件的数据
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  // 组件状态值
  data() {
    return {
      //控制弹窗页面
      isChennelEditShow: false,
      // 是否加载失败
      error: false,
      // 控制下拉刷新的失败状态
      isRefreshLoading: false,
      //成功刷新提示
      refreshSuccessText: '',
      //文章列表
      list: [],
      // 控制上拉加载
      loading: false,
      // 控制加载是否结束
      finished: false,
      // 请求下一页数据的时间戳
      timestamp: null
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
        const res = await getArticles({
          channel_id: this.channel.id,
          timestamp: this.timestamp || Date.now(),
          // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
          with_top: 1
        })
        this.list.push(...res.data.results)
        console.log(this.list)

        // 设置本次加载中 loading 状态结束
        this.loading = false
        if (res.data.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = res.data.pre_timestamp
        } else {
          // 没有数据了，设置加载状态结束，不再触发上拉加载更多了
          this.finished = true
        }
      } catch (error) {
        this.loading = false // 关闭 loading 效果
        this.error = true // 开启错误提示
      }
    },

    async onRefresh() {
      try {
        const res = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now(),
          // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
          with_top: 1
        })
        this.list.unshift(...res.data.results)
        this.isRefreshLoading = false
        this.refreshSuccessText = `刷新成功，更新了${res.data.results.length}条数据`
      } catch (error) {
        console.log(error)
        this.isRefreshLoading = false
        this.$toast('刷新失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  // 百分比单位是相对于父元素的
  // height: 100%;

  // 视口（在移动端是布局视口）单位：vw 和 vh，不受父元素影响
  // 1vw = 视口宽度的百分之一
  // 1vh = 视口高度的百分之一
  height: 79vh;
  overflow-y: auto;
}
</style>
