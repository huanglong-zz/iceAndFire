import {
  GraphQLNonNull,
  GraphQLBoolean
} from 'graphql'

import {
  BookInput
} from './model'
import mongoose from 'mongoose'
import uuid from 'uuid'

const BookModel = mongoose.model('Book')

const BookCreate = {
  type: GraphQLBoolean,
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(BookInput)
    }
  },
  async resolve (root, params, options) {
    params.auth_token = uuid.v4()

    const userModel = new BookModel(params.data)
    const newBook = await userModel.save()

    if (!newBook) {
      throw new Error('Error create new user')
    }

    return true
  }
}

export default {
  BookCreate: BookCreate
}
