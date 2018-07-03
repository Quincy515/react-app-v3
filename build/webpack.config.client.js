const paths = require('./paths.js')
const webpack = require('webpack')
const HTMLPlugin = require('html-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development' // 启动webpack时命令手动输入，告诉是开发环境或正式生成环境

const config = {
  entry: {
    app: paths.appIndexJs
  },
  output: {
    filename: '[name].[hash].js',
    path: paths.appBuild,
    publicPath: '/public/',// paths.publicPath, // 静态资源文件引用时的路径
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
    new HTMLPlugin({
      template: paths.appTemplateHtml
    })
  ]
}

if (isDev) { // 如果是开发环境，就增加一些开发配置
  // https://webpack.docschina.org/configuration/dev-server/
  config.mode = 'development'
  config.entry = {
    app: [
      'react-hot-loader/patch',
      paths.appIndexJs
    ]
  }
  config.devServer = {
    host: '0.0.0.0',             // 任何方式访问ip、本地
    port: '8888',                // 指定端口
    contentBase: paths.appBuild, // 静态文件编译的地址
    hot: true,                   // 配置 hot module replacement 开启
    overlay: {
      errors: true               // webpack 编译过程中出现任何错误，在网页中显示
    },
    publicPath: '/public/',       // 需要和上面的webpack output设置相同
    historyApiFallback: {        // 代理的目录是dist 下文件，消除 /public 的影响
      index: '/public/index.html'
    }
  }
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = config