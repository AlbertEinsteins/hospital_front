import axios from './network/instance.js'

class SickBedService {
  getSickBedsByWardTypeId (wid) {
    return axios.get('sickbed/getByWid', {
      params: {
        wid
      }
    })
  }
}

export default new SickBedService()
