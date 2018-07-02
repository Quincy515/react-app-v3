const paths = require('./paths.js')

module.exports = {
  entry: {
    app: paths.appIndexJs
  },
  output: {
    filename: '[name].[hash].js',
    path: paths.appBuild,
    publicPath: paths.publicPath, // 静态资源文件引用时的路径
  }
}