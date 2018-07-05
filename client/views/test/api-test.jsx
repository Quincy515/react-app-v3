import React from 'react'
import axios from 'axios'

/* eslint-disable */
export default class TestApi extends React.Component {
  componentDidMount() {
    // do something here
  }

  getTopics() {
    // getTopics 用 axios 发送请求
    axios.get('/api/topics')
      .then(resp => {
        console.log(resp)
      }).catch(err => {
        console.log(err)
      })
  }

  login() {
    // login
    axios.post('/api/user/login', {
      accessToken: 'c2fa7ccf-4650-4ad0-92b6-e02332980ba8'
    }).then(resp => {
      console.log(resp)
    }).catch(err => {
      console.log(err)
    })
  }

  markAll() {
    // markAll
    axios.post('/api/message/mark_all?needAccessToken=true')
      .then(resp => {
        console.log(resp)
      }).catch(err => {
        console.log(err)
      })
  }

  render() {
    return (
      <div>
        <button onClick={this.getTopics}>topics</button>
        <button onClick={this.login}>login</button>
        <button onClick={this.markAll}>markAll</button>
      </div>
    )
  }
}
/* eslint-enable */ // 测试使用不需要 eslint 检测
