<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录" />
    <!-- /导航栏 -->

    <!-- 登录表单 -->
    <van-form @submit="onSubmit" ref="LoginFormRef">
      <van-field
        v-model="user.mobile"
        required
        clearable
        :rules="userFormRules.mobile"
        name="mobile"
        label="手机号"
        placeholder="请输入手机号"
      >
        <i slot="left-icon" class="iconfont shouji"></i>
        <!-- 通过插槽处理自定义图标 -->
      </van-field>
      <van-field
        v-model="user.code"
        required
        :rules="userFormRules.code"
        name="code"
        label="验证码"
        placeholder="请输入验证码"
      >
        <i slot="left-icon" class="iconfont yanzhengma"></i>
        <!-- 通过插槽处理自定义图标 -->
        <!-- 新版本插槽的写法 -->
        <template #button>
          <!--time属性表示倒计时总时长，单位为毫秒 ： 1000*5 表示5s
            通过format属性设置倒计时文本的格式 ： ss s ，ss表示时间格式只有秒，s表示字符格式
            finish是完成事件：倒计时结束时会触发
	        -->
          <van-count-down
            v-if="isCountDownShow"
            :time="1000 * 5"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            class="send-sms-btn"
            round
            size="small"
            type="default"
            @click="onSendSms"
            native-type="button"
          >
            发送验证码
          </van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
    <!-- /登录表单 -->
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'

export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: '15503916553',
        code: '246810'
      },
      userFormRules: {
        mobile: [
          {
            required: true,
            message: '手机号不能为空'
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: '手机号格式错误'
          }
        ],
        code: [
          {
            required: true,
            message: '验证码不能为空'
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      },
      isCountDownShow: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 获取验证码
    async onSendSms() {
      try {
        await this.$refs.LoginFormRef.validate('mobile')
      } catch (err) {
        return console.log('验证失败', err)
      }
      // 2. 验证通过，显示倒计时
      this.isCountDownShow = true
      try {
        const res = await sendSms(this.user.mobile)
      } catch (error) {
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast.fail('发送太频繁了，请稍后重试')
        } else {
          this.$toast.fail('发送失败，请稍后重试')
        }
      }
    },
    // 登录
    async onSubmit() {
      // 1. 获取表单数据
      const user = this.user
      // 加载动画
      this.$toast.loading({
        duration: 0, // 持续时间，默认时间2s，0表示持续展示不停止，直到成功或失败
        forbidClick: true, // 是否禁止背景点击（forbid：禁止）
        message: '登录中...' // 提示消息
      })
      try {
        const res = await login(user)
        this.$store.commit('setUser', res.data)
        this.$toast.success('登录成功')
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败，请稍后重试')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .iconfont {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
    padding: 0;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
