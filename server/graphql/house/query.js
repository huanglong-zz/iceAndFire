import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull
} from 'graphql'

import {
  HouseType
} from './model'

// import mongoose from 'mongoose'
// import userApi from '../../api/user'
import config from '../../config'

const request = require('request-promise')
const BASE_URL = config.base
// const HouseModel = mongoose.model('House')

function fetchResponseByURL (relativeURL) {
  return request({
    url: `${BASE_URL}${relativeURL}`,
    json: true
  })
}

function fetchHouse () {
  return fetchResponseByURL('/api/db/houses')
}

function fetchHouseByURL (relativeURL) {
  return fetchResponseByURL(relativeURL)
}

const House = {
  type: HouseType,
  args: {
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve (root, params, options) {
    return fetchHouseByURL(`/api/db/houses/${params.id}`)
  }
}

const Houses = {
  type: new GraphQLList(HouseType),
  args: {},
  resolve (root, params, options) {
    return fetchHouse()
  }
}

export default {
  House: House,
  Houses: Houses
}
