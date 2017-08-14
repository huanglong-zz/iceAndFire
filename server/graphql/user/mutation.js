import {
  GraphQLNonNull,
  GraphQLBoolean
} from 'graphql'

import {
  UserInput
} from './model'
import mongoose from 'mongoose'
import uuid from 'uuid'

const UserModel = mongoose.model('User')

const UserCreate = {
  type: GraphQLBoolean,
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(UserInput)
    }
  },
  async resolve (root, params, options) {
    params.auth_token = uuid.v4()

    const userModel = new UserModel(params.data)
    const newUser = await userModel.save()

    if (!newUser) {
      throw new Error('Error create new user')
    }

    return true
  }
}

export default {
  UserCreate: UserCreate
}
