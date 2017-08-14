import fs from 'fs'
import path from 'path'
import wechatPay from 'wechat-pay'
// import sms from '../libs/sms'
import config from '../config'

const Payment = wechatPay.Payment
const appId = config.shop.appID
const partnerKey = config.shop.key
const mchId = config.shop.mchId
const cert = path.resolve(__dirname, '../', 'config/cert/apiclient_cert.p12')

var initConfig = {
  appId: appId,
  partnerKey: partnerKey,
  mchId: mchId,
  notifyUrl: config.shop.notifyUrl,
  pfx: fs.readFileSync(cert)
}

var payment = new Payment(initConfig || {})

exports.getParamsAsync = function(order) {
  return new Promise((resolve, reject) => {
    payment.getBrandWCPayRequestParams(order, function(err, payargs) {
      if (err) {
        console.log(err)
        // sms.send(order, 'payment getbrandrequest')
        return reject(err)
      }

      resolve(payargs)
    })
  })
}

exports.getPayDataAsync = function(req) {
  return new Promise((resolve, reject) => {
    var data = ''

    req.setEncoding('utf8')
    req.on('data', function(chunk) {
      data += chunk
    })
    req.on('end', function() {
      req.rawBody = data
      resolve(data)
    })
  })
}

exports.getNoticeAsync = function(rawBody) {
  return new Promise((resolve, reject) => {
    payment.validate(rawBody, function(err, message) {
      if (err) {
        err.name = 'BadMessage' + err.name
        sms.send(err, 'payment validate rawbody')
        
        return reject(err)
      } else if (message) {
        resolve(message)
      }
    })
  })
}

exports.getBillsAsync = function(date) {
  return new Promise((resolve, reject) => {
    payment.downloadBill({
      bill_date: date,
      bill_type: 'ALL'
    }, function(err, data) {
      if (err) {
        reject(err)
      } else {
        resolve({
          data: data
        })
      }
    })
  })
}

exports.getOrdersAsync = function(params) {
  return new Promise((resolve, reject) => {
    payment.orderQuery(params, function(err, data) {
      if (err) {
        reject(err)
      } else {
        resolve({
          data: data
        })
      }
    })
  })
}

exports.buildFailXML = function(err) {
  return payment.buildXml({
    return_code: 'FAIL',
    return_msg: err.name
  })
}

exports.buildSuccessXML = function(err) {
  if (err) throw new Error('XML is not valid')
  return payment.buildXml({
    return_code: 'SUCCESS'
  })
}
