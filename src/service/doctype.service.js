import axios from './network/instance.js'

class DoctorTypeService {
  getDocTypes () {
    return axios.get('doctype/getAll')
  }
}

export default new DoctorTypeService()
