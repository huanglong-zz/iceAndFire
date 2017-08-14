<template lang="pug">
aside
  ul
    li
      nuxt-link(to='/admin') 爬虫
    li
      nuxt-link(to='/admin/characters') 主要演员
    li
      nuxt-link(to='/admin/houses') 九大家族
    li
      nuxt-link(to='/admin/related-products') 周边
    li
      nuxt-link(to='/admin/payments') 订单
</template>
<style lang='sass'>
aside
  width: 230px
  height: calc(100vh - 56px)
  overflow: scroll
  padding-top: 20px

  ul
    list-style: none
    padding: 0
 
    a
      display: block
      font-size: 14px
      height: 40px
      line-height: 40px
      padding-left: 40px
      color: #666
      text-decoration: none

      &:hover
        background-color: rgba(0,0,0,.05)
        text-decoration: none

      &.nuxt-link-exact-active
        font-weight: 500
        color: #222
        background-color: rgba(0,0,0,.05)


</style>
