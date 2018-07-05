const path = require('path')
const axios = require('axios')
const webpack = require('webpack')
const MemoryFs = require('memory-fs')
const proxy = require('http-proxy-middleware')
const ReactDomServer = require('react-dom/server')

const serverConfig = require('../../build/webpack.config.server.js')

const getTemplate = () => { // 获取template
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/index.html')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
}

let serverBundle, createStoreMap
const Module = module.constructor // 通过构造方法创建一个新的 Module
const mfs = new MemoryFs() // 内存读写
const serverCompiler = webpack(serverConfig) // serverCompiler是webpack 提供的模块调用方式
serverCompiler.outputFileSystem = mfs // 使用mfs加快打包速度
serverCompiler.watch({}, (err, stats) => { // 每次 server bundle有更新都会watch，监听打包内容
  if (err) throw err
  stats = stats.toJson()
  stats.errors.forEach(err => console.err(err))
  stats.warnings.forEach(warn => console.warn(warn))

  // 读取 server bundler 信息
  const bundlePath = path.join( // bundle 路径
    serverConfig.output.path,
    serverConfig.output.filename
  )
  const bundle = mfs.readFileSync(bundlePath, 'utf-8') // 通过bundle路径读取内容
  const m = new Module() // 编译的内容是字符串，怎么改变为模块，内容和指定文件名
  m._compile(bundle, 'server-entry.js') // 用module解析string内容，生成一个新的模块,需要动态编译要指定文件名
  serverBundle = m.exports.default // 通过exports挂载从模块导出来获取 server bundle
  createStoreMap = m.exports.createStoreMap
})

module.exports = function (app) {
  // 开发环境下的服务端渲染
  app.use('/public', proxy({ // '/public'开头的都代理到 localhost:8888
    target: 'http://localhost:8888' // 静态文件和 api 通过不同前缀区分的好处
  }))

  app.get('*', function (req, res) {
    // 服务端渲染完成的结果返回给浏览器端
    getTemplate().then(template => {
      const routerContext = {}
      const app = serverBundle(createStoreMap(), routerContext, req.url)

      const content = ReactDomServer.renderToString(app)
      // 在renderToString之后拿到 routerContext
      if (routerContext.url) { // 判断routerContext有redirect情况下会增加URL属性
        res.status(302).setHeader('Location', routerContext.url) // 重定向302头
        res.end() // 结束请求 setHeader上增加属性，让浏览器自动跳转到routerContext.url
        return // 不然会继续执行下面的代码
      }
      res.send(template.replace('<!-- app -->', content))
    })
  })
}
