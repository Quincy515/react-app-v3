import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { AppContainer } from 'react-hot-loader' // eslint-disable-line
import App from './views/App'
import AppState from './store/app-state' // 把 class 引入进来创建

// ReactDOM.hydrate(<App />, document.getElementById('root'))

const root = document.getElementById('root')
const render = (Component) => { // 使用appState={new AppState()}新建一个实例
  const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate
  renderMethod(
    <AppContainer>
      <Provider appState={new AppState()}>
        <BrowserRouter>
          <Component />
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    root,
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./views/App', () => {
    const NextApp = require('./views/App').default // eslint-disable-line
    // ReactDOM.hydrate(<NextApp />, document.getElementById('root'))
    render(NextApp)
  })
}
