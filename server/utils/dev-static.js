const path = require('path')
const axios = require('axios')
const webpack = require('webpack')
const MemoryFs = require('memory-fs')
const proxy = require('http-proxy-middleware')

const serverRender = require('./server-render')

const serverConfig = require('../../build/webpack.config.server.js')

const getTemplate = () => { // 获取template
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/server.ejs')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
}

let serverBundle
// const Module = module.constructor // 通过构造方法创建一个新的 Module
const NativeModule = require('module') // 重新引用 Module
const vm = require('vm')

const getModuleFromString = (bundle, filename) => {
  const m = { exports: {} }
  const wrapper = NativeModule.wrap(bundle)
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true
  })
  const result = script.runInThisContext()
  result.call(m.exports, m.exports, require, m)
  return m
}

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
  // const m = new Module() // 编译的内容是字符串，怎么改变为模块，内容和指定文件名
  const m = getModuleFromString(bundle, 'server-entry.js')
  // m._compile(bundle, 'server-entry.js') // 用module解析string内容，生成一个新的模块,需要动态编译要指定文件名
  serverBundle = m.exports
})

module.exports = function (app) {
  // 开发环境下的服务端渲染
  app.use('/public', proxy({ // '/public'开头的都代理到 localhost:8888
    target: 'http://localhost:8888' // 静态文件和 api 通过不同前缀区分的好处
  }))

  app.get('*', function (req, res, next) {
    // 服务端渲染完成的结果返回给浏览器端
    if (!serverBundle) { // 优化 webpack config 正在执行，没有 bundle 不能执行服务端渲染
      return res.send('waiting for compile, refresh later')
    }
    getTemplate().then(template => {
      return serverRender(serverBundle, template, req, res)
    }).catch(next)
  })
}
