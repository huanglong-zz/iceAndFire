import {
  GraphQLNonNull,
  GraphQLBoolean
} from 'graphql'

import {
  IMDbInput
} from './model'
import mongoose from 'mongoose'
import uuid from 'uuid'

const IMDbModel = mongoose.model('IMDb')

const IMDbCreate = {
  type: GraphQLBoolean,
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(IMDbInput)
    }
  },
  async resolve (root, params, options) {
    params.auth_token = uuid.v4()

    const userModel = new IMDbModel(params.data)
    const newIMDb = await userModel.save()

    if (!newIMDb) {
      throw new Error('Error create new user')
    }

    return true
  }
}

export default {
  IMDbCreate: IMDbCreate
}
