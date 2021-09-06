import { createApp } from 'vue'
import App from './App.vue'

import 'element-plus/dist/index.css'

import jcRequest from './service'
import router from './router/index'
import store from './store/index'
import { globalRegister } from './global'

//测试发起请求是否成功
jcRequest.request({
  url: '/home/multidata',
  method: 'GET'
})

const app = createApp(App)
app.use(router)
app.use(store)
app.use(globalRegister)

app.mount('#app')
