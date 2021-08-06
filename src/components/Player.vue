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
        <table class="table is-striped is-fullwidth">
          <thead>
            <tr>
              <th>Category</th>
              <th>Played</th>
              <th><abbr title="Win Percentage">Win %</abbr></th>
              <th>Won</th>
              <th>Lost</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(stats, name) in playerCategoryStats" :key="name">
              <td>{{ name }}</td>
              <td>{{ stats.plays }}</td>
              <td>{{ ((stats.wins / stats.plays) * 100).toFixed(2) }} %</td>
              <td>{{ stats.wins }}</td>
              <td>{{ stats.losses }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="column">Second column</div>
      <div class="column">Third column</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      player: {},
      playerStats: {},
      playerCategoryStats: {},
    };
  },
  async created() {
    let playerId = Number.parseInt(this.$route.params.id);

    let loader = this.$loading.show({ loader: "bars" });
    this.player = await this.$store.getPlayer(playerId);
    this.playerStats = await this.$store.getPlayerStats(playerId);
    this.playerCategoryStats = await this.$store.getPlayerCategoryStats(
      playerId
    );
    loader.hide();
  },
};
</script>
