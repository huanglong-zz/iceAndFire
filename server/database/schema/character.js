const mongoose = require('mongoose')
const { Schema } = mongoose

const CharacterSchema = new Schema({
  _id: String,
  url: String,
  name: String,
  gender: String,
  culture: String,
  born: String,
  died: String,
  titles: [
    String
  ],
  aliases: [
    String
  ],
  father: { type: String, ref: 'Character' },
  mother: { type: String, ref: 'Character' },
  spouse: { type: String, ref: 'Character' },
  allegiances: [
    { type: String, ref: 'House' }
  ],
  books: [
    { type: String, ref: 'Book' }
  ],
  povBooks: [
    { type: String, ref: 'Book' }
  ],
  // tvSeries: { type: ObjectId, ref: 'TvSeries'},
  tvSeries: [
    String
  ],
  playedBy: [
    String
  ]
})

CharacterSchema.set('toJSON', { virtuals: true })

CharacterSchema.virtual('IMDb', {
  ref: 'IMDb',
  localField: 'name',
  foreignField: 'name',
  justOne: true
})

mongoose.model('Character', CharacterSchema)
