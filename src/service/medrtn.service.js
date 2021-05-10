import axios from './network/instance.js'

class MedicineRtnService {
  addRtnRecord (rtn) {
    return axios.post('/med_rtn/return', rtn)
  }
}

export default new MedicineRtnService()
