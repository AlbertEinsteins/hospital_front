import axios from './network/instance.js'

import { date } from 'quasar'

class LogService {
  pageResult (query, pagenum, pagesize) {
    query.fromStr = query.from && date.formatDate(query.from, 'YYYY-MM-DD')
    return axios.get('log/query', {
      params: {
        level: query.level,
        from: query.fromStr,
        pagenum,
        pagesize
      }
    })
  }
}

export default new LogService()
