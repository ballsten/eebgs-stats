<template>
  <section class="hero">
    <div class="hero-body">
      <p class="title">{{ player.name }}</p>
    </div>
  </section>
  <div class="container mt-6 mb-6">
    <nav class="level">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Plays</p>
          <p class="title">{{ playerStats.plays }}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Wins</p>
          <p class="title">{{ playerStats.wins }}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Losses</p>
          <p class="title">{{ playerStats.losses }}</p>
        </div>
      </div>
    </nav>
  </div>
  <div class="container">
    <div class="columns">
      <div class="column">
        <h6 class="title is-6">by BGG Category</h6>
        <result-table
          :headers="[
            {
              label: 'Category',
              field: 'category',
            },
            {
              label: 'Played',
              field: 'plays',
            },
            {
              label: 'Win %',
              field: 'winPercent',
              type: Number,
              fixed: 2
            },
            {
              label: 'Won',
              field: 'wins',
            },
            {
              label: 'Lost',
              field: 'losses',
            },
          ]"
          :items="playerCategoryStats"
          :limit="5"
          :sortColumn="2"
          sortOrder="DESC"
        ></result-table>
      </div>
      <div class="column">Second column</div>
      <div class="column">Third column</div>
    </div>
  </div>
</template>

<script>
import ResultTable from './ResultTable.vue'

export default {
  components: {
    ResultTable,
  },
  data() {
    return {
      player: {},
      playerStats: {},
      playerCategoryStats: [],
    }
  },
  async created() {
    let playerId = Number.parseInt(this.$route.params.id)

    let loader = this.$loading.show({ loader: 'bars' })
    this.player = await this.$store.getPlayer(playerId)
    this.playerStats = await this.$store.getPlayerStats(playerId)
    this.playerCategoryStats = await this.$store.getPlayerCategoryStats(
      playerId
    )
    loader.hide()
  },
}
</script>
