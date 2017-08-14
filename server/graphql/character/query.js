import {
    GraphQLID,
    GraphQLList,
    GraphQLNonNull
} from 'graphql'

import {
  CharacterType
} from './model'

// import mongoose from 'mongoose'
// import userApi from '../../api/user'
import config from '../../config'

const request = require('request-promise')
const BASE_URL = config.base
// const CharacterModel = mongoose.model('Character')

function fetchResponseByURL (relativeURL) {
  return request({
    url: `${BASE_URL}${relativeURL}`,
    json: true
  })
}

function fetchCharacter () {
  return fetchResponseByURL('/api/db/characters')
}

function fetchCharacterByURL (relativeURL) {
  return fetchResponseByURL(relativeURL)
}

const Character = {
  type: CharacterType,
  args: {
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve (root, params, options) {
    return fetchCharacterByURL(`/api/db/characters/${params.id}`)
    // return CharacterModel.findOne({_id: params.id}).exec()
  }
}

const Characters = {
  type: new GraphQLList(CharacterType),
  args: {},
  resolve (root, params, options) {
    return fetchCharacter()
    // return CharacterModel.find({}).exec()
  }
}

export default {
  Character: Character,
  Characters: Characters
}
