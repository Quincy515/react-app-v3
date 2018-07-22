import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { AppContainer } from 'react-hot-loader' // eslint-disable-line
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { lightBlue, deepPurple } from '@material-ui/core/colors'
import App from './views/App'
import AppState from './store/app-state' // 把 class 引入进来创建
import registerServiceWorker from './registerServiceWorker'

const theme = createMuiTheme({ // 主题颜色
  palette: {
    primary: deepPurple, // 主要颜色
    accent: lightBlue, // 次要颜色
    type: 'light',
  },
})

// ReactDOM.hydrate(<App />, document.getElementById('root'))

// 读取 initialState 没有就空对象
const initialState = window.__INITIAL__STATE__ || {}  // eslint-disable-line

const createApp = (TheApp) => {
  class Main extends React.Component {
    // Remove the server-side injected CSS.
    componentDidMount() {
      const jssStyles = document.getElementById('jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    render() {
      return <TheApp />
    }
  }
  return Main
}

const root = document.getElementById('root')
const render = (Component) => { // 使用appState={new AppState()}新建一个实例
  const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate
  renderMethod(
    <AppContainer>
      <Provider appState={new AppState(initialState.appState)}>
        <BrowserRouter>
          <MuiThemeProvider theme={theme}>
            <Component />
          </MuiThemeProvider>
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    root,
  )
}

render(createApp(App))

if (module.hot) {
  module.hot.accept('./views/App', () => {
    const NextApp = require('./views/App').default // eslint-disable-line
    // ReactDOM.hydrate(<NextApp />, document.getElementById('root'))
    render(createApp(NextApp))
  })
}

registerServiceWorker()
