import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLID
} from 'graphql'

export let IMDbType = new GraphQLObjectType({
  name: 'IMDb',
  fields: {
    _id: {
      type: GraphQLID
    },
    playedBy: {
      type: GraphQLString
    },
    nmId: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    chId: {
      type: GraphQLString
    },
    url: {
      type: GraphQLString
    },
    images: {
      type: new GraphQLList(GraphQLString)
    },
    profile: {
      type: GraphQLString
    }
  }
})

export let IMDbInput = new GraphQLInputObjectType({
  name: 'IMDbInput',
  fields: {
    nickname: {
      type: GraphQLString
    }
  }
})
