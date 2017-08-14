import mongoose from 'mongoose'
import * as userAPI from '../api/user'
import config from '../../config/config'
import * as wechatPay from '../lib/wechat-pay'
import * as sms from '../../config/sms'
import * as wx from '../wechat'
import getClintIp from 'ipware'

const getIp = getClintIp().getIp
const Payment = mongoose.model('Payment')
const oauth = wx.getOAuth()

export async function create (ctx, next) {
  const body = ctx.request.body
  let payment = new Payment({
    totalFee: 199,
    passport: body.product_id
  })

  payment = await payment.save()

  const redirect = config.SITE_ROOT_URL + '/wx/product?showwxpaytitle=1'
  const state = String(payment._id)
  const scope = 'snsapi_userinfo'
  const url = oauth.getAuthorizeURL(scope, redirect, state)

  ctx.body = {
    success: 1,
    url: url
  }
}

export async function willpay (ctx, next) {
  const _id = ctx.query.state
  const code = ctx.query.code
  const data = await oauth.requestAccessToken(code)
  const accessToken = data.access_token
  const openId = data.openid
  const wxUser = await oauth.getUser(accessToken, openId, 'cn')
  const userData = await userAPI.findDetailByOpenIdAsync(wxUser)

  let user = userData.user
  let payment = await Payment.findOne({_id: _id}).exec()

  if (user && user._id) {
    payment.user = user._id
  }
  if (wxUser.nickname === '彭泽智') {
    payment.totalFee = 0.1
  }

  try {
    await payment.save()
  } catch (e) {
    sms.send(e, 'Save insurance Error')
  }

  ctx.body = {
    page: 'static',
    user: user,
    showwxpaytitle: true,
    payment: payment,
    openid: openId
  }
}

/**

let ready

if (document.addEventListener) {
  document.addEventListener('WeixinJSBridgeReady', () => {
    ready = true
  }, false)
} else if (document.attachEvent) {
  document.attachEvent('WeixinJSBridgeReady', () => {
    ready = true
  })
  document.attachEvent('onWeixinJSBridgeReady', () => {
    ready = true
  })
}

$('#pay-btn').on('click', e => {
  e.preventDefault()

  if (ready) {
    $('.pay-loading').removeClass('hidden')
    $('#pay-btn').attr('disabled', true)

    // if (WeixinJSBridge) {
    const formData = $.serialize($('#form')[0])
    const options = {
      url: '/wx/premium',
      data: formData,
      dataType: 'json',
      method: 'post'
    }
    // 这里的 url 在 vue 下是 hash，可能有坑，最好先查查 vue wechat pay
    $.request(options, data => {
      $('.pay-loading').addClass('hidden')

      if (!data || !data.args) {
        window.alert('获取订单失败，请稍后重试或者联系公众号后台客服！')
      }

      const WeixinJSBridge = window.WeixinJSBridge

      if (!WeixinJSBridge || !WeixinJSBridge.invoke) {
        window.alert('您的手机暂时不支持微信支付')
      }

      if (data.success === 1) {
        WeixinJSBridge.invoke('getBrandWCPayRequest', data.args, res => {
          if (res.err_msg === 'get_brand_wcpay_request:ok'){
            window.location.assign('/plus/done?t=premium&id=' + data.id)
            // 这里可以跳转到订单完成页面
          } else {
            window.alert('支付失败，请稍后重试')
          }
        })
      } else {
        window.alert('获取微信支付窗口出错，请稍后再试！')
      }
    })
  }
  else {
    window.alert('请耐心等待页面加载完毕')
  }
})

**/
export async function pay (ctx, next) {
  const ipInfo = getIp(ctx.request.req)
  const body = this.request.body
  const _id = body._id
  const userData = body.user
  let ip = ipInfo.clientIp
  let payment

  ip = ip.replace('::ffff:', '')

  try {
    payment = await Payment.findOne({_id: _id}).exec()
  } catch (e) {
    console.log('Do not find payment')
  }

  payment.payType = 'wechat'

  const amount = parseFloat(payment.totalFee) + 0.1 - 0.1

  payment = {
    body: '手办 , Total: ￥' + amount,
    attach: '{"type": "payment", "id": ' + payment.paymentid + '}',
    out_trade_no: 'payment_' + payment.insuranceid + '_' + Date.now(),
    total_fee: amount * 100,
    spbill_create_ip: ip,
    openid: userData.openid,
    trade_type: 'JSAPI'
  }

  payment.transactions = payment

  try {
    await payment.save()
  } catch (e) {
    console.log('Save payment Error')
  }

  let wxParams

  try {
    wxParams = await wechatPay.getParamsAsync(payment)
  } catch (e) {
    console.log(e)
  }

  ctx.body = {
    success: 1,
    id: String(payment._id),
    args: wxParams
  }
}
