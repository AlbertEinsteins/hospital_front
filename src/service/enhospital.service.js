import axios from './network/instance.js'

class EnHospitalService {
  patientEnroll (enhospital) {
    return axios.post('en/enroll', enhospital)
  }

  getPageResult (queryVo, pagenum, pagesize) {
    return axios.post('en/page', {
      data: queryVo,
      tid: queryVo.tid,
      pagenum,
      pagesize
    })
  }

  getPatinetsOfNurseActive (username) {
    return axios.get('nurse/getactivepatients', {
      params: {
        username
      }
    })
  }

  getPatientsOfNurseInActive (queryVo, pagenum, pagesize) {
    return axios.post('nurse/getInactivepatients', {
      ...queryVo,
      pagenum,
      pagesize
    })
  }
}

export default new EnHospitalService()
