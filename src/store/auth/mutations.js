export function loginSuccess (state, user) {
  state.status.logIn = true
  state.user = user
}

export function loginFail (state) {
  state.status.logIn = false
  state.user = null
}

export function loginOut (state) {
  state.status.logIn = false
  state.user = null
}
