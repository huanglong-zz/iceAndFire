export default {
  SET_AUTHUSER: (state, authUser) => {
    state.authUser = authUser
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_IMDb: (state, data) => {
    state.IMDb = data
  },
  UPDATA_IMDB: (state, { character, i }) => {
    state.IMDb[i] = character
  },
  REMOVE_IMDBCHARACTER: (state, i) => {
    state.IMDb.splice(i, 1)
  }
}
