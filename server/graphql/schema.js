import {
  GraphQLObjectType,
  GraphQLSchema
} from 'graphql'

import UserQueries from './user/query'
import UserMutations from './user/mutation'
import HouseQueries from './house/query'
import HouseMutations from './house/mutation'
import BookQueries from './book/query'
import BookMutations from './book/mutation'
import IMDbQueries from './imdb/query'
import IMDbMutations from './imdb/mutation'
import CharacterQueries from './character/query'
import CharacterMutations from './character/mutation'

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Queries',
    fields: Object.assign(
      UserQueries,
      BookQueries,
      IMDbQueries,
      CharacterQueries,
      HouseQueries
    )
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutations',
    fields: Object.assign(
      UserMutations,
      BookMutations,
      IMDbMutations,
      CharacterMutations,
      HouseMutations
    )
  })
})
