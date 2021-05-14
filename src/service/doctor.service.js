import axios from './network/instance.js'

import { date } from 'quasar'

class DoctorService {
  getDoctors () {
    return axios.get('doc/getAll')
  }

  addDoctor (doctor) {
    doctor.hireDate = doctor.hireDateStr && date.formatDate(doctor.hireDateStr, 'YYYY-MM-DD')
    return axios.post('doc/save', doctor)
  }

  pageResult (doctor, pagenum, pagesize) {
    doctor.hireDate = doctor.hireDateStr && new Date(doctor.hireDateStr)
    return axios.post('doc/page', {
      data: doctor,
      pagenum,
      pagesize
    })
  }

  /**
  修改医生的信息
   */
  reviseInfo (doctor) {
    return axios.put('doc/updatebyid', doctor)
  }

  /**
  分页获取医生的负责的所有病人
   */
  getInfo (username, isActive, pagenum, pagesize) {
    return axios.get('doc/getpatients', {
      params: {
        username,
        isActive,
        pagenum,
        pagesize
      }
    })
  }

  getInActivePatients (hid, username, startTime, endTime, pagenum, pagesize) {
    return axios.post('doc/getInactivepatients', {
      hid,
      username,
      startTime,
      endTime,
      pagenum,
      pagesize
    })
  }

  getMedicalAdvice (hid) {
    return axios.get('doc/getAdviceItemsByHid', {
      params: {
        hid
      }
    })
  }

  addAdviceItem (hid, username, item) {
    return axios.post('doc/addAdviceItem', {
      hid,
      username,
      data: item
    })
  }
}

export default new DoctorService()
