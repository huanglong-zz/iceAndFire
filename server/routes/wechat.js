import { controller, get, post, log } from '../decorator/router'
import * as wechat from '../controllers/wechat'
import config from '../config'
import reply from '../wechat/reply'
import wechatMiddle from '../wechat-lib/middleware'

@controller('')
export class WxController {
  @get('/wechat-hear')
  @log
  async wxHear (ctx, next) {
    const middle = wechatMiddle(config.wechat, reply)
    await middle(ctx, next)
  }

  @post('/wechat-hear')
  @log
  async wxHear (ctx, next) {
    const middle = wechatMiddle(config.wechat, reply)
    await middle(ctx, next)
  }

  @get('/wechat-signature')
  async wxSignature (ctx, next) {
    await wechat.signature(ctx, next)
  }

  @get('/wechat-redirect')
  async wxRedirect (ctx, next) {
    console.log('into redirect')
    await wechat.redirect(ctx, next)
  }

  @get('/wechat-oauth')
  async wxOAuth (ctx, next) {
    await wechat.oauth(ctx, next)
  }
}
