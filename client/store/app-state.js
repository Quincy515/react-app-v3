import {
  observable,
  computed,
  // autorun,
  action,
} from 'mobx'

export class AppState {
  @observable count = 0

  @observable name = 'wangbadan'

  @computed get msg() {
    return `${this.name} say count is  ${this.count}`
  }

  @action add() {
    this.count += 1
  }

  @action changeName(name) {
    this.name = name
  }
}

const appState = new AppState()

// autorun(() => {
//   console.log(appState.msg) // eslint-disable-line
// })

// setInterval(() => {
//   // appState.count += 1
//   appState.add()
// }, 2000)

export default appState
