const cloudinary = require('cloudinary')

import randomToken from 'random-token'
import qiniu from './qiniu'

const config = {
  'cloud_name': 'moveha',
  'api_key': '616622821755115',
  'api_secret': 'DO-YGEWn4qTVCdZHg1EmNi6cqKg'
}

const getImage = qiniu.getImage

cloudinary.config(config)

// const path = require('path')
// cloudinary.v2.uploader.upload(path.resolve(__dirname, '../../static/images/exam/exam-wizard.png'), {
//   public_id: 'exam-wizard',
//   use_filename: true,
//   unique_filename: false
// }, function (err, data) {
//   console.log(err)
//   console.log(data)
// })

const answer = [
  {
    profession: '骑士',
    imgUrl: [
      'exam-knight_1.png',
      'exam-knight_2.png',
      'exam-knight_3.png'
    ],
    intro: [
      '最后跟随龙母一起获得王座，由于体格健硕英俊潇洒，被选为龙母的情人，最后精尽而亡。',
      '不畏强敌，立下赫赫战功，却在一次伏击中由于剑被卡住，惨遭俘虏。',
      '与同伴闲逛时遇到异鬼，同伴惨遭杀害，你却因为出众的相貌逃过一劫。'
    ]
  },
  {
    profession: '刺客',
    imgUrl: [
      'exam-assassin_1.png',
      'exam-assassin_2.png',
      'exam-assassin_3.png'
    ],
    intro: [
      '在一次刺杀活动中被小指头抓住，送到了妓院从事非法工作，忙碌一生。',
      '以稳准狠闻名，但不幸爱上了刺杀目标小恶魔，你趁他熟睡时亲吻了他并快速离开，从此隐姓埋名。',
      '却因纵欲过度导致大脑愚钝，杀错了目标，全城通缉中。'
    ]
  },
  {
    profession: '阴谋家',
    imgUrl: [
      'exam-conspirator_1.png',
      'exam-conspirator_2.png',
      'exam-conspirator_3.png'
    ],
    intro: [
      '足智多谋，却因用脑过度，年纪轻轻就秃了顶，你坚持不戴假发，因为你的座右铭是做最真实的自己。',
      '游走于多个家族，把他们玩弄于股掌之间，却在一次外出打猎中不幸被野人发现，沦为俘虏，夜夜侍寝。',
      '因口齿不清屡遭同族的嘲笑，却在一次意外中发现自己是坦格利安的另一位王室遗孤，最终与龙母一同登上铁王座。'
    ]
  },
  {
    profession: '先知',
    imgUrl: [
      'exam-prophet_1.png',
      'exam-prophet_2.png',
      'exam-prophet_3.png'
    ],
    intro: [
      '预测了无数家族的未来，却没预测到龙母对你一见钟情，干柴烈火，坠入爱河。你依偎在龙母怀里，情不自禁的哼起了小幸运。',
      '在与异鬼作战的过程中，结识了来自东方的神秘组织，并被招募入伙，跟随组织回到长安，成为了当地有名的风水大师。',
      '一直致力于预测自己何时结束单身，孜孜不倦，直到白发苍苍。被龙母授予劳模称号。'
    ]
  },
  {
    profession: '女巫',
    imgUrl: [
      'exam-witch_1.png',
      'exam-witch_2.png',
      'exam-witch_3.png'
    ],
    intro: [
      '英勇善谋，倾慕龙母，历经万难技压无垢者、次子团，最后成为龙母最青睐的参谋，运用强大黑魔法助龙母登上铁王座。',
      '被三傻的仇恨所吸引，利用三傻的仇恨得到了强大的黑魔法，随后发现自己对三傻已无法自拔，从此一生追随三傻护她周全，却从没对三傻表白心意。',
      '在一次逃亡中被重伤的二丫所救，从此相依为命，共同成长，随无面者二丫浪迹天涯，以正义之名，扼杀一切邪恶。'
    ]
  },
  {
    profession: '法师',
    imgUrl: [
      'exam-wizard.png'
    ],
    intro: [
      '天资聪颖，法力超群，最终辅佐龙母上位，一生享尽荣华富贵。',
      '在一次上山打猎时遭遇异鬼部队。施法失败后不幸沦为异鬼一名，体会到了从未有过的快乐。',
      '由于长相俊美，遭遇其他法师的妒忌排挤，你难过的戴上了面具。十年后，变成了法力最高强的法师的你，摘掉面具留着激动的泪水仰天长啸：对！我就是明明可以靠脸吃饭却偏偏靠才华本人！'
    ]
  }
]

function getIndex (arr, i) {
  return i > 0 ? (arr[i] || getIndex(arr, i - 1)) : arr[0]
}

export function randomIntro (profession) {
  const i = Math.floor(Math.random() * 3)
  const target = answer.find(e => e.profession === profession)

  if (target) {
    return {
      intro: getIndex(target.intro, i),
      imgUrl: getIndex(target.imgUrl, i)
    }
  } else {
    throw new Error('should input the right profession!')
  }
}

export function buildImage (data) {
  const image = cloudinary.url('exam-card.png', {
    transformation: [
      {
        width: 701,
        height: 929,
        crop: 'fill'
      },
      {
        overlay: data.imgUrl + '',
        gravity: 'north',
        width: 516,
        height: 376,
        x: 10,
        y: 40
      },
      {
        width: 560,
        height: 40,
        crop: 'limit',
        x: 10,
        y: 430,
        color: '#ffffff',
        background: '#000000',
        overlay: 'text:Arial_30: ' + data.name + '.' + data.house + '.' + data.profession + ' ',
        gravity: 'north'
      },
      {
        width: 660,
        height: 80,
        x: 20,
        y: 480,
        crop: 'fit',
        color: '#000000',
        overlay: 'text:Arial_46_bold:你是' + data.house + '的' + data.profession,
        gravity: 'north'
      },
      {
        width: 600,
        height: 440,
        x: 10,
        y: 580,
        crop: 'fit',
        color: '#000000',
        overlay: 'text:Arial_28:' + data.intro,
        gravity: 'north'
      }
    ]
  })

  const key = `creation/${randomToken(32)}`
  
  getImage(image, key)

  return image
}

// http://res.cloudinary.com/moveha/image/upload/h_929,w_701/g_north,h_376,l_exam-conspirator_2_xchfvf.png,w_516,x_10,y_30/b_rgb:000000,c_limit,co_rgb:ffffff,g_north,h_40,l_text:Arial_30: 董.史塔克.骑士 ,w_560,x_10,y_400/c_fit,co_rgb:000000,g_north,h_80,l_text:Arial_46_bold:你是史塔克家族的骑士,w_660,x_20,y_460/c_fit,co_rgb:000000,g_north,h_440,l_text:Arial_26:足智多谋，却因用脑过度，年纪轻轻就秃了顶，你坚持不戴假发，因为你的座右铭是做最真实的自己。游走于多个家族，把他们玩弄于股掌之间，却在一次外出打猎中不幸被野人发现，沦为俘虏，夜夜侍寝。因口齿不清屡遭同族的嘲笑，却在一次意外中发现自己是坦格利安的另一位王室遗孤，最终与龙母一同登上铁王座。,w_600,x_10,y_560/exam-card_ioq88j.png
// console.log(buildImage({
//   profession: '骑士',
//   house: '徒利家族',
//   imgUrl: 'exam-knight_2.png',
//   name: '瓜瓜嘞',
//   intro: '在一次刺杀活动中被小指头抓住，送到了妓院从事非法工作，忙碌一生。'
// }))
