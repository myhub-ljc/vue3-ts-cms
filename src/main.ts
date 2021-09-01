import { createApp } from 'vue'
import App from './App.vue'

import 'element-plus/dist/index.css'

import router from './router/index'
import store from './store/index'
import { globalRegister } from './global'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(globalRegister)

app.mount('#app')
