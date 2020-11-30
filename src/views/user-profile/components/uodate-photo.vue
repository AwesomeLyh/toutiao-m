<template>
  <div class="update-photo">
    <img :src="img" ref="img" />
    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
    >
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

import { updateUserPhoto } from '@/api/user'

export default {
  // 组件名称
  name: 'UpdatePhoto',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  // 组件状态值
  data() {
    return {
      cropper: null
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
  mounted() {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1, // 只能在裁剪的图片范围内移动
      dragMode: 'move', // 画布可以移动
      aspectRatio: 1, // 裁剪区默认正方形
      autoCropArea: 1, // 自动调整裁剪图片
      cropBoxMovable: false, // 禁止裁剪区移动
      cropBoxResizable: false, // 禁止裁剪区缩放
      background: false // 关闭默认背景
    })
  },
  // 组件方法
  methods: {
    onConfirm() {
      this.cropper.getCroppedCanvas().toBlob(blob => {
        this.updateUserPhoto(blob)
      })
    },

    async updateUserPhoto(blob) {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        // 错误的用法
        // 如果接口要求 Content-Type 是 application/json
        // 则传递普通 JavaScript 对象
        // updateUserPhoto({
        //   photo: blob
        // })

        // 如果接口要求 Content-Type 是 multipart/form-data
        // 则你必须传递 FormData 对象
        const formData = new FormData()
        formData.append('photo', blob)

        const res = await updateUserPhoto(formData)
        console.log(res)

        // 关闭弹出层
        this.$emit('close')

        // 更新视图
        this.$emit('update-photo', res.data.photo)

        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        console.log(err)
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>
<style scoped lang="less">
.update-photo {
  background-color: #000;
  height: 100%;
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel,
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
.img {
  display: block;
  max-width: 100%;
}
</style>
