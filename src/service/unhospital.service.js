import axios from './network/instance.js'

class UnHospitalService {
  enrollUnHospital (hid, isPay) {
    const form = new FormData()
    form.append('hid', hid)
    return axios.post('out/enroll', form)
  }

  page (queryVo, pagenum, pagesize) {
    return axios.post('out/page', {
      tid: queryVo.tid,
      data: queryVo,
      pagenum,
      pagesize
    })
  }
}

export default new UnHospitalService()
