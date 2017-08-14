import fs from 'fs'
import mongoose from 'mongoose'
import { resolve } from 'path'
import _ from 'lodash'
import config from '../config'
import R from 'ramda'

const models = resolve(__dirname, '../database/schema')

fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(resolve(models, file)))

const formatWikiCharacters = R.map(i => {
  i._id = i.nmId

  return i
})

// 安装 mongoose
// resolve
// err = error
// ../config
// , save token

var characters = require('database/json/allCharacters.json')
var houses = require('database/json/allHouses.json')
// var books = require('database/json/allBooks.json')
// var imdb = require('database/json/IMDb.json')
var wikiCharacters = require('database/json/wikiCharacters.json')
var wikiHouses = require('database/json/wikiHouses.json')

wikiCharacters = formatWikiCharacters(wikiCharacters)

export const database = app => {
  if (config.env === 'development') {
    mongoose.set('debug', true)
  }

  mongoose.connect(config.db)

  mongoose.connection.on('disconnected', () => {
    mongoose.connect(config.db)
  })

  mongoose.connection.on('error', err => {
    console.error(err)
  })

  mongoose.connection.once('open', async () => {
    console.log('Connected to MongoDB', config.db)

    const Character = mongoose.model('Character')
    const WikiCharacter = mongoose.model('WikiCharacter')
    const WikiHouse = mongoose.model('WikiHouse')
    const User = mongoose.model('User')

    // 说明第一次初始化插入数据已经完成

    characters = _.map(characters, formatData)
    houses = _.map(houses, formatData)

    const _characters = _.filter(characters, character => character.playedBy && character.playedBy.length)

    let existCharacter = await Character.find({}).exec()
    if (!existCharacter.length) Character.insertMany(characters)

    let existWikiCharacter = await WikiCharacter.find({}).exec()
    if (!existWikiCharacter.length) WikiCharacter.insertMany(wikiCharacters)

    let existwikiHouses = await WikiHouse.find({}).exec()
    if (!existwikiHouses.length) WikiHouse.insertMany(wikiHouses)

    let user = await User.findOne({email: 'pengzezhi5266@gmail.com'}).exec()
    if (!user) new User({email: 'pengzezhi5266@gmail.com', password: 'pzzzzzjs123!', role: 'admin'}).save()
  })
}

const formatData = (item, index) => {
  item._id = item.url

  _.forIn(item, (value, key) => {
    if (!value || !value.length) delete item[key]
  })

  return item
}

const formatIMDb = (item, _characters) => {
  if (item.playedBy) {
    let character = _.find(_characters, character =>
      character.playedBy.includes(item.playedBy) && character.name === item.name)

    if (character) item.url = character.url
  }

  return item
}
