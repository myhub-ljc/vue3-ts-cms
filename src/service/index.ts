//网络请求的统一出口
import JCRequest from './request'
import { BASE_URL, TIMT_OUT } from './request/config'

const jcRequest = new JCRequest({
  baseURL: BASE_URL,
  timeout: TIMT_OUT,
  interceptors: {
    requestInterceptor: (config) => {
      //携带token的拦截
      const token = ''
      if (token) {
        config.headers.Authorization = `Bearer${token}`
      }
      console.log('请求成功的拦截')
      return config
    },
    requestInterceptorCatch: (err) => {
      console.log('请求失败的拦截')
      return err
    },
    responseInterceptor: (res) => {
      console.log('响应成功的拦截')
      return res
    },
    responseInterceptorCatch: (err) => {
      console.log('响应失败的拦截')
      return err
    }
  }
})

export default jcRequest
