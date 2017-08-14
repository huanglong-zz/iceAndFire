const mongoose = require('mongoose')
const { Schema } = mongoose

const HouseSchema = new Schema({
  _id: String,
  url: String,
  name: String,
  region: String,
  coatOfArms: String,
  words: String,
  titles: [
    String
  ],
  seats: [
    String
  ],
  currentLord: { type: String, ref: 'Character' },
  heir: { type: String, ref: 'Character' },
  overlord: { type: String, ref: 'House' },
  founded: String,
  founder: { type: String, ref: 'Character' },
  diedOut: String,
  ancestralWeapons: [
    String
  ],
  cadetBranches: [
    { type: String, ref: 'House' }
  ],
  swornMembers: [
    { type: String, ref: 'Character' }
  ]
})

mongoose.model('House', HouseSchema)
