import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLID
} from 'graphql'

export let titleType = new GraphQLObjectType({
  name: 'Title',
  fields: {
    title: {
      type: GraphQLString
    }
  }
})

export let HouseType = new GraphQLObjectType({
  name: 'House',
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
    region: {
      type: GraphQLString
    },
    coatOfArms: {
      type: GraphQLString
    },
    words: {
      type: GraphQLString
    },
    founded: {
      type: GraphQLString
    },
    diedOut: {
      type: GraphQLString
    },
    titles: {
      type: new GraphQLList(GraphQLString)
    },
    seats: {
      type: new GraphQLList(GraphQLString)
    },
    currentLord: {
      type: GraphQLString
    },
    heir: {
      type: GraphQLString
    },
    overlord: {
      type: GraphQLString
    },
    founder: {
      type: GraphQLString
    },
    cadetBranches: {
      type: new GraphQLList(GraphQLString)
    },
    swornMembers: {
      type: new GraphQLList(GraphQLString)
    },
    ancestralWeapons: {
      type: new GraphQLList(GraphQLString)
    }
  }
})

export let HouseInput = new GraphQLInputObjectType({
  name: 'HouseInput',
  fields: {
    nickname: {
      type: GraphQLString
    }
  }
})
