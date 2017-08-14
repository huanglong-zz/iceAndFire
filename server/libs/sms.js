'use strict'

import https from 'https'
import querystring from 'querystring'
import speakeasy from 'speakeasy'

const key = 'a38cde3fleo3ace'


export function sendSms(areaCode, phoneNumber, msg) {
  return new Promise((resolve, reject) => {
    if (!areaCode || !phoneNumber) {
      return reject(new Error('the areaCode or phoneNumber is undefined'))
    }

    if (areaCode === '+86') {
      const postData = {
        mobile: phoneNumber,
        message: msg + ' 【Imooc】'
      }
      const content = querystring.stringify(postData)
      const options = {
        host: 'sms-api.luosimao.com',
        path: '/v1/send.json',
        method: 'POST',
        auth: 'api:key-166974b2c49052143fd160a04fd85998',
        agent: false,
        rejectUnauthorized: false,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': content.length
        }
      }
      let str = ''
      const req = https.request(options, function(res) {

        if (res.statusCode === 404) {
          reject(Error('短信服务器没有响应'))

          return
        }

        res.setEncoding('utf8')
        res.on('data', function(chunk) {
          str += chunk
        })
        res.on('end', function() {
          let data

          try {
            data = JSON.parse(str)
          }
          catch (e) {
            console.log(e)
          }

          if (data.error === 0) {
            resolve(data)
          }
          else {
            var errorMap = {
              '-10': '验证信息失败',
              '-20': '短信余额不足',
              '-30': '短信内容为空',
              '-31': '短信内容存在敏感词',
              '-32': '短信内容缺少签名信息  短信内容末尾增加签名信息eg.【公司名称】',
              '-40': '错误的手机号  检查手机号是否正确',
              '-41': '号码在黑名单中 号码因频繁发送或其他原因暂停发送，请联系客服确认',
              '-42': '验证码类短信发送频率过快  前台增加60秒获取限制',
              '-50': '请求发送IP不在白名单内  查看触发短信IP白名单的设置'
            }
            reject(Error(errorMap[data.error]))
          }
        })
      })

      req.write(content)
      req.end()
      req.on('error', function(err) {
        console.log(err)
      })
    }
  })
}

export function getCode(digits) {
  const code = speakeasy.totp({
    secret: 'imoocGoGoGo',
    digits: digits || 4
  })

  return code
}
