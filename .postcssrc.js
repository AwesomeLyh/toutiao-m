module.exports = {
  plugins: {
    //  VueCLI 内部已经配置了 autoprefixer 插件
    // autoprefixer: {
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    'postcss-pxtorem': {
      rootValue ({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      // 要转换的css属性
      propList: ['*']
    }
  }
}
