import { createRouter, createWebHistory } from 'vue-router'

import Loading from '../components/Loading.vue'
import Leaderboard from '../components/Leaderboard.vue'
import Player from '../components/Player.vue'

const routes = [
  { path: '/', component: Loading, props: true },
  { path: '/leaderboard', component: Leaderboard },
  { path: '/player/:id', name: "player", component: Player }
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routes
})