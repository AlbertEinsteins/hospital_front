import axios from './network/instance.js'

class DocPotionService {
  getDocPositions () {
    return axios.get('docpos/getAll')
  }
}

export default new DocPotionService()
