import axios from './network/instance.js'

class DictService {
  getAllNations () {
    return axios.get('dict/nation_all')
  }

  getAllEventTypes () {
    return axios.get('dict/event_all')
  }
}

export default new DictService()
