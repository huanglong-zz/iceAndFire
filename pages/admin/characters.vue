<template lang="pug">
.content
  v-modal(:showModal.sync='editCharacterModal')
    .modal-body(slot='body')
      .form.edit-form
        .input-group
          label 中文名
          p {{edited.cname}}
          //- input(v-model='edited.cname')
        .input-group
          label 英文名
          p {{edited.name}}
          //- input(v-model='edited.name')
        .input-group
          label 演员
          p {{edited.playedBy}}
        .input-group
          label 头像及剧照
          .profile
            img(:src='regImageCDN(edited.profile)', v-if='edited.profile')

          .images
            .img(v-for='item, index in edited.images')
              img(:src='regImageCDN(item)', @click='setProfile(item)')
              .delete(@click='edited.images.splice(index, 1)')
                .material-icon delete

        //- .input-group
        //-   label 势力
        //-   .sections
        //-     .section(v-for='item in edited.allegiances') {{item}}
          //- input(v-model='edited.allegiances')
        .input-group(v-for='item, index in edited.sections')
          label {{item.title}}
          .sections
            .section(v-for='i, index2 in item.content')
              div(:contenteditable='true', @keyup='editSection({index: index, index2: index2}, $event)', v-html='i')
          .delete-section(@click='deleteSection(index)')
            .material-icon delete
          //- input(v-model='item.content')
    .modal-footer(slot='footer')
      button.btn.save-edit(@click='saveEdited') 保存
  .characters
    .character(v-for='item in characters', @click='showModal(item)')
      img(:src='regImageCDN(item.profile)')
      .character-detail
        .cname {{item.cname}}
        .name {{item.name}}
        .playedBy {{item.playedBy}}

</template>

<script>
import { mapState } from 'vuex'
import vModal from '~components/modal'

export default {
  middleware: 'auth',
  layout: 'admin',
  head () {
    return {
      title: '角色数据修改'
    }
  },
  data () {
    return {
      edited: {},
      editCharacterModal: false
    }
  },
  computed: mapState([
    'imageCDN',
    'characters'
  ]),
  created () {
    this.$store.dispatch('fetchCharacters')
  },
  methods: {
    regImageCDN (url) {
      return url.includes('http')
        ? url
        : `${this.imageCDN}/${url}?imageView2/1/w/280/h/440/format/jpg/q/75|imageslim`
    },
    deleteSection (index) {
      this.edited.sections.splice(index, 1)
    },
    setProfile (item) {
      this.edited.profile = item
    },
    async saveEdited () {
      await this.$store.dispatch('updateCharacter', this.edited)

      this.editCharacterModal = false
    },
    editSection ({ index, index2 }, e) {
      this.edited.sections[index].content[index2] = e.srcElement.innerText
    },
    showModal (item) {
      this.edited = item
      this.editCharacterModal = !this.editCharacterModal
    }
  },
  components: {
    vModal
  }
}
</script>

<style lang='sass', src='~static/sass/admin.sass', scoped/>
