<template>
  <div class="update-gender">
    <van-picker
      title="性别"
      show-toolbar
      :columns="columns"
      :default-index="value"
      @change="onChange"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  // 组件名称
  name: 'UpdateGender',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  // 组件状态值
  data() {
    return {
      columns: ['男', '女'],
      localGender: this.value
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
    onChange(picker, value, index) {
      this.localGender = index
    },
    async onConfirm() {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0
      })

      try {
        const localGender = this.localGender
        await updateUserProfile({ gender: localGender })
        // 更新视图
        this.$emit('input', localGender)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
      } catch (error) {
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
