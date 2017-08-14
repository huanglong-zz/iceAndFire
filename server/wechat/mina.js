import crypto from 'crypto'
import rp from 'request-promise'
import conf from '../config'
// https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code

const options = {
  uri: 'https://api.weixin.qq.com/sns/jscode2session',
  qs: {
    appid: conf.mina.appid,
    secret: conf.mina.secret,
    grant_type: 'authorization_code'
  },
  json: true
}

export const openidAndSessionKey = async code => {
  let _options = options
  _options.qs.js_code = code

  let res = await rp(_options)

  return res
}

export class WXBizDataCrypt {
  constructor (sessionKey) {
    this.appId = conf.mina.appid
    this.sessionKey = sessionKey
  }

  decryptData (encryptedData, iv) {
    // base64 decode
    var sessionKey = Buffer.from(this.sessionKey, 'base64')
    encryptedData = Buffer.from(encryptedData, 'base64')
    iv = Buffer.from(iv, 'base64')

    try {
       // 解密
      var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
      // 设置自动 padding 为 true，删除填充补位
      decipher.setAutoPadding(true)
      var decoded = decipher.update(encryptedData, 'binary', 'utf8')
      decoded += decipher.final('utf8')
      
      decoded = JSON.parse(decoded)

    } catch (err) {
      throw new Error('Illegal Buffer')
    }

    if (decoded.watermark.appid !== this.appId) {
      throw new Error('Illegal Buffer')
    }

    return decoded
  }
}
