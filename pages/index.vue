<template lang="pug">
.container
  .house(ref='house')
    .house-content(v-for='(item, index) in houses' :key='index' @click='focusHouse(item)')
      .house-text
        .words {{ item.words }}
        .cname {{ item.name }}
        .name {{ item.cname }}
      .house-img-wrapper
        img(:src="imageCDN + item.cname")

  .povCharacters
    .title 主要人物
    .povCharacter-wrapper
      .povCharacter-content(v-for='(item, index) in characters' :key='index' @click='focusCharacters(item)')
        img(:src="imageCDN + item.profile + '?imageView2/1/w/280/h/440/format/jpg/q/75|imageslim'")
        .povCharacter-text
          .cname {{ item.cname }}
          .name {{ item.name }}
          .playedBy {{ item.playedBy }}

  .city
    .city-title 维斯特洛
    img.city-bg(src='http://oqncgivnd.bkt.clouddn.com/map/bg2.png')
    .city-intro 坐落于已知世界的最西端，狭长的维斯特洛大陆由北部的极地冰盖起向南延绵约3,000英里。绝境长城是一座巍峨挺立的不可逾越之物，横跨300英里，将最北的塞外地区与七大王国相互分离。一个统一的政治实体领导着南方的广阔土地，并形成九块相互联系又相互割据的区域。
    .city-item(v-for='(item, index) in cities' :key='index')
      .city-item-title {{ item.title }}
      .city-item-body {{ item.body }}
</template>

<script>
import { mapState } from 'vuex'

export default {
  middleware: 'wechat-auth',
  head () {
    return {
      // 本页面的<head>中的<title>
      title: '冰火脸谱'
    }
  },
  data () {
    return {
      cities: [
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
    }
  },
  computed: {
    ...mapState([
      // 映射 this.xxx 为 store.state.xxx
      'imageCDN',
      'homePageScroll',
      'houses',
      'characters'
    ])
  },
  methods: {
    focusHouse (item) {
      // 路由跳转到house，附带查询参数id
      this.$router.push({ path: '/house', query: { id: item._id } })
    },
    focusCharacters (item) {
      // 路由跳转到character，附带查询参数id
      this.$router.push({ path: '/character', query: { id: item._id } })
    }
  },
  beforeCreate () {
    // 请求所有家族和主要人物
    this.$store.dispatch('fetchHouses')
    this.$store.dispatch('fetchCharacters')
  },
  mounted () {
    // 滚动条滚动至上次离开前的位置
    setTimeout(() => {
      this.$el.scrollTop = this.homePageScroll.home
      this.$refs.house.scrollLeft = this.homePageScroll.house
    }, 50)
  },
  beforeDestroy () {
    // 离开前保存滚动条位置
    this.$store.dispatch('homePageScroll', {
      'home': this.$el.scrollTop,
      'house': this.$refs.house.scrollLeft
    })
  }
}
</script>

<style scoped lang="sass" src='~static/sass/index.sass'></style>
