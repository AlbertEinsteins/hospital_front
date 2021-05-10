import axios from './network/instance.js'

class AuthService {
  signup (user) {
    return axios.post('auth/signup', user)
  }

  signin (username, password) {
    return axios.post('auth/signin', {
      username,
      password
    }).then(resp => {
      if (resp.data.token) {
        localStorage.setItem('user', JSON.stringify(resp.data))
      }
      return resp.data
    })
  }
}

export default new AuthService()
