import axios from './network/instance.js'

class PayService {
  getPayItems (hid) {
    return axios.get('pay/pay_items', {
      params: { hid }
    })
  }

  getRtnItems (hid) {
    return axios.get('pay/pay_rtnitems', {
      params: { hid }
    })
  }

  getPreAmountByHid (hid) {
    return axios.get('pay/get_prepay', {
      params: { hid }
    })
  }

  getPageResult (queryVo, pagenum, pagesize) {
    return axios.post('pay/record_search', {
      data: queryVo,
      pagenum,
      pagesize
    })
  }

  getPayTypes () {
    return axios.get('pay/paytypes')
  }

  prePay (pay) {
    return axios.post('pay/pre_pay', pay)
  }

  paySuccess (hid, cost) {
    const formData = new FormData()
    formData.append('hid', hid)
    formData.append('cost', cost)
    return axios.put('pay/doSuccess', formData)
  }
}

export default new PayService()
