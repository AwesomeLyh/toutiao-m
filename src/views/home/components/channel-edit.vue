<template>
  <div class="channel-edit">
    <!-- 控制区域 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道编辑</div>
      <van-button
        size="mini"
        round
        type="danger"
        plain
        class="edit-btn"
        @click="isEdit = !isEdit"
      >
        {{ isEdit ? '完成' : '编辑' }}
      </van-button>
    </van-cell>
    <!-- 我的频道 -->
    <van-grid :gutter="10" class="my-grid">
      <van-grid-item
        v-for="(channel, index) in myChannels"
        :key="index"
        class="grid-item"
        @click="onClickMychannel(channel, index)"
      >
        <van-icon
          v-show="isEdit && !fixedChannels.includes(channel.id)"
          slot="icon"
          name="clear"
        ></van-icon>
        <span slot="text" class="text" :class="{ active: active === index }">
          {{ channel.name }}
        </span>
      </van-grid-item>
    </van-grid>
    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10" class="recommend-grid">
      <van-grid-item
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        @click="onAddChannel(channel)"
        icon="plus"
      />
    </van-grid>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { setItem, getItem } from '@/utils/storage'
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from '@/api/channel'

export default {
  // 组件名称
  name: 'ChannelEdit',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  // 组件状态值
  data() {
    return {
      //  固定的频道 不可移除
      fixedChannels: [0],
      // 所有频道
      allChannels: [],
      //  控制编辑状态
      isEdit: false
    }
  },
  // 计算属性
  computed: {
    recommendChannels() {
      // 数组的 filter 方法：遍历数组，把符合条件的元素存储到新数组中并返回
      return this.allChannels.filter(channel => {
        // const channels = []

        // 数组的 find 方法：遍历数组，把符合条件的第1个元素返回
        return !this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
        // return channels
      })
    },
    // 获取用户
    ...mapState(['user'])
  },
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created() {
    this.loadAllChannels()
  },
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。if
   */
  mounted() {},
  // 组件方法
  methods: {
    // 删除我的频道
    async deleteChannel(channel) {
      if (this.user) {
        try {
          await deleteUserChannel(
            channel.id // 频道 id
          )
        } catch (error) {
          this.$toast('删除失败')
        }
      } else {
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },

    // 点击我的频道
    onClickMychannel(channel, index) {
      if (this.isEdit) {
        // 如果是固定频道 不删除
        if (this.fixedChannels.includes(channel.id)) return
        console.log(channel.id)
        // 编辑状态，删除
        this.myChannels.splice(index, 1)
        // 如果删除的激活频道之前的频道，则更新激活的频道项
        // 参数1：要删除的元素的开始索引（包括）
        // 参数2：删除的个数，如果不指定，则从参数1开始一直删除到最后
        if (index <= this.active) {
          this.$emit('update-active', this.active - 1, true)
        }

        // 持久化数据
        this.deleteChannel(channel)
      } else {
        // 非编辑状态，切换频道
        this.$emit('update-active', index, false)
      }
    },
    //添加频道
    async onAddChannel(channel) {
      this.myChannels.push(channel)
      console.log(this.myChannels)

      if (this.user) {
        try {
          await addUserChannel({
            id: channel.id,
            seq: this.myChannels.length
          })
          setItem('TOUTIAO_CHANNELS', this.myChannels)  
          this.$toast('添加成功')
        } catch (error) {
          this.$toast('添加失败')
        }
      } else {
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    //获取所有频道数据
    async loadAllChannels() {
      try {
        const res = await getAllChannels()
        this.allChannels = res.data.channels
        console.log(this.allChannels)
      } catch (error) {
        this.$toast('获取频道数据列表失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;

  .title-text {
    font-size: 32px;
    color: #333333;
  }

  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
