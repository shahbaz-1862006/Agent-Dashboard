import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Quasar from 'quasar'
import 'quasar/dist/quasar.css'
import App from './App.vue'
import { createRouter } from './app/router'
import './styles.css'

const app = createApp(App)

app.use(createPinia())
app.use(Quasar)
app.use(createRouter())

app.mount('#root')
