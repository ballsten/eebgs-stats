import { createApp } from 'vue'

import { router } from './router'
import { Store } from './store'

import App from './App.vue'
import './assets/main.scss'

// instatiate the store
const store = new Store()


router.beforeEach((to, from, next) => {
  if (to.path != '/') {
    if (store.isReady()) {
      next()
    } else {
      console.log('redirecting')
      return next('/')
    }
  } else {
    next()
  }
})

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
