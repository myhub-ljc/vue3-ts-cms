import type { AxiosRequestConfig, AxiosResponse } from 'axios'

//因为AxiosRequestConfig类型中是没有关于拦截器所需要的类型，所以我们需要自己定义
export interface JCRequestInterceptors<T = AxiosResponse> {
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestInterceptorCatch?: (err: any) => any
  responseInterceptor?: (res: T) => T
  responseInterceptorCatch?: (err: any) => any
}

export interface JCRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  //通过接口的继承便可以使用所定义好的拦截器了
  interceptors?: JCRequestInterceptors<T>
  //是否需要使用loading组件
  showLoading?: boolean
}
