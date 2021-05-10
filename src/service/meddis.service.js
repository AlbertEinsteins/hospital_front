import axios from './network/instance.js'

class MedicineDisService {
  addDistributeRecord (distribute) {
    return axios.post('med_dis/dis', distribute)
  }

  getAllHidsWithName () {
    return axios.get('med_dis/gethids')
  }
}

export default new MedicineDisService()
