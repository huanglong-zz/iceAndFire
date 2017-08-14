<template lang="pug">
.container
  .focusHouse-media
    img(v-if='house.cname' :src="imageCDN + house.cname + '?imageView2/1/w/750/h/460/format/jpg/q/90|imageslim'")
    .focusHouse-text
      .words {{ house.words }}
      .name {{ house.name }}

  .focusHouse-body
    .focusHouse-item-title {{ house.cname }}
    .focusHouse-item-body {{ house.intro }}

    .focusHouse-item-title 主要角色
    .focusHouse-item-body(v-for='item in house.swornMembers')
      .swornMembers
        img(:src="imageCDN + item.character.profile + '?imageView2/1/w/280/h/440/format/jpg/q/75|imageslim'")
        .swornMembers-body
          .name {{ item.character.cname }}
          .introduction {{ item.text }}

    .focusHouse-item-section(v-for='item in house.sections')
      .focusHouse-item-title {{ item.title }}
      .focusHouse-item-body(v-for='text in item.content') {{ text }}
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
      title: '家族详情'
    }
  },
  computed: {
    ...mapState({
      imageCDN: 'imageCDN',
      house: 'focusHouse'
    })
  },
  mixins: [wechat],
  async beforeMount () {
    const id = this.$route.query.id
    await this.$store.dispatch('focusHouse', id)

    const url = window.location.href
    const shareOpts = {
      title: this.house.cname, // 分享标题
      desc: this.house.intro, // 分享描述
      link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: `${this.imageCDN + this.house.cname}`, // 分享图标
      type: 'link', // 分享类型,music、video或link，不填默认为link
      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      success: () => {}, // 用户确认分享后执行的回调函数
      cancel: () => {} // 用户取消分享后执行的回调函数
    }

    await this.wechatConfig(shareOpts, url)
  }
}
</script>

<style scoped lang="sass" src='~static/sass/house.sass'></style>
