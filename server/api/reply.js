'use strict'

import * as creationAPI from './creation'
import * as userAPI from './user'
import * as mpAPI from './wechat'
import * as answer from './answer'
import * as wx from '../wechat'
import scan from '../libs/scan'
import config from '../config'

const wechatApi = wx.getWechat()

export default async function (ctx, next) {
  const message = ctx.weixin
  let results = []
  let homes
  let _homes

  if (message.MsgType === 'event') {
    if (['subscribe'].indexOf(message.Event) > -1) {
      await userAPI.saveWechatUserAsync(message)

      ctx.body = answer.welcome
    } else if (message.Event === 'LOCATION') {
      ctx.body = ''
    } else if (message.Event === 'VIEW') {
      ctx.body = '如果使用中遇到问题，可以在这里留言啊，我们尽快为您解答。'
    } else if (message.Event === 'SCAN') {
      await userAPI.saveWechatUserAsync(message)

      ctx.body = answer.welcome
    } else {
      if (answer[message.EventKey]) {
        ctx.body = answer[message.EventKey]
      } else {
        ctx.body = answer.welcome
      }
    }
  } else if (message.MsgType === 'text') {
    const result = scan(message.Content)

    if (message.Content.indexOf('推广1212') > -1) {
      var shareUser = await mpAPI.buildNoodlesAsync(message, 'tuiguang')
      var shareUrl = 'http://m.moveha.com/visit?code=' + shareUser.code + '&aim=movies'

      ctx.body = '<a href="' + shareUrl + '">推广 code: ' + shareUser.code + '</a>'
    } else {
      if (answer[result.k]) {
        ctx.body = answer[result.k]
      } else if (result.k === 'imooc') {
        var users = await userAPI.saveWechatUserAsync(message, 'imooc')

        let openId = message.FromUserName

        var wxUser = await wechatApi.getUser(openId, 'cn')

        console.log(wxUser)

        ctx.body = answer.imoocBuild(users.user, users.count)
      } else if (result.k === 'state') {
        var state = message.Content

        homes = await creationAPI.findByStateAsync(state)

        if (homes.length === 0) {
          homes = creationAPI.findByStateAsync('CA')
        }

        if (homes.length > 6) {
          _homes = homes.slice(0, 6)
        } else {
          _homes = homes || []
        }

        _homes.forEach(function(item) {
          results.push({
            title: item.homeTitle,
            description: '$' + item.monthlyRent + ' ' + item.description,
            picUrl: item.cover,
            url: config.SITE_ROOT_URL + '/homes/' + item.hid
          })
        })

        if (homes.length > 6) {
          results.push({
            title: '更多房源',
            description: homes[6].description,
            picUrl: homes[6].cover,
            url: config.SITE_ROOT_URL + '/homes?state=' + state
          })
        }

        ctx.body = results
      } else if (result.k === 'state') {
        ctx.body = {
          content: result.content,
          type: 'text'
        }
      } else if (result.k === 'video') {
        ctx.body = {
          type: 'video',
          content: {
            title: '心情不好，来段视频吧',
            description: '一分钟长姿势篇',
            mediaId: '207297386'
          }
        }
      } else if (result.k === 'kf') {
        ctx.body = {
          type: 'customerService',
          kfAccount: 'codingdream@MOVEHA'
        }
      } else {
        ctx.body = '已经收到您的留言，我们会尽快为您解答。'
      }
    }
  }
}
