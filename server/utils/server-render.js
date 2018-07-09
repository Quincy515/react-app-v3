const serialize = require('serialize-javascript')
const ejs = require('ejs')
const bootstrapper = require('react-async-bootstrapper')
const ReactDomServer = require('react-dom/server')
const Helmet = require('react-helmet').default

const SheetsRegistry = require('react-jss').SheetsRegistry
const createGenerateClassName = require('@material-ui/core/styles').createGenerateClassName
const createMuiTheme = require('@material-ui/core/styles').createMuiTheme
const colors = require('@material-ui/core/colors')

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson()
    return result
  }, {})
} // 在服务端渲染结束之后数据默认值的传递，在下面拿到想要的值

module.exports = (bundle, template, req, res) => {
  return new Promise((resolve, reject) => { // 整个过程是异步执行
    const createStoreMap = bundle.createStoreMap
    const createApp = bundle.default
    const routerContext = {}
    const stores = createStoreMap()
    const sheetsRegistry = new SheetsRegistry() // 创建 Material-ui sheetsRegistry
    const generateClassName = createGenerateClassName() // 创建 Material-ui generateClassName
    const theme = createMuiTheme({ // 创建 Material-ui theme
      palette: {
        primary: colors.deepPurple,
        accent: colors.lightBlue,
        type: 'light'
      }
    }) // 需要的东西都创建完成了，传值给 app 渲染
    const app = createApp(stores, routerContext, sheetsRegistry, generateClassName, theme, req.url)

    bootstrapper(app).then(() => { // 异步操作，可以获取到 routerContext
      if (routerContext.url) { // 判断routerContext有redirect情况下会增加URL属性
        res.status(302).setHeader('Location', routerContext.url) // 重定向302头
        res.end() // 结束请求 setHeader上增加属性，让浏览器自动跳转到routerContext.url
        return // 不然会继续执行下面的代码
      }

      const helmet = Helmet.renderStatic() // 调用这个方法 SEO title、meta、content信息
      const state = getStoreState(stores) // 这个怎么让客户端代码拿到，可以把数据插入到html
      const content = ReactDomServer.renderToString(app)
      // 在renderToString之后拿到 routerContext

      const html = ejs.render(template, { // 传入-同步内容
        appString: content,
        initialState: serialize(state), // 把 Object 转化成对象,同步store数据
        meta: helmet.meta.toString(),
        title: helmet.title.toString(),
        style: helmet.style.toString(),
        link: helmet.link.toString(),
        // 需要把 Material-ui 样式放入 template 里买呢
        materialCss: sheetsRegistry.toString()
      })
      res.send(html)
      resolve() // 渲染成功之后就 resolve()
    }).catch(reject) // bootstrapper 错误就 reject()
  })
}
