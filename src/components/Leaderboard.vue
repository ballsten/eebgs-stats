<template>
  <h1 class="title">EEBGS Leaderboard</h1>
  <table class="table is-striped is-fullwidth" ref="leaderboard">
    <thead>
      <tr>
        <th><abbr title="Rank">Rank</abbr></th>
        <th>Player</th>
        <th><abbr title="Played">Played</abbr></th>
        <th><abbr title="Win Percentage">Win %</abbr></th>
        <th>Won</th>
        <th>Lost</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="player in leaderboard"
        :key="player.id"
        :class="{ 'is-ineligible': !player.eligible }"
      >
        <td>{{ player.position }}</td>
        <td><router-link :to="{ name: 'player', params: { id: player.id }}">{{ player.name }}</router-link></td>
        <td>{{ player.plays }}</td>
        <td>{{ (player.winPercent * 100).toFixed(2) }} %</td>
        <td>{{ player.wins }}</td>
        <td>{{ player.losses }}</td>
      </tr>
    </tbody>
  </table>
  <p>
    <i>*Players with less than 20 players are not included in the rankings</i>
  </p>
</template>

<script>
export default {
  data() {
    return {
      leaderboard: [],
    };
  },
  computed: {
    playerStyle: function (player) {
      return {
        "is-ineligible": player.plays >= 20,
      }
    },
  },
  async created() {
       this.leaderboard = await this.$store.getLeaderboard()
  }
}
</script>