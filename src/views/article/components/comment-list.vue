<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    :immediate-check="false"
  >
    <comment-item
      v-for="(item, index) in list"
      :key="index"
      :comment="item"
      @reply-click="$emit('reply-click', $event)"
    ></comment-item>
  </van-list>
</template>

<script>
import { getComments } from '@/api/article'
import CommentItem from './commemt-item'

export default {
  // 组件名称
  name: '',
  // 局部注册的组件
  components: {
    CommentItem 
  },
  // 组件参数 接收来自父组件的数据
  props: {
    source: {
      type: [String, Number, Object],
      required: true
    },
    // 增加type参数，默认值为a，取值范围只能是a或者c
    type: {
      type: String,
      // 自定义 Prop 数据验证
      validator(value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  // 组件状态值
  data() {
    return {
      loading: false,
      finished: false,
      offset: null,
      limit: 10,
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
  created() {
    // 当你手动初始 onLoad 的话，它不会自动开始初始的 loading
    // 所以我们要手动的开启初始 loading
    this.loading = true
    this.onLoad()
  },
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {},
  // 组件方法
  methods: {
    //1323981489515266048
    async onLoad() {
      try {
        const res = await getComments({
          type: this.type, //  评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source.toString(), // 源id，文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })

        const { results } = res.data
        this.list.push(...results)

        // 3. 将 loading 设置为 false
        this.loading = false

        this.$emit('onload-success', res.data)

        // 获取下页评论
        if (results.length) {
          this.offset = res.data.last_id
        } else {
          this.finished = true
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less"></style>
