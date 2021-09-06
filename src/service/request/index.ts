//只有这个文件会对axios产生依赖
import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { JCRequestInterceptors, JCRequestConfig } from './type'

class JCRequest {
  //允许我们创建不同的实例对象
  instance: AxiosInstance
  //那么别人在使用时就需要根据实际情况传入interceptors
  intercepors?: JCRequestInterceptors

  constructor(config: JCRequestConfig) {
    ;(this.instance = axios.create(config)),
      (this.intercepors = config.interceptors)

    //从config中取出的拦截器是属于对应的实例的
    this.instance.interceptors.request.use(
      this.intercepors?.requestInterceptor,
      this.intercepors?.requestInterceptorCatch
    )
    this.instance.interceptors.response.use(
      this.intercepors?.responseInterceptor,
      this.intercepors?.responseInterceptorCatch
    )

    //添加所有实例都有的拦截器
    this.instance.interceptors.request.use(
      (config) => {
        console.log('所有的请求都有的拦截器：请求成功')
        return config
      },
      (err) => {
        console.log('所有的请求都有的拦截器：请求失败')
        return err
      }
    )

    this.instance.interceptors.response.use(
      (res) => {
        console.log('所有的请求都有的拦截器：响应成功')
        return res
      },
      (err) => {
        console.log('所有的请求都有的拦截器：响应失败')
        return err
      }
    )
  }

  //发起请求并且添加只针对这个单个请求的拦截器
  request(config: JCRequestConfig): void {
    //外界很可能针对此请求对config作出改变，因此我们需要拿到修改后的config
    if (config.interceptors?.requestInterceptor) {
      config = config.interceptors.requestInterceptor(config)
    }
    this.instance.request(config).then((res) => {
      if (config.interceptors?.responseInterceptor) {
        res = config.interceptors.responseInterceptor(res)
      }
      console.log(res)
    })
  }
}

export default JCRequest
