import axios from './network/instance.js'

class UserService {
  getRoles () {
    return axios.get('user/roles')
  }

  getPageResult (queryVo, pagenum, pagesize) {
    return axios.post('user/get_pageuser', {
      data: queryVo,
      pagenum,
      pagesize
    })
  }

  delById (uid) {
    return axios.delete('user/delbyid', {
      data: {
        uid
      }
    })
  }

  resetPwd (uid) {
    return axios.put('user/retpwd', {
      uid
    })
  }

  changePwd (user) {
    console.log(user)
    return axios.put('user/revisePwd', user)
  }
}

export default new UserService()
