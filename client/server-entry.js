import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { Provider, useStaticRendering } from 'mobx-react'
import App from './views/App'
import { createStoreMap } from './store/store'

// 让 mobx 在服务端渲染的时候不会重复的数据变换
useStaticRendering(true)

// {appStore: xxx} 使用 ... 解构的方式
export default (stores, routerContext, url) => (
  <Provider {...stores}>
    <StaticRouter context={routerContext} location={url}>
      <App />
    </StaticRouter>
  </Provider>
)

export { createStoreMap }
