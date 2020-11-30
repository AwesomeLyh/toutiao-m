<template>
  <div class="comment-reply">
    <!-- 导航栏 -->
    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <van-icon slot="left" name="cross" @click="$emit('close')" />
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 当前评论项 -->
    <comment-item :comment="comment" />
    <!-- /当前评论项 -->

    <van-cell title="所有回复" />

    <!-- 评论的回复列表 -->
    <comment-list :source="comment.com_id" :list="commentList" type="c" />
    <!-- /评论的回复列表 -->

    <!-- 发布回复 -->
    <div class="post-wrap">
      <van-button
        class="post-btn"
        type="default"
        round
        @click="isReplyShow = true"
      >
        写评论
      </van-button>
    </div>
    <!-- /发布回复 -->

    <!-- 发布回复弹出层 -->
    <van-popup v-model="isReplyShow" position="bottom">
      <comment-post :target="comment.com_id" @post-success="onPostSuccess" />
    </van-popup>
  </div>
</template>

<script>
import CommentList from './comment-list'
import CommentItem from './commemt-item'
import CommentPost from './comment-post'

export default {
  name: 'CommentReply',
  components: { CommentList, CommentItem, CommentPost },
  props: {
    comment: {
      type: [String, Number, Object],
      required: true
    }
  },
  inject: {
    articleId: {
      type: [String, Number, Object],
      default: null
    }
  },
  data() {
    return {
      isReplyShow: false,
      commentList: []
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onPostSuccess(data) {
      this.comment.reply_count++
      this.isReplyShow = false
      this.commentList.unshift(data.new_obj)
      console.log(this.commentList)
    }
  }
}
</script>

<style scoped lang="less">
.post-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .post-btn {
    width: 60%;
  }
}
</style>
