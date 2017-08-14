import { controller, get, post, put, log, convert, required } from '../decorator/router'
import mongoose from 'mongoose'
import qiniu from '../libs/qiniu'
import { randomIntro, buildImage } from '../libs/exam'
import { getParamsAsync } from '../wechat-lib/pay'
import xss from 'xss'
import R from 'ramda'

const User = mongoose.model('User')
const Product = mongoose.model('Product')
const Payment = mongoose.model('Payment')
const ExamResult = mongoose.model('ExamResult')

@controller('/api')
export class DatabaseController {
  @get('products/:_id')
  @log
  async getProduct (ctx, next) {
    const { _id } = ctx.params
    console.log(_id)
    if (!_id) return (ctx.body = '_id is required')

    let product = await Product
      .findById(_id)
      .exec()

    ctx.body = product
  }

  @get('products')
  async getProducts (ctx, next) {
    let { limit = 50 } = ctx.query
    let products = await Product
      .find({})
      .limit(Number(limit))
      .exec()

    ctx.body = products
  }

  @post('products')
  async postProducts (ctx, next) {
    let product = ctx.request.body
    product = {
      title: xss(product.title),
      price: xss(product.price),
      intro: xss(product.intro),
      parameters: R.map(item => ({ key: xss(item.key), value: xss(item.value) }))(product.parameters),
      images: R.map(xss)(product.images)
    }

    product = new Product(product)

    try {
      await product.save()

      ctx.body = product
    } catch (e) {
      ctx.throw(501, e)
    }
  }

  @put('products')
  async putProducts (ctx, next) {
    let body = ctx.request.body
    const { _id } = body

    let product = await Product.findById(_id).exec()

    if (!product) {
      return (ctx.body = 'product not exist')
    }

    product.title = xss(body.title)
    product.price = xss(body.price)
    product.intro = xss(body.intro)
    product.parameters = R.map(item => ({ key: xss(item.key), value: xss(item.value) }))(body.parameters)
    product.images = R.map(xss)(body.images)

    try {
      await product.save()

      ctx.body = product
    } catch (e) {
      ctx.throw(501, e)
    }
  }

  @get('qiniu/token')
  async qiniuToken (ctx, next) {
    let key = ctx.query.key
    let token = qiniu.uptoken(key)

    ctx.body = {
      key: key,
      token: token
    }
  }

  @get('users')
  async dbUsers (ctx, next) {
    const res = await User.find({}).exec()

    ctx.body = res
  }

  @get('users/:id')
  async dbUser (ctx, next) {
    const id = ctx.params.id
    const res = await User.findOne({_id: id}).exec()

    ctx.body = res
  }

  @get('payments')
  async getPayments (ctx, next) {
    const res = await Payment
      .find({ success: 1 })
      .populate('product user')
      .exec()

    ctx.body = res
  }

  @post('createOrder')
  @log
  @required({ body: ['productId', 'name', 'address', 'phoneNumber'] })
  async createOrder (ctx, next) {
    const ip = ctx.ip.replace('::ffff:', '')
    const session = ctx.session
    const { productId, name, address, phoneNumber } = ctx.request.body
    const product = await Product.findOne({
      _id: productId
    }).exec()

    if (!product) return (ctx.body = { ret: 1, msg: '这个宝贝不存在' })

    try {
      let user = await User.findOne({unionid: session.unionid}).exec()

      if (!user) {
        user = new User({
          avatarUrl: session.avatarUrl,
          nickname: session.nickname,
          unionid: session.unionid,
          openid: [ session.openid ],
          gender: session.gender,
          country: session.country,
          province: session.province,
          city: session.city
        })
        await user.save()
      }

      var _order = {
        body: product.title,
        attach: '公众号周边支付',
        out_trade_no: 'Product' + (+new Date),
        total_fee: 0.1 * 100,
        spbill_create_ip: ip,
        openid: session.openid,
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
        payType: '公众号',
        order: order,
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

  @post('login')
  @log
  @required({body: ['email', 'password']})
  async login (ctx, next) {
    const { email, password } = ctx.request.body
    let user
    let match = null

    try {
      user = await User.findOne({ email: email }).exec()

      if (user) {
        match = await user.comparePassword(password, user.password)
      }
    } catch (e) {
      throw new Error(e)
    }

    if (match) {
      ctx.session.user = {
        _id: user._id,
        role: user.role,
        email: user.email,
        nickname: user.nickname,
        avatarUrl: user.avatarUrl
      }

      return (ctx.body = {
        ret: 0,
        user: {
          email: user.email,
          nickname: user.nickname,
          avatarUrl: user.avatarUrl
        },
        msg: 'ok'
      })
    }

    return (ctx.body = {
      ret: 1,
      errors: {
        err: 'USER.WRONG_PASSWORD'
      }
    })
  }

  @post('logout')
  async logout (ctx, next) {

  }

  @post('exam')
  @required({ body: ['name', 'profession', 'house'] })
  async finishExam (ctx, next) {
    const { openid } = ctx.session
    const { profession, house, name } = ctx.request.body

    if (!openid) ctx.throw(501, 'your openid is illegal!')

    let people = await ExamResult.findOne({ openid: openid }).exec()

    let resIntro = null
    let resImg = null

    if (people) {
      let elem = people.result.find(e => e.profession === profession)

      if (elem) {
        if (!elem.intro || !elem.imgUrl) {
          // 数据库存在异常数据，重新随机计算
          const { intro, imgUrl } = randomIntro(profession)
          elem.intro = resIntro = intro
          elem.imgUrl = resImg = imgUrl
        } else {
          // 数据库存在正确数据，直接获取
          resIntro = elem.intro
          resImg = elem.imgUrl
        }
      } else {
        // 存在该用户，却不存在相同职业的数据，则根据职业随机生成结果
        const { intro, imgUrl } = randomIntro(profession)
        resIntro = intro
        resImg = imgUrl

        let copyP = people.result.slice()
        copyP.push({
          profession: xss(profession),
          imgUrl: resImg,
          intro: resIntro
        })
        people.result = copyP
      }
    } else {
      // 用户首次测试，根据职业随机生成测试结果
      const { intro, imgUrl } = randomIntro(profession)
      resIntro = intro
      resImg = imgUrl

      people = {
        openid: openid,
        result: [
          { profession: xss(profession), imgUrl: resImg, intro: resIntro }
        ]
      }
      people = new ExamResult(people)
    }

    try {
      await people.save()

      let resultData = {
        profession: profession,
        house: house,
        imgUrl: resImg,
        name: name,
        intro: resIntro
      }
      // 构建 cloudinary 图片路径
      const image = buildImage(resultData)

      resultData.image = image

      ctx.body = {
        success: true,
        data: resultData
      }
    } catch (e) {
      ctx.throw(501, e)
    }
  }
}
