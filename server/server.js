const express = require('express')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const session = require('express-session')
const ReactSSR = require('react-dom/server')
const fs = require('fs')
const paths = require('../build/paths.js')

const isDev = process.env.NODE_ENV === 'development'

const app = express()

app.use(bodyParser.json()) // 把app json请求格式的数据转化成 req.body 上面的数据
app.use(bodyParser.urlencoded({ extended: false })) // url 中 form data 转化成 req.body
app.use(session({ // 在服务启动阶段给 session 设值
  maxAge: 10 * 60 * 1000, // 10分钟测试用，真正上线应该存放在数据库中作为缓存或redis服务
  name: 'tid', // session 会放 cokie id 到浏览器端，给 cokie id 设置一个名字
  resave: false, // 每次请求是否重新生成 cokie id
  saveUninitialized: false,
  secret: 'react cnode api ssr mobx' // 用这个字符串加密 cokie 保证在浏览器端安全
}))

app.use(favicon(paths.faviconPath))

app.use('/api/user', require('./utils/handle-login.js'))
app.use('/api', require('./utils/proxy.js'))

if (!isDev) { // 不是开发环境下，才会存在 dist 目录
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
