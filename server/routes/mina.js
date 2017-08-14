import { controller, get, post, log, required } from '../decorator/router'
import mongoose from 'mongoose'
import { openidAndSessionKey, WXBizDataCrypt } from '../wechat/mina'
import { getParamsAsync } from '../wechat-lib/pay'

const User = mongoose.model('User')
const Product = mongoose.model('Product')
const Payment = mongoose.model('Payment')

// var nanoid = require('nanoid')
// model.id = nanoid() //=> "Uakgb_J5m9g~0JDMbcJqLJ"

@controller('/mina')
export class MinaController {
  @get('codeAndSessionKey')
  @required({ query: ['code'] })
  async getCodeAndSessionKey (ctx, next) {
    const { code } = ctx.query

    let res = await openidAndSessionKey(code)

    ctx.body = res
  }

  @get('user')
  @required({ query: ['code', 'userInfo'] })
  async getUser (ctx, next) {
    const { code, userInfo } = ctx.query
    const minaUser = await openidAndSessionKey(code)

    let user = await User
      .findOne({
        openid: {
          '$in': [minaUser.openid]
        }
      })
      .exec()

    if (!user) {
      var wxBizDataCrypt = new WXBizDataCrypt(minaUser.session_key)
      var decryptData = wxBizDataCrypt.decryptData(userInfo.encryptedData, userInfo.iv)

      try {
        user = await User.findOne({unionId: decryptData.unionId}).exec()

        if (!user) {
          let _userInfo = userInfo.userInfo

          user = new User({
            avatarUrl: _userInfo.avatarUrl,
            nickname: _userInfo.nickname,
            unionId: wxBizDataCrypt.unionid,
            openid: [ minaUser.openid ],
            gender: _userInfo.gender,
            country: _userInfo.country,
            province: _userInfo.province,
            city: _userInfo.city
          })

          await user.save()
        }
      } catch (e) {
        ctx.throw(501, e)
      }
    }

    const payment = await Payment
      .find({ user: user._id, success: 1 })
      .populate('product')
      .exec()

    ctx.body = {
      user,
      payment
    }
  }

  @post('createOrder')
  @log
  @required({ body: ['code', 'productId', 'userInfo', 'name', 'address', 'phoneNumber'] })
  async createOrder (ctx, next) {
    var ip = ctx.ip.replace('::ffff:', '')
    const { code, productId, userInfo, name, address, phoneNumber } = ctx.request.body

    try {
      var product = await Product.findById(productId).exec()

      if (!product) return (ctx.body = { ret: 1, msg: '这个宝贝不存在' })
    } catch (e) {
      ctx.throw(501, e)
    }

    try {
      // 拿到用户的 sessionKey 和 openid
      var minaUser = await openidAndSessionKey(code)

      var wxBizDataCrypt = new WXBizDataCrypt(minaUser.session_key)
      // 小程序解密拿到 unionId
      // https://mp.weixin.qq.com/debug/wxadoc/dev/api/open.html#wxgetuserinfoobject
      var decryptData = wxBizDataCrypt.decryptData(userInfo.encryptedData, userInfo.iv)

      try {
        var user = await User.findOne({unionId: decryptData.unionId}).exec()

        if (!user) {
          let _userInfo = userInfo.userInfo

          user = new User({
            avatarUrl: _userInfo.avatarUrl,
            nickname: _userInfo.nickname,
            unionId: wxBizDataCrypt.unionid,
            openid: [ minaUser.openid ],
            gender: _userInfo.gender,
            country: _userInfo.country,
            province: _userInfo.province,
            city: _userInfo.city
          })

          await user.save()
        }
      } catch (e) {
        console.log(e)
        ctx.throw(501, e)
      }

      var _order = {
        body: product.title,
        attach: '小程序周边支付',
        out_trade_no: 'Product' + (+new Date),
        total_fee: 0.1 * 100,
        spbill_create_ip: ip,
        openid: minaUser.openid,
        trade_type: 'JSAPI'
      }

      var order = await getParamsAsync(_order)

      var payment = new Payment({
        user: user._id,
        product: product._id,
        success: 0,
        name: name,
        address: address,
        phoneNumber: phoneNumber,
        payType: '小程序',
        totalFee: product.totalFee
      })

      await payment.save()

      ctx.body = {
        order: order,
        product: product,
        payment: payment,
        user: user
      }

    } catch (e) {
      console.log(e)
      ctx.throw(501, e)
    }
  }

  @post('payment')
  @log
  async payment (ctx, next) {
    const { body } = ctx.request

    try {
      var payment = await Payment.findById(body.payment._id).exec()

      if (!payment) return (ctx.body = {ret: 1, msg: '订单不存在'})
    } catch (e) {
      ctx.throw(501, e)
    }

    if (String(payment.product) !== body.product._id ||
      String(payment.user) !== body.user._id) return (ctx.body = {ret:1, msg: '订单错误,请联系管理员'})

    payment.success = 1

    try {
      await payment.save()
      ctx.body = {ret: 0, msg: '支付成功'}
    } catch (e) {
      ctx.throw(501, e)
    }
  }

  @post('login')
  @required({ body: ['code', 'avatarUrl', 'nickName'] })
  @log
  async login (ctx, next) {
    const { code, avatarUrl, nickName } = ctx.request.body

    try {
      const { openid } = await openidAndSessionKey(code)
      var user = await User.findOne({ openid }).exec()

      if (!user) {
        user = new User({
          openid,
          avatarUrl,
          nickname: nickName
        })

        user = await user.save()
      } else {
        user.avatarUrl = avatarUrl
        user.nickName = nickName

        user = await user.save()
      }

      ctx.body = user
    } catch (e) {
      ctx.throw(501, e)
    }
  }
}
