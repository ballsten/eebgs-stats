<template>
  <div class="container">
    <div class="columns is-centered is-vcentered spinner">
      <div class="column is-narrow has-text-centered">
        <span class="icon is-large">
          <i class="fas fa-spinner fa-spin fa-10x"></i>
        </span>
      </div>
    </div>
  </div>
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

<style lang="css" scoped>
div.spinner {
  margin-top: 400px;
}
</style>