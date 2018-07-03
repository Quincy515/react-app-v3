const express = require('express')
const ReactSSR = require('react-dom/server')
const fs = require('fs')
const paths = require('../build/paths.js')
const serverEntry = require('../dist/server-entry.js').default

const template = fs.readFileSync(paths.serverHtml, 'utf8') // 读入根据template.html模版生成在dist目录下的index.html
const app = express()

app.use('/public', express.static(paths.appBuild)) // 静态文件都在dist目录下
app.get('*', function (req, res) {
  const appString = ReactSSR.renderToString(serverEntry)
  res.send(template.replace('<!-- app -->', appString))
})

app.listen(3333, function () {
  console.log('server is listening on 3333')
})