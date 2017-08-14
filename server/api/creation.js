import mongoose from 'mongoose'
import * as robot from '../libs/robot'
import config from '../config'

const Creation = mongoose.model('Creation')

// https://segmentfault.com/a/1190000007902785
export async function uploadAvatarToCloudinary(serverId) {
  let url = config.defaultAvatar

  if (serverId) {
    url = 'http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=&media_id=' + serverId
  }

  const result = await robot.uploadToCloudinary(url)

  return result
}

export async function combineAvatarOnCloudinary (opts) {
  let creation = await Creation.findOne({_id: opts._id}).exec()

  robot
    .saveToQiniu(opts.url, opts.filename)
    .catch(err => {
      console.log(err)
    })
    .then(response => {
      creation.result = response
      creation.save()
    })
}
