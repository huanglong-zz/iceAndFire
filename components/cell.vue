<template lang="pug">
.cell
  span {{ title }}
  span(v-if='content && !iconName') {{ content }}
  i.material-icon(v-else) {{ iconName }}
</template>

<script>
export default {
  props: {
    title: String,
    content: String,
    iconName: String
  }
}
</script>

<style lang="sass">
@import '~static/sass/color'
@import '~static/sass/mixin'

.cell
  width: 100%
  font-size: 0

  > *
    vertical-align: middle
    display: inline-block

  span
    width: 50%
    text-align: left
    +font-dpr(15px)

  .material-icon
    width: 50%
    text-align: right
    +font-dpr(33px)
    color: $grey-800
</style>
