'use strict';

const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  appIndexJs: resolveApp('client/app.js'), // 打包的入口文件
  appBuild: resolveApp('dist'), // 输出文件存放的地方
  publicPath: resolveApp('public'), // 静态资源文件引用时的路径 本地文件全路径很难用
  appNodeModules: resolveApp('node_modules'), // node_modules 包的路径
  appNodeJs: resolveApp('client/server-entry.js'), // server 打包 server-entry 文件的路径
  appTemplateHtml: resolveApp('client/template.html'), // template.html路径
  serverHtml: resolveApp('dist/index.html'), // 插入 template.html 生成的dist目录下的index.html路径
}