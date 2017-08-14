import {
  GraphQLNonNull,
  GraphQLBoolean
} from 'graphql'

import {
  CharacterInput
} from './model'
import mongoose from 'mongoose'
import uuid from 'uuid'

const CharacterModel = mongoose.model('Character')

const CharacterCreate = {
  type: GraphQLBoolean,
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(CharacterInput)
    }
  },
  async resolve (root, params, options) {
    params.auth_token = uuid.v4()

    const userModel = new CharacterModel(params.data)
    const newCharacter = await userModel.save()

    if (!newCharacter) {
      throw new Error('Error create new user')
    }

    return true
  }
}

export default {
  CharacterCreate: CharacterCreate
}
