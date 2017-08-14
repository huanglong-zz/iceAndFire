import {
  GraphQLNonNull,
  GraphQLBoolean
} from 'graphql'

import {
  HouseInput
} from './model'
import mongoose from 'mongoose'
import uuid from 'uuid'

const HouseModel = mongoose.model('House')

const HouseCreate = {
  type: GraphQLBoolean,
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(HouseInput)
    }
  },
  async resolve (root, params, options) {
    params.auth_token = uuid.v4()

    return true
  }
}

export default {
  HouseCreate: HouseCreate
}
