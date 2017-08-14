import Koa from 'koa'
import conf from './config'
import { resolve } from 'path'
import Nuxt from 'nuxt'
import nuxtConf from '../nuxt.config'
// 函数式风格，数据不变性和函数无副作用是它的核心设计理念，结合它的函数自动柯里化可以让多个函数的排
// 列和数据的变换传递变得更容易
import R from 'ramda'

const r = path => resolve(__dirname, path)
const MIDDLEWARE = ['database', 'general', 'router']
const app = new Koa()

const useMiddleware = (app) => {
  // 中间件的个数不定，通过 Ramda 的特性，从右往左进行函数组合，右侧函数的返回结果总是左侧函数的输入参数
  // R.map(console.log)([1, 2, 3])
  // MIDDLEWARE 数组交给了 R.map
  // 分别拿到的单个数组中的值，我们可以通过 R.compose 再次进行组合。
  return R.map(R.compose(
    R.map(i => i(app)),
    require,
    i => `${r('./middleware')}/${i}`)
  )
}

const start = async () => {
  let config = require('../nuxt.config.js')
  config.dev = !(app.env === 'production')
  const nuxt = await new Nuxt(config)

  if (conf.env !== 'production') {
    try {
      await nuxt.build()
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  }

  await useMiddleware(app)(MIDDLEWARE)

  app.use(async (ctx, next) => {
    ctx.status = 200
    ctx.req.session = ctx.session
    await nuxt.render(ctx.req, ctx.res)
  })

  app.listen(conf.port, conf.host)
  console.log('Server listening on ' + conf.host + ':' + conf.port) // eslint-disable-line no-console
}

start()
