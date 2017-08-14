import mongoose from 'mongoose'
import moment from 'moment'
import sms from '../libs/sms'
import * as wx from '../wechat'

const User = mongoose.model('User')
const wechatApi = wx.getWechat()

export async function fetchUserById (id) {
  const user = await User.findOne({_id: id}).exec()

  return user
}

export async function findDetailByOpenIdAsync (wxUser, from) {
  var openid = wxUser.openid
  // var avatar
  var userExisted = false
  var gender = ''
  var count

  if (wxUser.sex === 1) {
    gender = 'male'
  } else if (wxUser.sex === 2) {
    gender = 'female'
  }

  // too slow, should move out
  // avatar = await cloudinary.uploadAvatarAsync(wxUser.headimgurl)
  var user = await User.findOne({'wechat.openid': openid}).exec()

  if (!user || !user._id || !user.wechat || user.wechat.openid !== openid) {
    var nickname = wxUser.nickname || wxUser.openid
    var userData = {
      role: 0,
      username: nickname + '_' + Date.now(),
      gender: gender,
      email: nickname + '_' + Date.now() + '@example.com',
      avatar: wxUser.headimgurl,
      wechat: {
        subscribe: 1,
        openid: wxUser.openid,
        nickname: nickname,
        sex: 1,
        language: wxUser.language,
        city: wxUser.city,
        province: wxUser.province,
        country: wxUser.country,
        subscribe_time: moment(wxUser.subscribe_time).format()
      }
    }

    if (from === 'imooc') {
      userData.wechat.from = 'imooc'
    }

    user = new User(userData)
  } else {
    userExisted = true
    user.gender = gender
    user.avatar = wxUser.headimgurl
    user.wechat = {
      subscribe: 1,
      openid: wxUser.openid,
      nickname: wxUser.nickname,
      sex: 1,
      language: wxUser.language,
      city: wxUser.city,
      province: wxUser.province,
      country: wxUser.country,
      subscribe_time: moment(wxUser.subscribe_time).format()
    }
  }

  try {
    await user.save()
  } catch (e) {
    sms(e, 'Save User Error')
  }

  return {
    user: user,
    count: count,
    userExisted: userExisted
  }
}

export async function saveWechatUserAsync (message, from) {
  var sceneId = message.EventKey
  var ticket = message.ticket
  var openid = message.FromUserName
  var userExisted = false
  var gender = ''
  var count

  from = from || ''

  if (sceneId && sceneId.indexOf('qrscene_') > -1) {
    sceneId = sceneId.replace('qrscene_', '')
  }

  if (sceneId === 'imooc') {
    from = 'imooc'
  }

  // too slow, should move out
  // avatar = await cloudinary.uploadAvatarAsync(wxUser.headimgurl)
  var user = await User.findOne({'wechat.openid': openid}).exec()
  var wxUser = await wechatApi.getUser(openid)

  if (wxUser.sex === 1) {
    gender = 'male'
  } else if (wxUser.sex === 2) {
    gender = 'female'
  }

  if (!user || !user._id || !user.wechat) {
    var nickname = wxUser.nickname || wxUser.openid
    var userData = {
      role: 0,
      username: nickname + '_' + Date.now(),
      gender: gender,
      email: nickname + '_' + Date.now() + '@example.com',
      avatar: wxUser.headimgurl,
      wechat: {
        from: from,
        subscribe: 1,
        openid: wxUser.openid,
        nickname: nickname,
        sex: 1,
        language: wxUser.language,
        city: wxUser.city,
        province: wxUser.province,
        country: wxUser.country,
        subscribe_time: moment(wxUser.subscribe_time).format()
      }
    }
    // 扫描关注
    if (sceneId) {
      userData.wechat.sceneId = sceneId
      userData.wechat.ticket = ticket
    }

    user = new User(userData)
  } else {
    userExisted = true
    user.gender = gender
    user.avatar = wxUser.headimgurl
    user.wechat = {
      from: from,
      subscribe: 1,
      openid: wxUser.openid,
      nickname: wxUser.nickname,
      sex: 1,
      language: wxUser.language,
      city: wxUser.city,
      province: wxUser.province,
      country: wxUser.country,
      subscribe_time: moment(wxUser.subscribe_time).format()
    }

    // 扫描关注
    if (sceneId) {
      user.wechat.sceneId = sceneId
      user.wechat.ticket = ticket
    }

    user.markModified('wechat')
  }

  // https://github.com/Automattic/mongoose/issues/1694

  if (from === 'imooc') {
    var groupsData

    // 获取分组
    try {
      groupsData = await wechatApi.getGroups()
    } catch (e) {
      console.log('获取分组信息失败')
    }

    // {groups: [
    //   { id: 0, name: '未分组', count: 970 },
    //   { id: 1, name: '黑名单', count: 0 },
    //   { id: 2, name: '星标组', count: 0 },
    //   { id: 102, name: 'testimooc', count: 0}
    // ]}
    groupsData = groupsData || {}

    var groups = groupsData.groups || []
    var _group = groups.filter(function(group) {
      return group.name === 'testimooc'
    })
    var groupid

    count = await User.count({'wechat.from': 'imooc'}).exec()
    if (_group && _group.length > 0) {
      groupid = parseInt(_group[0].id, 10)
      count = count || _group[0].count || 0
    } else {
      // 创建分组
      try {
        var results = await wechatApi.createGroup('testimooc')

        groupid = parseInt(results.group.id, 10)
      } catch (err) {
        console.log('创建分组失败')
        console.log(err)
      }
    }

    if (groupid) {
      // 移动到分组
      try {
        var msg = await wechatApi.moveGroup(openid, groupid)
        if (msg) {
          console.log(msg.errcode)
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  count = count || 0

  try {
    await user.save()
  } catch (e) {
    sms(e, 'Save User Error')
  }

  return {
    user: user,
    count: count,
    userExisted: userExisted
  }
}
