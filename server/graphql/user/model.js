import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID
} from 'graphql'

export let UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    _id: {
      type: GraphQLID
    },
    nickname: {
      type: GraphQLString
    },
    province: {
      type: GraphQLString
    },
    country: {
      type: GraphQLString
    },
    city: {
      type: GraphQLString
    },
    avatar: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    }
  }
})

export let UserInput = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: {
    nickname: {
      type: GraphQLString
    }
  }
})
