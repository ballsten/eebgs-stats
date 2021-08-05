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
      players: "uuid, id, name, isAnonymous, modificationDate, bggUsername",
      games: "uuid, id, name, modificationDate, cooperative, highestWins, noPoints, usesTeams, urlThumb, urlImage, bggName, bggYear, bggId, designers, *metaData, isBaseGame, isExpansion, rating, minPlayerCount, maxPlayerCount, minPlayTime, maxPlayTime, minAge, preferredImage, *copies",
      locations: "uuid, id, name, modificationDate",
      plays: "uuid, modificationDate, entryDate, playDate, usesTeams, durationMin, ignored, manualWinner, rounds, bggId, locationRefId, gameRefId, rating, nemestatsId, scoringSetting, *playerScores"
    })

    this.on('ready', () => {
      this.players = this.table('players')
      this.games = this.table('games')
      this.locations = this.table('locations')
      this.plays = this.table('plays')

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
      this.plays.put(play)
    }
  }
}