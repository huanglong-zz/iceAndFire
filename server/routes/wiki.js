import { controller, get, post, put, log, convert } from '../decorator/router'
import mongoose from 'mongoose'

const WikiCharacter = mongoose.model('WikiCharacter')
const WikiHouse = mongoose.model('WikiHouse')

@controller('/wiki')
export class WikiController {
  @get('/characters/:_id')
  @log
  async getCharacter (ctx, next) {
    const { params } = ctx
    const { _id } = params

    let character = await WikiCharacter.findById(_id).exec()

    ctx.body = character
  }

  @put('/characters/:_id')
  @log
  async putCharacter (ctx, next) {
    const { params } = ctx
    const { _id } = params
    const { body } = ctx.request

    let character = await WikiCharacter.findById(_id).exec()

    character.sections = body.sections
    character.profile = body.profile
    character.name = body.name
    character.cname = body.cname
    character.playedBy = body.playedBy
    character.images = body.images

    character = await character.save()

    ctx.body = character
  }

  @get('/characters')
  @log
  async getCharacters (ctx, next) {
    let { limit = 20 } = ctx.query
    let characters = await WikiCharacter
      .find({})
      .limit(Number(limit))
      .exec()

    ctx.body = characters
  }

  @get('/houses/:_id')
  @log
  async getHouse (ctx, next) {
    const { params } = ctx
    const { _id } = params

    if (!_id) return (ctx.body = '_id is required')

    let house = await WikiHouse
      .findById(_id)
      .populate({
        path: 'swornMembers.character',
        select: 'name cname profile nmId'
      })
      .exec()

    ctx.body = house
  }

  @put('houses/:_id')
  @log
  async putHouse (ctx, next) {
    const { params } = ctx
    const { _id } = params
    const { body } = ctx.request

    let house = await WikiHouse.findById(_id).exec()

    house.sections = body.sections
    house.swornMembers = body.swornMembers
    house.words = body.words
    house.name = body.name
    house.cname = body.cname

    house = await house.save()

    ctx.body = house
  }

  @get('/houses')
  @log
  async getHouses (ctx, next) {
    let houses = await WikiHouse
      .find({})
      .populate({
        path: 'swornMembers.character',
        select: '_id name cname profile'
      })
      .exec()

    ctx.body = houses
  }
}
