import { controller, get, post, put, log, convert, required } from '../decorator/router'
import R from 'ramda'
import { getIMDbCharacter, getIMDbProfile, getIMDbImages } from '../crawler/imdb'
import { getWikiCharacters } from '../crawler/wikiData'

@controller('/crawler')
export class CrawlerController {
  @get('IMDbCharacters')
  @log
  async getCharacters (ctx, next) {
    let res = await getIMDbCharacter()
    console.log(res)
    return ctx.body = res
  }

  @get('APICharacters')
  @log
  async APICharacters (ctx, next) {
    let characters = require('../database/json/allCharacters.json')
    characters = R.filter(i => i.playedBy && i.playedBy.length)(characters)

    return ctx.body = characters
  }

  @get('getIMDbProfile')
  @log
  @required({ query: ['url'] })
  async getIMDbProfile (ctx, next) {
    const { url } = ctx.query
    let img = await getIMDbProfile(url)

    ctx.body = img
  }

  @get('getIMDbImages')
  @log
  @required({ query: ['url'] })
  async getIMDbImages (ctx, next) {
    const { url } = ctx.query
    let img = await getIMDbImages(url)

    ctx.body = img
  }

  @post('saveIMDb')
  @log
  async saveIMDb (ctx, next) {
    let { body } = ctx.request

    ctx.body = 'success'
  }
}
