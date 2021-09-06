//只有这个文件会对axios产生依赖
import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'

//因为AxiosRequestConfig类型中是没有关于拦截器所需要的类型，所以我们需要自己定义
interface JCRequestInterceptors {
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestInterceptorCatch?: (err: any) => any
  responseInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
  responseInterceptorCatch?: (err: any) => any
}

interface JCRequestConfig extends AxiosRequestConfig {
  //通过接口的继承便可以使用所定义好的拦截器了
  interceptors?: JCRequestInterceptors
}

class JCRequest {
  //允许我们创建不同的实例对象
  instance: AxiosInstance
  //那么别人在使用时就需要根据实际情况传入interceptors
  intercepors?: JCRequestInterceptors

  constructor(config: JCRequestConfig) {
    ;(this.instance = axios.create(config)),
      (this.intercepors = config.interceptors)

    //那么此时便可以使用拦截器了
    this.instance.interceptors.request.use(
      this.intercepors?.requestInterceptor,
      this.intercepors?.requestInterceptorCatch
    )
    this.instance.interceptors.response.use(
      this.intercepors?.responseInterceptor,
      this.intercepors?.responseInterceptorCatch
    )
  }

  //发起请求
  request(config: AxiosRequestConfig): void {
    this.instance.request(config).then((res) => {
      console.log(res)
    })
  }
}

export default JCRequest
