import axios from 'axios'
import { API_URL } from './constant.js'
import authHeader from './auth-header.js'

const instance = axios.create({
  baseURL: API_URL,
  timeout: 5000
})

instance.interceptors.request.use(config => {
  config.headers = authHeader()
  return config
}, err => Promise.reject(err))

export default instance
