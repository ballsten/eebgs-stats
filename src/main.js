import { createApp } from 'vue'
import App from './App.vue'

import { Store } from './store'

import './assets/main.scss'

const store = new Store()

createApp(App).mount('#app')
