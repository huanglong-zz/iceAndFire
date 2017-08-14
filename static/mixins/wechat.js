export default {
  methods: {
    async wechatConfig (shareOpts, url) {
      const res = await this.$store.dispatch('getWechatSignature', url)
      const { params, success } = res.data

      if (!success) throw new Error('fail to get wechat signature!')

      const wx = window.wx
      wx.config({
        debug: false, // 调试模式
        appId: params.appId, // 公众号的唯一标识
        timestamp: params.timestamp, // 生成签名的时间戳
        nonceStr: params.noncestr, // 生成签名的随机串
        signature: params.signature, // 签名
        jsApiList: [ 'previewImage', 'hideAllNonBaseMenuItem', 'showMenuItems', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'chooseWXPay' ]// 需要使用的JS接口列表: 预览图片接口，隐藏所有非基础按钮接口，批量显示功能按钮接口， 朋友圈分享， 发送给朋友, 微信支付
      })
      wx.ready(() => {
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        this.wechatSetMenu()
        this.wechatShare(shareOpts) // mixin混合对象中的微信分享方法
      })
    },
    wechatSetMenu () {
      const wx = window.wx

      wx.hideAllNonBaseMenuItem()// 隐藏所有非基础按钮
      wx.showMenuItems({
        // 要显示的菜单项
        menuList: [ 'menuItem:favorite', 'menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:profile' ]
      })
    },
    wechatShare ({ title, link, desc, imgUrl, type, dataUrl, success, cancel }) {
      const wx = window.wx
      wx.onMenuShareTimeline({
        title: title, // 分享标题
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imgUrl, // 分享图标
        success: success || (() => {}), // 用户确认分享后执行的回调函数,
        cancel: cancel || (() => {}) // 用户取消分享后执行的回调函数
      })
      wx.onMenuShareAppMessage({
        title: title, // 分享标题
        desc: desc || '', // 分享描述
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imgUrl, // 分享图标
        type: type || 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: dataUrl || '', // 如果type是music或video，则要提供数据链接，默认为空
        success: success || (() => {}), // 用户确认分享后执行的回调函数,
        cancel: cancel || (() => {}) // 用户取消分享后执行的回调函数
      })
    }
  }
}
