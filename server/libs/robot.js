import qiniu from 'qiniu'
import cloudinary from 'cloudinary'
import sha1 from 'sha1'
import uuid from 'uuid'
import config from '../config'

qiniu.conf.ACCESS_KEY = config.qiniu.AK
qiniu.conf.SECRET_KEY = config.qiniu.SK

cloudinary.config(config.cloudinary)

// 生成卡片用

// http://cloudinary.com/documentation/upload_images
// 0. 默认使用 userinfo 中的 headimg 头像
// 1. 前端 wx.uploadImage 上传本地头像，拿到 serverId
// 2. serverId 传给后台，后台调用 uploadToCloudinary，存到图床
// 3. 前端传给后台测试因子，后台生成特定标语，调用 cloudinary 进行图片合成
// 4. 图片合成后，后台 uploadToQiniu 获取合成图片
// 5. 前端向后台获取最新的图片地址（cloudinary 占位），展示在测试页面

export function getQiniuToken(body) {
  const type = body.type
  let key = uuid.v4()
  let putPolicy
  let options = {
    persistentNotifyUrl: config.notify
  }

  if (type === 'avatar') {
    // putPolicy.callbackUrl = 'http://your.domain.com/callback'
    // putPolicy.callbackBody = 'filename=$(fname)&filesize=$(fsize)'
    key += '.jpeg'
    putPolicy = new qiniu.rs.PutPolicy('iceavatar:' + key)
  } else if (type === 'role') {
    // putPolicy.callbackUrl = 'http://your.domain.com/callback'
    // putPolicy.callbackBody = 'filename=$(fname)&filesize=$(fsize)'
    key += '.jpeg'
    putPolicy = new qiniu.rs.PutPolicy('icerole:' + key)
  } else if (type === 'image') {
    // putPolicy.callbackUrl = 'http://your.domain.com/callback'
    // putPolicy.callbackBody = 'filename=$(fname)&filesize=$(fsize)'
    key += '.jpeg'
    putPolicy = new qiniu.rs.PutPolicy('icerole:' + key)
  }
  else if (type === 'video') {
    key += '.mp4'
    options.scope = 'icevideo:' + key
    options.persistentOps = 'avthumb/mp4/an/1'
    putPolicy = new qiniu.rs.PutPolicy2(options)
  }

  var token = putPolicy.token()

  return {
    key: key,
    token: token
  }
}

export function uploadToQiniu(url, key) {
  var client = new qiniu.rs.Client()

  return new Promise((resolve, reject) => {
    client.fetch(url, 'iceresult', key, function(err, ret) {
      if (!err) {
        resolve(ret)
      } else {
        reject(err)
      }
    })
  })
}

export function uploadToCloudinary(url) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(url, function(result) {
      if (result && result.public_id) {
        resolve(result)
      } else {
        reject(result)
      }
    }, {
      resource_type: 'image',
      folder: 'ice'
    })
  })
}

// http://cloudinary.com/documentation/image_transformations#using_custom_fonts_for_text_overlays
// http://res.cloudinary.com/demo/image/upload/w_500/y_30,a_2,g_east,l_text:impact_18_bold:%E8%80%81%E5%8D%A2.%E8%89%BE%E8%8E%89%E4%BA%9A.%E5%8F%B2%E5%A1%94%E5%85%8B/w_480,y_230,a_2,h_150,g_north,c_fit,l_text:Arial_20:%E4%BD%A0%E6%98%AF%E7%86%8A%E5%AE%B6%E6%97%8F%E7%9A%84%E9%AA%91%E5%A3%AB%EF%BC%8C%E6%9C%80%E5%90%8E%E8%B7%9F%E9%9A%8F%E9%BE%99%E6%AF%8D%E4%B8%80%E8%B5%B7%E8%8E%B7%E5%BE%97%E7%8E%8B%E5%BA%A7%EF%BC%8C%E7%94%B1%E4%BA%8E%E4%BD%93%E6%A0%BC%E5%81%A5%E7%A1%95%E8%8B%B1%E4%BF%8A%E6%BD%87%E6%B4%92%EF%BC%8C%E8%A2%AB%E9%80%89%E4%B8%BA%E9%BE%99%E6%AF%8D%E7%9A%84%E6%83%85%E4%BA%BA%EF%BC%8C%E6%9C%80%E5%90%8E%E7%B2%BE%E5%B0%BD%E8%80%8C%E4%BA%A1%E3%80%82/flowers.jpg
export function updateToCloudinary(public_id, opts) {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.explicit(public_id, opts, (err, result) => {
      if (result && result.public_id) {
        resolve(result)
      } else {
        reject(result)
      }
    })
  })
}

