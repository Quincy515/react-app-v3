const paths = require('./paths.js')
const webpackMerge = require("webpack-merge")
const baseConfig = require('./webpack.config.base')

module.exports = webpackMerge(baseConfig, {
  mode: 'none',
  target: 'node', // js 打包出来的内容是使用在哪个执行环境中的
  entry: {
    app: paths.appNodeJs
  },
  externals: Object.keys(require('../package.json').dependencies), // 指定的一些包不把它打包到输出的 js 里面
  output: {
    filename: 'server-entry.js', // 服务端没有浏览器缓冲，还需要import
    libraryTarget: 'commonjs2' // 模块加载配置方案 amd cmd umd commonjs2
  }
})
