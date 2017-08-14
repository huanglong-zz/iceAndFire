import config from '../config'

const tip = '我的卡丽熙/太阳，欢迎来到河间地\n' +
 '回复 1，获取最新的种子资源\n' +
 '回复 2，查看 北境 家族秘密\n' +
 '回复 3，其他 八大 家族秘密\n' +
 '慕课小提示：公众号后台在 PD 蹂躏下，【狂暴剧烈】迭代更新中，服务抽风请大家原谅\n' +
 '或者点击 <a href="' + config.SITE_ROOT_URL + '/exam">穿越冰火查身份</a>'

const bt = '权力的游戏 第七季 <a href="https://pan.baidu.com/s/1kUCX7QB">第一集</a>'

const cities = [
  {
    title: '北境',
    body: '北境是颈泽以北的地带，临冬城的史塔克家族作为北境之王和伊耿征服后的北境守护已统治了数千年之久。'
  },
  {
    title: '铁群岛',
    body: '铁群岛是位于大陆西海岸铁民湾中的一组群岛，它们分别是派克岛，大威克岛，老威克岛，哈尔洛岛，盐崖岛，黑潮岛和奥克蒙岛。'
  },
  {
    title: '河间地',
    body: '河间地是位于三叉戟河流域的肥沃地带。他们的统治者是奔流城的徒利家族。在远古的河流王灭绝后，河间地进入一个动荡的历史时期，其他的南方王国纷纷入侵，河间地多次易主。'
  },
  { title: '艾林谷',
    body: '谷地是一处几乎被明月山脉完全环绕的区域，他们的统治者是艾林家族，是最古老的安达尔人贵族之一，在伊耿征服之前是山岭和谷地之王。'
  },
  { title: '西境',
    body: '西境位于河间地以西和河湾以北，由凯岩城的兰尼斯特家族统治，他们是从前的岩地之王。'
  },
  { title: '河湾',
    body: '河湾是由高庭的提利尔家族所统治的肥沃土地。提利尔家族原本是园丁家族的总管，园丁家族是伊耿征服之前的河湾王。'
  },
  {
    title: '风暴之地',
    body: '风暴之地位于君临和多恩海之间，在东边则是被破船湾和多恩海与南方分隔开来。'
  },
  {
    title: '多恩',
    body: '多恩是维斯特洛最南部的土地，从多恩边境地的高山一直延伸到大陆的南海岸。这里是维斯特洛最炎热的国度，拥有大陆上仅有的沙漠。'
  },
  {
    title: '王领',
    body: '王领是铁王座之王的直属领地。这块区域包括君临以及周围地带的罗斯比城和暮谷城。'
  },
  {
    title: '龙石岛',
    body: '龙石岛是位于狭海中的岛屿要塞，同时管理着狭海中的一些其他岛屿如潮头岛和蟹岛，以及位于大陆上的尖角要塞。'
  }
]

const northHouses = [
  {
    url: 'https://iceandfire.iblack7.com/house?id=595e06a8a38a8946111329cb',
    title: '史塔克家族',
    description: 'House Stark of Winterfell',
    picUrl: 'https://fireice.iblack7.com/%E5%8F%B2%E5%A1%94%E5%85%8B%E5%AE%B6%E6%97%8F'
  }
]

const houses = [
  {
    url: 'https://iceandfire.iblack7.com/house?id=595e06a8a38a8946111329d5',
    title: '坦格利安家族',
    description: 'House Targaryen',
    picUrl: 'https://fireice.iblack7.com/%E5%9D%A6%E6%A0%BC%E5%88%A9%E5%AE%89%E5%AE%B6%E6%97%8F',
  },
  {
    url: 'https://iceandfire.iblack7.com/house?id=595e06a8a38a8946111329d7',
    title: '兰尼斯特家族',
    description: 'House Lannister of Casterly Rock',
    picUrl: 'https://fireice.iblack7.com/%E5%85%B0%E5%B0%BC%E6%96%AF%E7%89%B9%E5%AE%B6%E6%97%8F',
  },
  {
    url: 'https://iceandfire.iblack7.com/house?id=595e06a8a38a8946111329df',
    title: '艾林家族',
    description: 'House Arryn of the Eyrie',
    picUrl: 'https://fireice.iblack7.com/%E8%89%BE%E6%9E%97%E5%AE%B6%E6%97%8F',
  },
  {
    url: 'https://iceandfire.iblack7.com/house?id=595e06a8a38a8946111329e2',
    title: '徒利家族',
    description: 'House Tully of the Riverrun',
    picUrl: 'https://fireice.iblack7.com/%E5%BE%92%E5%88%A9%E5%AE%B6%E6%97%8F',
  },
  {
    url: 'https://iceandfire.iblack7.com/house?id=595e06a8a38a8946111329e7',
    title: '葛雷乔伊家族',
    description: 'House Greyjoy of Pyke',
    picUrl: 'https://fireice.iblack7.com/%E8%91%9B%E9%9B%B7%E4%B9%94%E4%BC%8A%E5%AE%B6%E6%97%8F',
  },
  {
    url: 'https://iceandfire.iblack7.com/house?id=595e06a8a38a8946111329ec',
    title: '风息堡的拜拉席恩家族',
    description: 'House Baratheon of Storm\'s End',
    picUrl: 'https://fireice.iblack7.com/%E9%A3%8E%E6%81%AF%E5%A0%A1%E7%9A%84%E6%8B%9C%E6%8B%89%E5%B8%AD%E6%81%A9%E5%AE%B6%E6%97%8F',
  },
  {
    url: 'https://iceandfire.iblack7.com/house?id=595e06a8a38a8946111329f5',
    title: '提利尔家族',
    description: 'House Tyrell of Highgarden',
    picUrl: 'https://fireice.iblack7.com/%E6%8F%90%E5%88%A9%E5%B0%94%E5%AE%B6%E6%97%8F',
  },
  {
    url: 'https://iceandfire.iblack7.com/house?id=595e06a8a38a8946111329f9',
    title: '马泰尔家族',
    description: 'House Nymeros Martell of Sunspear',
    picUrl: 'https://fireice.iblack7.com/%E9%A9%AC%E6%B3%B0%E5%B0%94%E5%AE%B6%E6%97%8F',
  }
]

export default async (ctx, next) => {
  const message = ctx.weixin
  let mp = require('../wechat')
  let client = mp.getWechat()

  if (message.MsgType === 'event') {
    if (message.Event === 'subscribe') {
      ctx.body = tip
    } else if (message.Event === 'unsubscribe') {
      console.log('取关了')
    } else if (message.Event === 'LOCATION') {
      ctx.body = message.Latitude + ' : ' + message.Longitude
    } else if (message.Event === 'view') {
      ctx.body = message.EventKey + message.MenuId
    } else if (message.Event === 'pic_sysphoto') {
      ctx.body = message.Count + ' photos sent'
    } else if (message.Event === 'CLICK') {
      if (message.EventKey === 'bt') {
        ctx.body = bt
      }
    } else {
      ctx.body = tip
    }
  } else if (message.MsgType === 'text') {
    if (message.Content === '更新按钮吧') {
      const menu = require('./menu').default
      let menuMsg = '创建成功'

      try {
        console.log(await client.handle('delMenu'))
      } catch (e) {
        console.log('删除菜单失败')
        console.log(e)

        menuMsg = '删除失败'
      }

      try {
        console.log(await client.handle('createMenu', menu))
      } catch (err) {
        console.log('创建菜单失败')
        console.log(err)
        menuMsg += menuMsg
      }

      ctx.body = menuMsg
    } else if (message.Content === 'bt' || message.Content === '1') {
      ctx.body = bt
    } else if (message.Content === '2') {
      ctx.body = northHouses
    } else if (message.Content === '3') {
      ctx.body = houses
    } else {
      ctx.body = tip
    }
  } else if (message.MsgType === 'image') {
    ctx.body = {
      type: 'image',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'voice') {
    ctx.body = {
      type: 'voice',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'video') {
    ctx.body = {
      type: 'video',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'location') {
    ctx.body = message.Location_X + ' : ' + message.Location_Y + ' : ' + message.Label
  } else {
    ctx.body = tip
  }
}
