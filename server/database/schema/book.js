const mongoose = require('mongoose')
const { Schema } = mongoose


const BookSchema = new Schema({
  _id: String,
  url: String,
  name: String,
  isbn: String,
  authors: [
    String
  ],
  numberOfPages: Number,
  publisher: String,
  country: String,
  mediaType: String,
  released: Date,
  characters: [
    { type: String, ref: 'Character' }
  ],
  povCharacters: [
    { type: String, ref: 'Character' }
  ]
})

mongoose.model('Book', BookSchema)