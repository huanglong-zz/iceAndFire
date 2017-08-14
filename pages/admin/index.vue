<template lang="pug">
.content
  v-snackbar(:open.sync='openSnackbar')
    span(slot='body') 保存完成
  .spinner-content
    v-spinner(v-show='loading')
  .step
    h3 1. 获取 IMDb 卡司
    button.btn(@click='crawlerIMDbCharacters') 
      | 开始
      span.material-icon touch_app
    hr

  .step(v-if='step > 1')
    h3 2. 对比 API 数据。
      span.material-icon check
      | 表示 API 中存在此英文名，
      span.material-icon mood
      | 表示 API 中存在此演员。

    button.btn(@click='checkCharacter') 
      | 开始
      span.material-icon touch_app
    hr

  .step(v-if='step > 2')
    h3 3. 过滤数据。保留
      span.material-icon check
      | 且
      span.material-icon mood
      | 的数据
    button.btn(@click='filterIMDbCharacters') 
      | 过滤
      span.material-icon touch_app
    hr

  .step(v-if='step > 3')
    h3 4. 爬取封面
    button.btn(@click='getProfile') 
      | 爬封面
      span.material-icon touch_app
    hr

  .step(v-if='step > 4')
    h3 5. 爬取剧照（需要等待很长的时间）
    button.btn(@click='getImages') 
      | 爬剧照
      span.material-icon touch_app
    hr

  .step(v-if='step > 5')
    h3 6. 保存
    button.btn(@click='saveIMDb') 
      | 保存
      span.material-icon save
  table.table
    thead
      tr
        th #
        th(v-if='step > 3') 封面
        th 英文名
        th 演员
        th(v-if='step > 4') 剧照
        th chId
        th nmId
        th(v-if='checked') 存在 API
    tbody
      tr(v-for='item, index in IMDb')
        td {{index + 1}}
        td(v-if='step > 3')
          img(:src='item.profile', v-if='item.profile', style='width: 80px')
          span(v-else) 等待中
        td 
          input(v-model='item.name')
        td 
          input(v-model='item.playedBy')
        td(v-if='step > 4')
          .images(style='width: 200px;')
            img(v-for='image in item.images', :src='image', style='width: 50px; float: left')
        td 
          a(:href='"http://www.imdb.com/character/" + item.chId', target='_blank') {{item.chId}}
        td
          a(:href='"http://www.imdb.com/name/" + item.nmId', target='_blank') {{item.nmId}} 
        td(v-if='checked')
          .material-icon(v-if='findNameInAPICharacters(item)') check
          .material-icon(v-if='findPlayedByInAPICharacters(item)') mood
  br
  br 
</template>

<script>
import { mapState } from 'vuex'
import R from 'ramda'
import { find } from 'lodash'
import vSpinner from '~components/spinner'
import vSnackbar from '~components/snackbar'
import axios from 'axios'

const sleep = time => new Promise(resolve => setTimeout(resolve, time))

export default {
  middleware: 'auth',
  layout: 'admin',
  head () {
    return {
      title: '爬取 IMDb cast 数据'
    }
  },
  data () {
    return {
      step: 1,
      loading: false,
      openSnackbar: false,
      checked: false
    }
  },
  computed: mapState([
    'IMDb',
    'APICharacters'
  ]),
  methods: {
    findNameInAPICharacters (item) {
      return find(this.APICharacters, { name: item.name })
    },

    findPlayedByInAPICharacters (item) {
      return find(this.APICharacters, i => {
        return i.playedBy.includes(item.playedBy)
      })
    },

    // 从 IMDb 上爬取所有的卡司的信息，chId 为角色相关，nmId 为演员相关。通过然后通过 chId 和 nmId 获取相关人物封面图和剧照
    async crawlerIMDbCharacters () {
      this.loading = true
      await this.$store.dispatch('crawlerIMDbCharacters')
      this.step = 2
      this.loading = false
    },

    // 检查 IMDb 上爬到的人物和 API 上的人物名字以及演员是否一致，有些不一致的需要手动修改，如狼爸的名字 IMDb 上与 API 上是不一致的，由于 API 的数据其实是英文的 wiki 上的，所以我们需要以 API 上为准。可以通过 wiki 查寻 wiki 上的名字，然后修改。
    async checkCharacter () {
      this.loading = true
      await this.$store.dispatch('APICharacters')
      this.loading = false
      this.step = 3
      this.checked = true
    },

    async filterIMDbCharacters () {
      const inNameAndPlayedBy = R.filter(i => this.findNameInAPICharacters(i) && this.findPlayedByInAPICharacters(i))

      const IMDb = inNameAndPlayedBy(this.IMDb)
      this.$store.commit('SET_IMDb', IMDb)
      this.step = 4
    },

    // 从 IMDb 上获取人物的封面
    async getProfile () {
      // 地址为 http://www.imdb.com/character/
      let characters = this.IMDb

      for (let i = 0; i < characters.length; ++i) {
        console.log(i)
        if (!characters[i].profile) {
          let character = characters[i]

          const url = `http://www.imdb.com/character/${character.chId}/`

          let { data } = await axios.get('/crawler/getIMDbProfile', {
            params: {
              url: url
            }
          })

          character.profile = data

          if (data) {
            this.$store.commit('UPDATA_IMDB', { character, i })
            this.IMDb.splice(i, 1, character)
          }

          await sleep(500)
        }
      }

      this.step = 5
    },

    // 爬所有的剧照
    async getImages () {
      let characters = this.IMDb

      for (let i = 0; i < characters.length; ++i) {
        console.log(i)
        if (!characters[i].images) {
          let character = characters[i]

          const url = `http://www.imdb.com/character/${character.chId}/mediaindex?ref_=ch_mv_sm`

          let { data } = await axios.get('/crawler/getIMDbImages', {
            params: {
              url: url
            }
          })

          character.images = data

          if (data) {
            this.$store.commit('UPDATA_IMDB', { character, i })
            this.IMDb.splice(i, 1, character)
          }

          await sleep(500)
        }
      }

      this.step = 6
    },
    async saveIMDb () {
      let data = R.filter(i => i.profile)(this.IMDb)
      await axios.post('/crawler/saveIMDb', data)

      this.openSnackbar = true
    }
  },
  components: {
    vSpinner,
    vSnackbar
  }
}
</script>
<style lang='sass', src='~static/sass/admin.sass', scoped/>
