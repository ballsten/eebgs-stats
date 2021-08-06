import { createApp } from 'vue'
import VueLoading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import { router } from './router'
import { Store } from './store'

import App from './App.vue'
import './assets/main.scss'

// instatiate the store
const store = new Store()

const app = createApp(App)
app.use(router)
app.use(store)
app.use(VueLoading)
app.mount('#app')
