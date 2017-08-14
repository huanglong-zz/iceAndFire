<template lang="pug">
transition(name='modal')
  .modal(v-if='showModal')
    .modal-container
      .modal-header
        slot(name='header')
      .modal-body
        slot(name='body')
      .modal-footer
        slot(name='footer')
    .modal-mask(@click='$emit("update:showModal", !showModal)')
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: {
    showModal: {
      default: false
    }
  }
}
</script>

<style lang="sass", src='~static/sass/modal.sass'></style>
