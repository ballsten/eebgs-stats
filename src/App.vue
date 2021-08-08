<template>
  <div class="section">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  created() {
    // setup redirect rules to manage loading
    this.$router.beforeEach((to, from, next) => {
      if (to.path != '/') {
        if (this.$store.isReady()) {
          next()
        } else {
          return next({
            path: '/',
            query: {
              redirectTo: to.fullPath
            }
          })
        }
      } else {
        next()
      }
    })
  },
}
</script>

<style>
</style>
