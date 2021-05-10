import axios from './network/instance.js'

class WardService {
  addNewWard (ward) {
    return axios.post('ward/add', ward)
  }

  getAllWards () {
    return axios.get('ward/getAll')
  }
}

export default new WardService()
