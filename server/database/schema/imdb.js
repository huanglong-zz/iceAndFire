const mongoose = require('mongoose')
const { Schema } = mongoose

const IMDbSchema = new Schema({
  playedBy: String,
  nmId: String,
  name: String,
  chId: String,
  url: { type: String, ref: 'Character' },
  images: [
    String
  ],
  profile: String
})

mongoose.model('IMDb', IMDbSchema)
