<template>
  <div class="section">
    <loading v-model:active="isLoading" loader="bars"></loading>
    <div class="container">
      <leaderboard v-model:leaderboard="leaderboard"></leaderboard>
    </div>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

import Leaderboard from './components/Leaderboard.vue'

import { Store } from './store'

export default {
  data() {
    return {
      isLoading: true,
      leaderboard: []
    };
  },
  components: {
    Loading,
    Leaderboard
  },
  created() {
    this.store = new Store()
    this.store.on("dataload", async () => {
      this.isLoading = false
      this.leaderboard = await this.store.getLeaderboard()
    })
  }
};
</script>

<style>
</style>
