const scanners = {
  words: function (content) {
    const map = {
      'diaosi': 'hehe',
      'tiffany': '竟敢调戏我老板！__要不要私聊啊！',
      'seayoutomorrow': '88 了个 88'
    }

    return map[content]
  },
  video: function (content) {
    return content === 'video'
  },
  imooc: function (content) {
    const targets = [
      '慕课网',
      'imooc',
      '慕渴望',
      'mukewang',
      '木课网',
      '幕客网',
      '木渴望'
    ]
    return targets.indexOf(content) > -1
  },

  kf: function (content) {
    return content === 'kf'
  },

  insurance: function (content) {
    return content === 'insurance' || parseInt(content, 10) === 7
  },

  roomie: function (content) {
    return content === 'roomie' || parseInt(content, 10) === 8
  },

  order: function (content) {
    return content === 'order'
  },

  1111: function (content) {
    return content === '1111'
  }
}

export function scan (content) {
  for (let k in scanners) {
    if (scanners[k](content)) {
      return {k: k, content: scanners[k](content)}
    }
  }

  return false
}
