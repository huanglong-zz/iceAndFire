<template lang="pug">
.container
  .focusCharacters-header
    img.focusCharacters-header-bg(v-if='character.images', :src="imageCDN + character.images[character.images.length - 1] + '?imageView2/1/w/375/h/230/format/jpg/q/90|imageslim'")
    .focusCharacters-media
      img(v-if='character.profile', :src="imageCDN + character.profile + '?imageView2/1/w/280/h/440/format/jpg/q/75|imageslim'")
      .focusCharacters-text
        .names
          p.cname {{ character.cname }}
          p.name {{ character.name }}
        span.born {{ character.nmId }}
  
  .focusCharacters-body
    .focusCharacters-intro
      p(v-for='item in character.intro') {{ item }}
    
    .focusCharacter-stills
      img(v-for='(item, index) in character.images' :src="imageCDN + item + '?imageView2/1/w/750/h/460/format/jpg/q/90|imageslim'" @click='clickBanner(index)' :key='index')
  
    .focusCharacter-item(v-for='item in character.sections')
      .focusCharacter-item-title {{ item.title }}
      .focusCharacter-item-body(v-for='text in item.content') {{ text }}
</template>

<script>
import { mapState } from 'vuex'
import wechat from '~static/mixins/wechat.js'

export default {
  middleware: 'wechat-auth',
  transition: {
    name: 'slide-left'
  },
  head () {
    return {
      title: '家族成员详情'
    }
  },
  computed: {
    ...mapState({
      imageCDN: 'imageCDN',
      character: 'focusCharacter'
    })
  },
  mixins: [wechat],
  async beforeMount () {
    const id = this.$route.query.id
    await this.$store.dispatch('focusCharacter', id)

    const url = window.location.href
    const shareOpts = {
      title: `${this.character.cname}，${this.character.name}`, // 分享标题
      desc: this.character.intro[0], // 分享描述
      link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: `${this.imageCDN + this.character.profile}`, // 分享图标
      type: 'link', // 分享类型,music、video或link，不填默认为link
      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      success: () => {}, // 用户确认分享后执行的回调函数
      cancel: () => {} // 用户取消分享后执行的回调函数
    }

    await this.wechatConfig(shareOpts, url)
  },
  methods: {
    clickBanner (index) {
      const arr = this.character.images.slice().map(e => `${this.imageCDN + e}?imageView2/1/w/750/h/460/format/jpg/q/90|imageslim`)
      this.previewImage(index, arr)
    },
    previewImage (index, arr) {
      // 预览图片
      window.wx.previewImage({
        current: arr[index], // 当前显示图片的http链接
        urls: arr // 需要预览的图片http链接列表
      })
    }
  }
}
</script>

<style scoped lang="sass" src='~static/sass/characters.sass'></style>
