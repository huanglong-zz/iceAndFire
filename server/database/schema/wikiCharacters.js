const mongoose = require('mongoose')
const { Schema } = mongoose
const Mixed = Schema.Types.Mixed

const WikiCharacterSchema = new Schema({
  _id: String,
  name: String,
  cname: String,
  playedBy: String,
  profile: String,
  allegiances: [
    String
  ],
  images: [
    String
  ],
  nmId: String,
  chId: String,
  sections: Mixed,
  intro: [
    String
  ],
  wikiId: Number
})

mongoose.model('WikiCharacter', WikiCharacterSchema)
