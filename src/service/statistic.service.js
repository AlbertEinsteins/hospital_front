import axios from './network/instance.js'

class StatisticService {
  patientStatistic (fromDate, toDate) {
    return axios.post('statistic/patient', {
      fromDate,
      toDate
    })
  }

  wardStatistic (tid) {
    return axios.post('statistic/ward', {
      tid
    })
  }
}

export default new StatisticService()
