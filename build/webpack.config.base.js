const paths = require('./paths.js')

module.exports = {
  output: {
    path: paths.appBuild,
    publicPath: '/public/' // paths.publicPath, // 静态资源文件引用时的路径
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /.(js|jsx)$/,
        loader: 'eslint-loader',
        exclude: [
          paths.appNodeModules
        ]
      },
      {
        test: /.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: [
          paths.appNodeModules
        ]
      }
    ]
  }
}
