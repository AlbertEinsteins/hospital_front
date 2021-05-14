import axios from './network/instance.js'

class NurseService {
  signAdviceItem (id, nurseName) {
    const form = new FormData()
    form.append('itemId', id)
    form.append('nurseName', nurseName)
    return axios.put('nurse/execMedicalItem', form)
  }

  getNurses () {
    return axios.get('nurse/getAll')
  }
}

export default new NurseService()
