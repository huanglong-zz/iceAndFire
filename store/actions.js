import axios from 'axios'
import Services from './services'

export default {
  nuxtServerInit ({ commit }, { req }) {
    console.log(req.session)
    if (req.session && req.session.user) {
      const { email, nickname, avatarUrl } = req.session.user
      const user = {
        email,
        nickname,
        avatarUrl
      }

      commit('SET_USER', user)
    }
  },

  getWechatSignature ({ commit }, url) {
    return Services.getWechatSignature(url)
  },

  getWechatOAuth ({ commit }, url) {
    return Services.getWechatOAuth(url)
  },

  setAuthUser ({ commit }, authUser) {
    commit('SET_AUTHUSER', authUser)
  },

  async createOrder ({ state }, obj) {
    const { data } = await Services.createOrder(obj)
    return data
  },

  async login ({ commit }, { email, password }) {
    try {
      let res = await axios.post('/api/login', {
        email,
        password
      })

      let { data } = res
      if (!data.ret) commit('SET_USER', data.user)

      return data
    } catch (e) {
      if (e.response.status === 401) {
        throw new Error('You can\'t do it')
      }
    }
  },

  async logout ({ commit }) {
    await axios.post('/api/logout')
    commit('SET_USER', null)
  },

  async fetchHouses ({ state }) {
    const res = await Services.allHouses()
    state.houses = res.data

    return res
  },

  async fetchCharacters ({ state }) {
    const res = await Services.povCharacters(500)

    state.characters = res.data
    return res
  },

  async fetchProducts ({ state }) {
    const res = await Services.allProducts()

    state.products = res.data
    return res
  },

  async focusProduct ({ state }, _id) {
    if (state.focusProduct && _id === state.focusProduct._id) return
    const { data } = await Services.focusProduct(_id)
    data.price = Number(data.price)
    state.focusProduct = data
    return data
  },

  async fetchPayments ({ state }) {
    let { data } = await Services.getPayments()
    console.log(data)
    state.payments = data
    return data
  },

  async focusHouse ({ state }, _id) {
    if (_id === state.focusHouse._id) return
    const res = await Services.focusHouse(_id)
    state.focusHouse = res.data
    return res
  },

  async focusCharacter ({ state }, _id) {
    if (_id === state.focusCharacter._id) return
    const res = await Services.focusCharacter(_id)
    state.focusCharacter = res.data
    return res
  },

  async updateCharacter ({ state, dispatch }, character) {
    await axios.put(`/wiki/characters/${character._id}`, character)
    await dispatch('fetchCharacters')

    return ''
  },

  async updateHouse ({ state, dispatch }, house) {
    await axios.put(`/wiki/houses/${house._id}`, house)
    await dispatch('fetchHouses')

    return ''
  },

  async saveProduct ({ state, dispatch }, product) {
    await axios.post('/api/products', product)
    let res = await dispatch('fetchProducts')

    return res.data
  },

  async putProduct ({ state, dispatch }, product) {
    await axios.put('/api/products', product)
    let res = await dispatch('fetchProducts')

    return res.data
  },

  async crawlerIMDbCharacters ({ state }) {
    const { data } = await Services.crawlerIMDbcharacters()
    state.IMDb = data
    return data
  },

  async APICharacters ({ state }) {
    const { data } = await Services.APICharacters()
    state.APICharacters = data

    return data
  },

  homePageScroll ({ state }, { home, house }) {
    state.homePageScroll = {
      home: home,
      house: house
    }
  },

  shoppingScroll ({ state }, payload) {
    state.shoppingScroll = payload
  },

  async finishExam ({ state }, obj) {
    const { data } = await Services.finishExam(obj)
    return data
  }
}
