import axios from './network/instance.js'

class MedicineService {
  addMedicine (medicine) {
    return axios.post('/med/add', medicine)
  }

  getPage (queryVo, pagenum, pagesize) {
    return axios.post('/med/page', {
      data: queryVo,
      pagenum,
      pagesize
    })
  }
}

export default new MedicineService()
