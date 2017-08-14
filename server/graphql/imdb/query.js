import {
    GraphQLID,
    GraphQLList,
    GraphQLNonNull
} from 'graphql'

import {
  IMDbType
} from './model'

// import mongoose from 'mongoose'
// import userApi from '../../api/user'
import config from '../../config'

const request = require('request-promise')
const BASE_URL = config.base
// const IMDbModel = mongoose.model('IMDb')

function fetchResponseByURL (relativeURL) {
  return request({
    url: `${BASE_URL}${relativeURL}`,
    json: true
  })
}

function fetchIMDb () {
  return fetchResponseByURL('/api/db/IMDb/characters')
}

function fetchIMDbByURL (relativeURL) {
  return fetchResponseByURL(relativeURL)
}

const IMDb = {
  type: IMDbType,
  args: {
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve (root, params, options) {
    return fetchIMDbByURL(`/api/db/IMDb/characters/${params.id}`)
    // return IMDbModel.findOne({_id: params.id}).exec()
  }
}

const IMDbs = {
  type: new GraphQLList(IMDbType),
  args: {},
  resolve (root, params, options) {
    console.log(params)
    return fetchIMDb()
    // return IMDbModel.find({}).exec()
  }
}

export default {
  IMDb: IMDb,
  IMDbs: IMDbs
}
