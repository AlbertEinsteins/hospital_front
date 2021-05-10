import axios from './network/instance.js'

class MenuService {
  getMenus (rid) {
    return axios.get('menu/getMenu', {
      params: {
        rid
      }
    })
  }
}

export default new MenuService()
