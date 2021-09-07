//只有这个文件会对axios产生依赖
import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { JCRequestInterceptors, JCRequestConfig } from './type'
import { ILoadingInstance } from 'element-plus'
import { ElLoading } from 'element-plus'

const DEFAULT_LOADING = true

class JCRequest {
  //允许我们创建不同的实例对象
  instance: AxiosInstance
  //那么别人在使用时就需要根据实际情况传入interceptors
  intercepors?: JCRequestInterceptors
  //添加loading组件
  loading?: ILoadingInstance
  showLoading: boolean

  constructor(config: JCRequestConfig) {
    ;(this.instance = axios.create(config)),
      (this.intercepors = config.interceptors),
      (this.showLoading = config.showLoading ?? DEFAULT_LOADING)

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
        if (this.showLoading) {
          this.loading = ElLoading.service({
            lock: true,
            text: '正在请求数据....',
            background: 'rgba(0, 0, 0, 0.5)'
          })
        }
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
        //在此处关闭loading组件
        this.loading?.close()
        console.log('所有的请求都有的拦截器：响应成功')
        return res
      },
      (err) => {
        //请求失败的时候也得移除
        this.loading?.close()
        console.log('所有的请求都有的拦截器：响应失败')
        return err
      }
    )
  }

  //发起请求并且添加只针对这个单个请求的拦截器
  request<T>(config: JCRequestConfig<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      //外界很可能针对此请求对config作出改变，因此我们需要拿到修改后的config
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config)
      }

      //设置是否需要显示loading组件
      if (config.showLoading === false) {
        this.showLoading = config.showLoading ?? DEFAULT_LOADING
      }

      this.instance
        .request<any, T>(config)
        .then((res) => {
          //1,单个请求对config的处理
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res)
          }

          //2，为了不影响下一个请求是否显示loading组件
          this.showLoading = DEFAULT_LOADING

          //3,将结果resolve出去
          resolve(res)
        })
        .catch((err) => {
          this.showLoading = DEFAULT_LOADING
          // return err
          reject(err)
        })
    })
  }

  get<T>(config: JCRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' })
  }

  post<T>(config: JCRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' })
  }

  delete<T>(config: JCRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' })
  }

  patch<T>(config: JCRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH' })
  }
}

export default JCRequest
