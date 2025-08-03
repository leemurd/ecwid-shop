import { createApp } from 'vue'
import App from '@/App.vue'
import pinia from '@/stores/index.ts'
import { router } from '@/router/index.ts'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import '@/assets/main.css'

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
