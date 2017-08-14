import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLID
} from 'graphql'

export let CharacterType = new GraphQLObjectType({
  name: 'Character',
  fields: {
    _id: {
      type: GraphQLID
    },
    url: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    gender: {
      type: GraphQLString
    },
    culture: {
      type: GraphQLString
    },
    born: {
      type: GraphQLString
    },
    died: {
      type: GraphQLString
    },
    titles: {
      type: new GraphQLList(GraphQLString)
    },
    aliases: {
      type: new GraphQLList(GraphQLString)
    },
    father: {
      type: new GraphQLList(GraphQLString)
    },
    mother: {
      type: new GraphQLList(GraphQLString)
    },
    spouse: {
      type: new GraphQLList(GraphQLString)
    },
    allegiances: {
      type: new GraphQLList(GraphQLString)
    },
    books: {
      type: new GraphQLList(GraphQLString)
    },
    povBooks: {
      type: new GraphQLList(GraphQLString)
    },
    // tvSeries: { type: ObjectId, ref: 'TvSeries'},
    tvSeries: {
      type: new GraphQLList(GraphQLString)
    },
    playedBy: {
      type: new GraphQLList(GraphQLString)
    }
  }
})

export let CharacterInput = new GraphQLInputObjectType({
  name: 'CharacterInput',
  fields: {
    nickname: {
      type: GraphQLString
    }
  }
})
