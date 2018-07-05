const axios = require('axios')
const querystring = require('query-string')
const baseUrl = 'http://cnodejs.org/api/v1'

module.exports = function (req, res, next) {
  const path = req.path // 代理接口首先拿到接口地址path
  const user = req.session.user || {} // 判断用户是否登录，如果没有就是一个空对象
  const needAccessToken = req.query.needAccessToken // 判断是否需要 accessToken 放到 url 问号后面

  if (needAccessToken && !user.accessToken) { // 需要 accessToken 并且 user 里没有 accessToken
    res.status(401).send({ // 告诉客户端 401 没有登录
      success: false,
      msg: 'need login'
    })
  }

  // 通过了 if 则可以开始代理请求
  const query = Object.assign({}, req.query, { // get 请求并且需要 accessToken 就组合 query
    accesstoken: (needAccessToken && req.method === 'GET') ? user.accessToken : ''
  }) // 重新定义 query
  if (query.needAccessToken) delete query.needAccessToken // 删除我们自己添加的属性

  axios(`${baseUrl}${path}`, { // 请求地址是 baseUrl + path
    method: req.method, // 与客户端发送的请求方式相同
    params: query, // 请求参数
    data: querystring.stringify(Object.assign({}, req.body, { // req的body加上accessToken就算不需要加上也没有关系
      accesstoken: (needAccessToken && req.method === 'POST') ? user.accessToken : '' // 传给 cnode api 的都是小写没有大写
    })), // 这样请求就发送到 cnode api 确保不同请求方法上都会有 accessToken
    headers: { // 有的api可以接受 application/json有的不能接受
      'Content-Type': 'application/x-www-form-urlencoded' // 使用 form data 发送请求都可以接受
    }
  }).then(resp => {
    if (resp.status === 200) {
      res.send(resp.data) // 发送到客户端
    } else {
      res.status(resp.status).send(resp.data) // 原封不动的返回给客户端
    }
  }).catch(err => {
    if (err.response) {
      res.status(500).send(err.response.data)
    } else { // 设置默认错误
      res.status(500).send({
        success: false,
        msg: '未知错误'
      })
    }
  })
}
