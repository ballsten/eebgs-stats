<template>
  <div class="section">
    <loading v-model:active="isLoading" loader="bars"></loading>
    <div class="container"></div>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

import { Store } from './store'

export default {
  data() {
    return {
      isLoading: true,
    };
  },
  components: {
    Loading,
  },
  created() {
    this.store = new Store()
    this.store.on("dataload", () => {
      this.isLoading = false
    })
  }
};
</script>

<style>
</style>
