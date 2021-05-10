import axios from './network/instance.js'

class WardTypeService {
  getWardTypes () {
    return axios.get('wardtype/getAll')
  }

  getPageResult (pagenum, pagesize) {
    return axios.get(`wardtype/page?pagenum=${pagenum}&pagesize=${pagesize}`)
  }

  revisePrice (formDt) {
    return axios.put('wardtype/changePrice', formDt)
  }
}

export default new WardTypeService()
