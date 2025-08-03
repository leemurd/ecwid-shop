// import './assets/main.css'
//
// import { createApp } from 'vue'
// import { createPinia } from 'pinia'
//
// import App from './App.vue'
// import router from './router'
//
// const app = createApp(App)
//
// app.use(createPinia())
// app.use(router)
//
// app.mount('#app')

import { createApp } from 'vue'
import App from '@/App.vue'
import pinia from '@/stores/index.ts'
import router from '@/router/index.ts'
import 'bootstrap/dist/css/bootstrap.min.css'
// import './assets/main.css'

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
