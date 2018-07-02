const paths = require('./paths.js')
const HTMLPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    app: paths.appIndexJs
  },
  output: {
    filename: '[name].[hash].js',
    path: paths.appBuild,
    publicPath: '',// paths.publicPath, // 静态资源文件引用时的路径
  },
  module: {
    rules: [
      {
        test: /.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: [
          paths.appNodeModules,
        ]
      }
    ]
  },
  plugins: [
    new HTMLPlugin()
  ]
}