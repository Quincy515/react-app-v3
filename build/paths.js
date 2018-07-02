'use strict';

const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  appIndexJs: resolveApp('client/app.js'), // 打包的入口文件
  appBuild: resolveApp('dist'), // 输出文件存放的地方
  publicPath: resolveApp('public'), // 静态资源文件引用时的路径
  appNodeModules: resolveApp('node_modules'), // node_modules 包的路径
}