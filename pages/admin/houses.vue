<template lang="pug">
.content
  v-modal(:showModal.sync='editHouseModal')
    .modal-body(slot='body')
      .form.edit-form
        .input-group
          label 中文名
          input(v-model='edited.cname')

        .input-group
          label 英文名
          input(v-model='edited.name')

        .input-group
          label 箴言
          input(v-model='edited.words')

        .input-group
          label 封面
          .profile
            img(:src="imageCDN + edited.cname")

        .input-group
          label 成员
          .swornMembers
            .swornMember(v-for='item in edited.swornMembers')
              img(:src='imageCDN + item.character.profile + "?imageView2/1/w/280/h/440/format/jpg/q/75|imageslim"')
              .swornMember-text
                input.id(v-model='item.character._id')
                br
                input.cname(v-model='item.character.cname')
                br
                input.text(v-model='item.text')
      
        .input-group(v-for='item, index in edited.sections')
          label {{item.title}}
          .sections
            .section(v-for='i, index2 in item.content')
              div(:contenteditable='true', @keyup='editSection({index: index, index2: index2}, $event)', v-html='i')
          .delete-section(@click='deleteSection(index)')
            .material-icon delete

    .modal-footer(slot='footer')
      button.btn.save-edit(@click='saveEdited') 保存

  .houses
    .house(v-for='item in houses', @click='showModal(item)')
      img(:src="imageCDN + item.cname")
  .edit

</template>

<script>
import { mapState } from 'vuex'
import vModal from '~components/modal'

export default {
  middleware: 'auth',
  layout: 'admin',
  head () {
    return {
      title: '家族数据修改'
    }
  },
  data () {
    return {
      edited: {},
      editHouseModal: false
    }
  },
  computed: mapState([
    'imageCDN',
    'houses'
  ]),
  created () {
    this.$store.dispatch('fetchHouses')
  },
  methods: {
    deleteSection (index) {
      this.edited.sections.splice(index, 1)
    },
    async saveEdited () {
      await this.$store.dispatch('updateHouse', this.edited)

      this.editHouseModal = false
    },
    showModal (item) {
      this.edited = item
      this.editHouseModal = !this.editHouseModal
    }
  },
  components: {
    vModal
  }
}
</script>

<style lang='sass', src='~static/sass/admin.sass', scoped/>
