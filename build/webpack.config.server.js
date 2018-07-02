const paths = require('./paths.js')

module.exports = {
  target: 'node', // js 打包出来的内容是使用在哪个执行环境中的
  entry: {
    app: paths.appNodeJs
  },
  output: {
    filename: 'server-entry.js', // 服务端没有浏览器缓冲，还需要import
    path: paths.appBuild,
    publicPath: '/public', // paths.publicPath, // 静态资源文件引用时的路径
    libraryTarget: 'commonjs2' // 模块加载配置方案 amd cmd umd commonjs2
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
  }
}