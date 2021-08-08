<template>
  <h1>we are loading</h1>
  <span class="icon is-medium">
    <i class="fas fa-sync fa-spin"></i>
  </span>
</template>

<script>
export default {
  created() {
    if (this.$store.isReady()) {
      this.$router.replace(this.$route.query.redirectTo || '/leaderboard')
    } else {
      this.$store.on('dataload', () => {
        this.$router.replace(this.$route.query.redirectTo || '/leaderboard')
      })
    }
  },
}
</script>