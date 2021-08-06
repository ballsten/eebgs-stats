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
      players: "id",
      games: "id, bggId, *categories, *mechanics",
      locations: "id",
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
  }

  /*
    Vue Plugin install
  */
  install(app, options) {
    app.config.globalProperties.$store = this
  }

  async loadData() {
    // fetch the data
    let data = (await axios.get('/data/BGStatsExport.json')).data

    await this.transaction('rw', 'players', async () => {

      for (let player of data.players) {
        this.players.put(player)
      }
    })

    /*
     Check what games are new and then bulk request them from bgg.
     Process the bgg results and incorporate mechanics, categories and description
     */

    let newGames = []

    await this.transaction('r', 'games', async () => {
      for (let game of data.games) {
        if (!(await this.games.get(game.uuid))) {
          newGames.push(game)
        }
      }
    })

    const newGameIds = newGames.map(x => x.bggId).join(',')
    const gameXML = (await axios.get(BGG_URL + "/thing?id=" + newGameIds)).data
    const bggGames = parser.parse(gameXML, { ignoreAttributes: false }).items.item


    await this.transaction('rw', 'games', async () => {
      for (let game of newGames) {
        const bggGame = bggGames.find(x => x['@_id'] == game.bggId)
        game.categories = []
        game.mechanics = []
        for (let link of bggGame.link) {
          if (link['@_type'] == "boardgamecategory") game.categories.push(link['@_value'])
          if (link['@_type'] == "boardgamemechanic") game.mechanics.push(link['@_value'])
        }
        game.description = bggGame.description

        this.games.put(game)
      }
    })

    await this.transaction('rw', 'locations', async () => {
      for (let location of data.locations) {
        this.locations.put(location)
      }
    })

    await this.transaction('rw', ['plays', 'playerScores'], async () => {
      for (let play of data.plays) {
        for (let playerScore of play.playerScores) {
          playerScore.playUUID = play.uuid
          playerScore.comboUUID = playerScore.playUUID + "-" + playerScore.playerRefId
          this.playerScores.put(playerScore, "comboUUID")
        }

        delete play.playerScores
        this.plays.put(play)
      }
    })

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
          position: "",
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
    leaderboard.sort((a, b) => (b.winPercent * (b.eligible ? 1 : 0)) > (a.winPercent * (a.eligible ? 1 : 0)))
    let position = 1
    leaderboard.forEach((p) => {
      if (p.eligible) {
        p.position = position++
      }
    })

    return leaderboard
  }

  // get player details

  async getPlayer(id) {
    return await this.players.get(id)
  }

  async getPlayerStats(id) {
    let scores = await this.playerScores.where('playerRefId').equals(id).toArray()
    return {
      plays: scores.length,
      wins: scores.filter((x) => x.winner).length,
      losses: scores.filter((x) => !x.winner).length
    }
  }

  async getPlayerCategoryStats(id) {
    let results = {}

    await this.transaction('r', ['playerScores', 'plays', 'games'], async () => {
      let scores = await this.playerScores.where('playerRefId').equals(id).toArray()

      let plays = await this.plays.bulkGet(scores.map(x => x.playUUID))

      let games = await this.games.bulkGet(plays.map(x => x.gameRefId))

      let categories = new Set(games.map(x => x.categories).flat())

      
      categories.forEach( x => results[x] = { plays: 0, wins: 0, losses: 0 })

      for(let score of scores) {
        let play = await this.plays.get(score.playUUID)
        let game = await this.games.get(play.gameRefId)
        game.categories.forEach(x => {
          results[x].plays += 1
          if(score.winner) {
            results[x].wins += 1
          } else {
            results[x].losses += 1
          }
        })
      }
    }) 

    return results
  }
}