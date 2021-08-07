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
      this.$router.push('/leaderboard')
    } else {
      this.$store.on('dataload', () => {
        this.$router.push('/leaderboard')
      })
    }
  },
}
</script>