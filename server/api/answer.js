export default {
  roomie: '无论结局如何，都要点击转发！<a href="http://res.cloudinary.com/moveha/image/upload/assets/banners/moveha_%E6%89%BE%E5%AE%A4%E5%8F%8B%E6%AD%A3%E5%BC%8F%E4%B8%8A%E7%BA%BF%E5%95%A6_%E5%88%86%E4%BA%AB%E5%9B%BE%E7%89%87_iPhone6s_%E7%AD%89%E4%BD%A0%E6%9D%A5%E6%8B%BF">我的冰火人生</a>',
  bt: '<a href="http://m.moveha.com/1111">冰火最新种子，快速得到</a>',
  welcome: '' +
    '总算等到你，这里是冰火盒饭 - 权游家族图谱平台\n\n' +
    '回复数字，获得快速通道：\r\n' +
    '【1】 <a href="http://m.moveha.com/premium">冰火商城</a>\n' +
    '【2】 <a href="https://www.studentuniverse.com/travel/moveha_cn">冰火家族</a>\n' +
    '【3】 <a href="http://m.moveha.com/matting">订单信息</a>\n' +
    '【4】 <a href="http://m.moveha.com/pickup">冰火小程序</a>\n' +
    '【5】 <a href="http://m.moveha.com/sim">测测我的冰火路</a> \n\n' +
    '回复家族简称，马上查看简史： \r\n' +
    '如：狼家 或者 狮家',
  imoocBuild (user, count) {
    let name = user.wechat.nickname

    if (user.gender === 'male') {
      name = '我的卓耿 - ' + name
    } else if (user.gender === 'female') {
      name = '我的卡丽熙 - ' + name
    }

    let guess = '我猜不出你来自哪里,'

    if (user.wechat.province || user.wechat.city) {
      guess = '我猜你来自' + user.wechat.province + '省,' +
      user.wechat.city + '市,'
    }

    let end = guess + '，关注了公众号，我就可以拿到你的资料，跟着 Scott 学习微信开发全教程系列，你也能够迅速做出一个属于自己的微信应用，加油！<a href="http://m.moveha.com/imooc/promise">敢不敢做个测试分享出去</a>  '

    let words = '哎呦喂！你是来自慕课网的' + name + ', 你有' + count + '个来自慕课网的小伙们开始研究学习这个账号了，请温柔一点，' + end

    // words = 'moveha 找室友功能正式上线啦！分享图片，“脑残粉” iPhone6s 等你来拿！http://res.cloudinary.com/moveha/image/upload/assets/banners/moveha_roomies.jpg'

    return words
  },
  ghost: [
    {
      title: '嘿嘿嘿，腐尸不僵',
      description: '千万大军，给你盒饭',
      picUrl: 'http://res.cloudinary.com/moveha/image/upload/v1435237157/assets/images/insurance.png',
      url: 'http://m.moveha.com/insurance'
    }
  ],
  winter: [
    {
      title: '嘿嘿嘿，寒冬将至',
      description: '北境巨寒，给你捂脚',
      picUrl: 'http://res.cloudinary.com/moveha/image/upload/v1434442038/assets/images/TEAM.jpg',
      url: 'http://m.moveha.com/utilities'
    }
  ],

  order: '暂时还未同步到您的订单信息，请耐心等一等'
}
