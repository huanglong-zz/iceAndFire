import {
    GraphQLID,
    GraphQLList,
    GraphQLNonNull
} from 'graphql'

import {
  BookType
} from './model'

// import mongoose from 'mongoose'
// import userApi from '../../api/user'
import config from '../../config'

const request = require('request-promise')
const BASE_URL = config.base
// const BookModel = mongoose.model('Book')

function fetchResponseByURL (relativeURL) {
  return request({
    url: `${BASE_URL}${relativeURL}`,
    json: true
  })
}

function fetchBook () {
  return fetchResponseByURL('/api/db/books')
}

function fetchBookByURL (relativeURL) {
  return fetchResponseByURL(relativeURL)
}

const Book = {
  type: BookType,
  args: {
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve (root, params, options) {
    return fetchBookByURL(`/api/db/books/${params.id}`)
    // return BookModel.findOne({_id: params.id}).exec()
  }
}

const Books = {
  type: new GraphQLList(BookType),
  args: {},
  resolve (root, params, options) {
    return fetchBook()
    // return BookModel.find({}).exec()
  }
}

export default {
  Book: Book,
  Books: Books
}
