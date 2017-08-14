var mongoose = require('mongoose')
var Schema = mongoose.Schema
var SnsToken

// https://wohugb.gitbooks.io/wechat/content/qrconnent/refresh_token.html
var SnsTokenSchema = new mongoose.Schema({
  name: String,
  access_token: String,
  refresh_token: String,
  expires_in: Number,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

SnsTokenSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }

  next()
})

SnsTokenSchema.statics = {
  async getAccessSnsToken () {
    return await this.findOne({ name: 'access_token' }).exec()
  },
  async saveAccessSnsToken (data) {
    let snsToken = await this.findOne({ name: 'access_token' }).exec()
    if (snsToken) {
      snsToken.access_token = data.access_token
      snsToken.expires_in = data.expires_in
    } else {
      snsToken = new SnsToken({
        name: 'access_token',
        expires_in: data.expires_in,
        access_token: data.access_token
      })
    }

    await snsToken.save()

    return data
  }
}

mongoose.model('SnsToken', SnsTokenSchema)
