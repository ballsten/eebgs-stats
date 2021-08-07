<template>
  <div class="section">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  created() {
    // database will open on first query. This hits the loading screen until it is done.
    let loader = this.$loading.show({
      loader: 'bars'
    })

    this.$store.on("dataload", () => {
      loader.hide()
    })
  }
}
</script>

<style>
</style>
