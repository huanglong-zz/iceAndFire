<template lang="pug">
.container
  .focus-goods-body
    .focus-goods-swiper(v-swiper='swiperConfig')
      .swiper-wrapper
        .swiper-slide(v-for='(item, index) in product.images')
          img(:src="imageCDN + item" @click='clickBanner(index)')
          
      .swiper-pagination.swiper-pagination-bullets
    
    .focus-goods-content
      
      .focus-goods-price(v-if='product.price')
        span.focus-goods-price_main {{ product.price.toFixed(2) - product.price.toFixed(2).substr(-3) }}
        span.focus-goods-price_others {{ product.price.toFixed(2).substr(-3) }}
      
      .focus-goods-name {{ product.title }}

      .focus-goods-intro {{ product.intro }}

      .focus-goods-info
        cell(v-for='(item, index) in product.parameters' :key='index' :title='item.key' :content='item.value')

      .focus-goods-attentions
        .title 购买提示
        ol
          li(v-for='item in attentions') {{ item }}

  .focus-goods-footer
    span(@click='showInfo = true') 购买
  transition(name='slide-top')
    .focus-goods-pay(v-if='showInfo')
      .focus-goods-pay_header
        span 购买周边
        span(@click='showInfo = false') 取消
      .focus-goods-pay_body
        .focus-goods-pay_item
          img(:src='imageCDN + product.images[0]')
          div
            p {{ product.title }}
            p 价格 ¥{{ product.price }}
        .focus-goods-pay_item
          span 收件人
          input(v-model.trim='info.name' placeholder='你的名字')
        .focus-goods-pay_item
          span 你的电话
          input(v-model.trim='info.phoneNumber' type='tel' placeholder='你的电话')
        .focus-goods-pay_item
          span 地址
          input(v-model.trim='info.address' placeholder='收货地址是?')
      .focus-goods-pay_footer(@click='payHandle') 确认支付

  transition(name='fade')
    span.modal(v-if='modal.visible') {{ modal.content }}
</template>

<script>
import cell from '~components/cell.vue'
import { mapState } from 'vuex'
import wechat from '~static/mixins/wechat.js'

function toggleModal (obj, content) {
  clearTimeout(obj.timer)
  obj.visible = true
  obj.content = content
  obj.timer = setTimeout(() => {
    obj.visible = false
  }, 1500)
}

export default {
  middleware: 'wechat-auth',
  head () {
    return {
      title: '手办详情'
    }
  },
  data () {
    return {
      swiperConfig: {
        autoplay: 4000,
        direction: 'horizontal',
        loop: true,
        pagination: '.swiper-pagination'
      },
      attentions: [
        '商品和服务差异',
        '物流配送'
      ],
      swipeOptions: {
        startSlide: 0,
        speed: 300,
        auto: 4000,
        continuous: true,
        disableScroll: false,
        stopPropagation: false,
        callback: function (index, slide) { console.log('slide changes') },
        transitionEnd: function (index, slide) { console.log('slide transition ends') }
      },
      showInfo: false,
      info: {
        name: '',
        phoneNumber: '',
        address: ''
      },
      modal: {
        visible: false,
        content: '成功',
        timer: null
      }
    }
  },
  computed: {
    ...mapState({
      imageCDN: 'imageCDN',
      product: 'focusProduct'
    })
  },
  mixins: [wechat],
  async beforeMount () {
    const id = this.$route.query.id
    await this.$store.dispatch('focusProduct', id)

    const url = window.location.href
    const shareOpts = {
      title: `手办: ${this.product.title}`, // 分享标题
      desc: this.product.intro, // 分享描述
      link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: `${this.imageCDN + this.product.images[0]}`, // 分享图标
      type: 'link', // 分享类型,music、video或link，不填默认为link
      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      success: () => {}, // 用户确认分享后执行的回调函数
      cancel: () => {} // 用户取消分享后执行的回调函数
    }

    await this.wechatConfig(shareOpts, url)
  },
  methods: {
    clickBanner (index) {
      const arr = this.product.images.slice().map(e => `${this.imageCDN + e}`)
      this.previewImage(index, arr)
    },
    previewImage (index, arr) {
      // 预览图片
      window.wx.previewImage({
        current: arr[index], // 当前显示图片的http链接
        urls: arr // 需要预览的图片http链接列表
      })
    },
    async payHandle () {
      var _ = this
      const { name, address, phoneNumber } = this.info
      if (!name || !address || !phoneNumber) {
        toggleModal(_.modal, '收货信息忘填了呢~')
        return
      }
      const res = await this.$store.dispatch('createOrder', {
        productId: this.product._id,
        name: name,
        address: address,
        phoneNumber: phoneNumber
      })
      console.log(res)
      if (!res.order) throw new Error('error')
      window.wx.chooseWXPay({
        timestamp: res.order.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: res.order.nonceStr, // 支付签名随机串，不长于 32 位
        package: res.order.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
        signType: res.order.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: res.order.paySign, // 支付签名
        success: (res) => {
          try {
            window.WeixinJSBridge.log(res.err_msg)
          } catch (e) {
            console.error(e)
          }
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            // 支付成功
            toggleModal(_.modal, '支付成功')
          }
        }
      })
    }
  },
  components: {
    cell
  }
}
</script>

<style scoped lang="sass" src='~static/sass/deal.sass'></style>
