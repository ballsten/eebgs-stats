import { createApp } from 'vue'

import { router } from './router'
import { Store } from './store'

import App from './App.vue'
import './assets/main.scss'

// instatiate the store
const store = new Store()

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
