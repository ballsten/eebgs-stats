<template>
  <h1 class="title">EEBGS Leaderboard</h1>
  <result-table
    :headers="[
      {
        label: 'Rank',
        field: 'rank',
      },
      {
        label: 'Player',
        field: 'name',
      },
      {
        label: 'Played',
        field: 'plays',
      },
      {
        label: 'Win %',
        field: 'winPercent',
        type: Number,
        fixed: 2,
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
    :items="leaderboard"
    :sortColumn="1"
    sortOrder="ASC"
  ></result-table>

  <p>
    <i>*Players with less than 20 players are not included in the rankings</i>
  </p>
</template>

<script>
import ResultTable from './ResultTable.vue'

export default {
  components: {
    ResultTable,
  },
  data() {
    return {
      leaderboard: [],
    }
  },
  computed: {
    playerStyle: function (player) {
      return {
        'is-ineligible': player.plays >= 20,
      }
    },
  },
  async created() {
    this.leaderboard = await this.$store.getLeaderboard()
  },
}
</script>