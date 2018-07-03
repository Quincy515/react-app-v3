const express = require('express')
const ReactSSR = require('react-dom/server')
const fs = require('fs')
const paths = require('../build/paths.js')

const isDev = process.env.NODE_ENV === 'development'

const app = express()

if(!isDev) { // 不是开发环境下，才会存在 dist 目录
  const serverEntry = require('../dist/server-entry.js').default
  const template = fs.readFileSync(paths.serverHtml, 'utf8') // 读入根据template.html模版生成在dist目录下的index.html
  app.use('/public', express.static(paths.appBuild)) // 静态文件都在dist目录下，静态文件代理
  app.get('*', function (req, res) { // 服务端渲染完成的结果返回给浏览器端
    const appString = ReactSSR.renderToString(serverEntry)
    res.send(template.replace('<!-- app -->', appString))
  })
} else { // 是开发环境，需要单独处理，内容比较多，单独写个文件utils/dev-static.js
  const devStatic = require('./utils/dev-static.js')
  devStatic(app)
}

app.listen(3333, function () {
  console.log('server is listening on 3333')
})