/*
  store

  The store is responsible for data management
*/

import axios from 'axios'

import Dexie from 'dexie'

import parser from 'fast-xml-parser'

const BGG_URL = "https://api.geekdo.com/xmlapi2"

export class Store extends Dexie {

  constructor() {
    super('eebgs')

    this.on.addEventType("dataload")

    this.version(1).stores({
      players: "uuid, id",
      games: "uuid, id, bggId, *categories, *mechanics",
      locations: "uuid, id",
      plays: "uuid, locationRefId, gameRefId, bggId",
      playerScores: "comboUUID, playUUID, playerRefId"
    })

    this.on('ready', () => {
      this.players = this.table('players')
      this.games = this.table('games')
      this.locations = this.table('locations')
      this.plays = this.table('plays')
      this.playerScores = this.table('playerScores')

      this.loadData()
    })

    this.open()
  }

  async loadData() {
    // fetch the data
    let data = (await axios.get('data/BGStatsExport.json')).data

    for (let player of data.players) {
      this.players.put(player)
    }

    /*
     Check what games are new and then bulk request them from bgg.
     Process the bgg results and incorporate mechanics, categories and description
     */

    let newGames = []

    for (let game of data.games) {
      if (!(await this.games.get(game.uuid))) {
        newGames.push(game)
      }
    }

    const newGameIds = newGames.map(x => x.bggId).join(',')
    const gameXML = (await axios.get(BGG_URL + "/thing?id=" + newGameIds)).data
    const bggGames = parser.parse(gameXML, { ignoreAttributes: false }).items.item

    for (let game of newGames) {
      const bggGame = bggGames.find(x => x['@_id'] == game.bggId)
      game.categories = []
      game.mechanics = []
      for (let link of bggGame.link) {
        if (link['@_type'] == "boardgamecategory") game.categories.push(link['@_value'])
        if (link['@_type'] == "boardgamemechanic") game.mechanics.push(link['@_value'])
      }
      game.description = bggGame.description

      this.games.add(game)
    }

    for (let location of data.locations) {
      this.locations.put(location)
    }

    for (let play of data.plays) {
      for (let playerScore of play.playerScores) {
        playerScore.playUUID = play.uuid
        playerScore.comboUUID = playerScore.playUUID + "-" + playerScore.playerRefId
        this.playerScores.put(playerScore, "comboUUID")
      }

      delete play.playerScores
      this.plays.put(play)
    }

    this.on.dataload.fire()
  }

  async getLeaderboard() {
    let leaderboard = []

    // loop through each player and collate their stats

    await this.transaction("r", [this.players, this.playerScores], async () => {
      await this.players.each(async (player) => {
        let playerStats = {
          id: player.id,
          name: player.name,
          position: 0,
          plays: 0,
          wins: 0,
          losses: 0,
          winPercent: 0,
          eligible: false
        }
        await this.playerScores.where('playerRefId').equals(player.id).each((ps) => {
          playerStats.plays++
          if (ps.winner) {
            playerStats.wins++
          } else {
            playerStats.losses++
          }
        })
        playerStats.winPercent = playerStats.wins / playerStats.plays
        playerStats.eligible = playerStats.plays >= 20 ? true : false
        leaderboard.push(playerStats)
      })
    })

    // sort results and calculate position
    leaderboard.sort((a, b) => (b.winPercent * (b.eligible ? 1 : 0))  > (a.winPercent * (a.eligible ? 1 : 0)))
    let position = 1
    leaderboard.forEach( (p) => p.position = position++)

    return leaderboard
  }
}