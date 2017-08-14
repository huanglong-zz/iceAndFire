import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLString,
  GraphQLID
} from 'graphql'

import GraphQLDate from 'graphql-date'

export let BookType = new GraphQLObjectType({
  name: 'Book',
  fields: {
    _id: {
      type: GraphQLID
    },
    diedOut: {
      type: GraphQLString
    },
    titles: {
      type: new GraphQLList(GraphQLString)
    },
    url: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    isbn: {
      type: GraphQLString
    },
    authors: {
      type: new GraphQLList(GraphQLString)
    },
    numberOfPages: {
      type: GraphQLInt
    },
    publisher: {
      type: GraphQLString
    },
    country: {
      type: GraphQLString
    },
    mediaType: {
      type: GraphQLString
    },
    released: {
      type: GraphQLDate
    },
    characters: {
      type: new GraphQLList(GraphQLString)
    },
    povCharacters: {
      type: new GraphQLList(GraphQLString)
    }
  }
})

export let BookInput = new GraphQLInputObjectType({
  name: 'BookInput',
  fields: {
    nickname: {
      type: GraphQLString
    }
  }
})
