import { createApp } from 'vue'
import App from './App.vue'

import 'element-plus/dist/index.css'
import 'normalize.css'
import './assets/css/index.less'
import jcRequest from './service'
import router from './router/index'
import store from './store/index'
import { globalRegister } from './global'

interface DataType {
  data: any
}

//测试发起请求是否成功
jcRequest
  .request<DataType>({
    url: '/home/multidata',
    method: 'GET',
    interceptors: {
      requestInterceptor: (config) => {
        console.log('单独请求的config')
        return config
      },
      responseInterceptor: (res) => {
        console.log('单独响应的res')
        return res
      }
    }
  })
  .then((res) => {
    console.log(res.data)
  })

const app = createApp(App)
app.use(router)
app.use(store)
app.use(globalRegister)

app.mount('#app')
