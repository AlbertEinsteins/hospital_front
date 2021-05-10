import AuthService from '../../service/auth.service.js'

export function login ({ commit }, { username, password }) {
  return AuthService.signin(username, password)
    .then(
      user => {
        commit('loginSuccess', user)
        return Promise.resolve(user)
      },
      err => {
        commit('loginFail')
        return Promise.reject(err)
      }
    )
}

export function logOut ({ commit }) {
  commit('loginOut')
}
