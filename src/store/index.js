/*
  store

  The store is responsible for data management
*/

import axios from 'axios'

import Dexie from 'dexie'

export class Store extends Dexie {

  constructor() {
    super('eebgs')

    this.on.addEventType("dataload")

    this.version(1).stores({
      players: "uuid, id",
      games: "uuid, id",
      locations: "uuid, id",
      plays: "uuid, locationRefId, gameRefId, bggId",
      playerScores: "++id, playUUID, playerRefId"
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

    for(let player of data.players) {
      this.players.put(player)
    }

    for(let game of data.games) {
      this.games.put(game)
    }
    
    for(let location of data.locations) {
      this.locations.put(location)
    }

    for(let play of data.plays) {
      for(let playerScore of play.playerScores) {
        playerScore.playUUID = play.uuid
        this.playerScores.put(playerScore)
      }

      delete play.playerScores
      this.plays.put(play)
    }

    this.on.dataload.fire()
  }
}