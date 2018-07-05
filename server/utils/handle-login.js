const router = require('express').Router()
const axios = require('axios')

const baseUrl = 'http://cnodejs.org/api/v1'

router.post('/login', function (req, res, next) {
  axios.post(`${baseUrl}/accesstoken`, { // 发送post请求传递数据
    accesstoken: req.body.accessToken // accessToken 传给 cnode 服务，cnode提供的accesstoken T不是大写
  })
    .then(response => {
      if (response.status === 200 && response.data.success) { // 如果链接成功
        req.session.user = { // 接口返回的数据保存到 session 中
          accessToken: req.body.accessToken, // 登录的信息都保存到 req.session里
          loginName: response.data.loginname, // 下次请求就可以读取到这些信息
          id: response.data.id,
          avatarUrl: response.data.avatar_url
        }
        res.json({ // 接口争取给浏览器端发送数据
          success: true,
          data: response.data // 返回给用户
        })
      }
    })
    .catch(err => {
      if (err.response) { // 请求到cnode接口是有返回的，是业务逻辑的错误，而不是服务器直接报错
        res.json({ // 把错误信息返回给客户端
          success: false,
          data: err.response.data
        })
      } else {
        next(err) // 把错误抛给全局错误处理器去处理
      }
    })
})

module.exports = router
