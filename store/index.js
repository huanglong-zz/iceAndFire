import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const createStore = () => {
  return new Vuex.Store({
    state: {
      imageCDN: 'https://fireice.iblack7.com/',
      homePageScroll: {
        'home': 0,
        'house': 0
      },
      APICharacters: null,
      IMDb: null,
      authUser: null,
      shoppingScroll: 0,
      houses: [],
      characters: [],
      focusHouse: {},
      focusCharacter: {},
      user: null,
      products: [],
      focusProduct: {},
      payments: []
    },
    getters,
    actions,
    mutations
  })
}

export default createStore
