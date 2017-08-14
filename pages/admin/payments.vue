<template lang="pug">
.content
  .related-products
      table.table
        thead
          tr
            th 图片
            th 标题
            th 价格
            th 姓名
            th 电话
            th 地址
            th 支付方式
        tbody
          tr(v-for='item in payments')
            td
              .img
                img(:src='imageCDN + item.product.images[0] + "?imageView2/1/format/jpg/q/75|imageslim"')
            td {{item.product.title}}
            td {{item.product.price}}
            td {{item.name}}
            td {{item.phoneNumber}}
            td {{item.address}}
            td

  //- .edit-product(:class='{active: editing}')
  //-   .edit-header
  //-     .material-icon edit
  //-     div(style='flex: 1')
  //-     .material-icon(@click='editing = !editing') close
  //-   .edit-body
  //-     .form.edit-form
  //-       .input-group
  //-         label 标题
  //-         input(v-model='edited.title')
  //-       .input-group
  //-         label 价格
  //-         input(v-model.number='edited.price', type='number')
  //-       .input-group
  //-         label 简介
  //-         textarea(v-model='edited.intro', @keyup='editedIntro')
  //-       .input-group
  //-         label 图片
  //-         .upload-images
  //-           .img(v-for='item, index in edited.images')
  //-             img(:src='baseUrl + item + "?imageView2/1/format/jpg/q/75|imageslim"')
  //-             .tools
  //-               .material-icon(@click='deleteImg(index)') delete
  //-           .upload-btn
  //-             svg(width='53px', height='37px', viewbox='0 0 53 37', version='1.1', xmlns='http://www.w3.org/2000/svg', xmlns:xlink='http://www.w3.org/1999/xlink')
  //-               g#Page-1(stroke='none', stroke-width='1', fill='none', fill-rule='evenodd')
  //-                 g#ic_backup_black_24px(transform='translate(-1.000000, -6.000000)')
  //-                   polygon#Shape(points='0 0 55 0 55 55 0 55')
  //-                   path#outline(d='M42.6907609,20.7503727 C41.2853571,13.6200155 35.0230435,8.26708075 27.5,8.26708075 C21.5270342,8.26708075 16.339441,11.6565839 13.7559783,16.6168323 C7.535,17.2781988 2.69875776,22.5484627 2.69875776,28.9347826 C2.69875776,35.7757919 8.25836957,41.3354037 15.0993789,41.3354037 L41.9673913,41.3354037 C47.671677,41.3354037 52.3012422,36.7058385 52.3012422,31.0015528 C52.3012422,25.5452795 48.0643634,21.1223913 42.6907609,20.7503727 Z', stroke='#78909C', stroke-width='3', :stroke-dasharray='upload.dasharray', :stroke-dashoffset='upload.dashoffset')
  //-                   path#Shape(d='M42.6907609,20.7503727 C41.2853571,13.6200155 35.0230435,8.26708075 27.5,8.26708075 C21.5270342,8.26708075 16.339441,11.6565839 13.7559783,16.6168323 C7.535,17.2781988 2.69875776,22.5484627 2.69875776,28.9347826 C2.69875776,35.7757919 8.25836957,41.3354037 15.0993789,41.3354037 L41.9673913,41.3354037 C47.671677,41.3354037 52.3012422,36.7058385 52.3012422,31.0015528 C52.3012422,25.5452795 48.0643634,21.1223913 42.6907609,20.7503727 Z M31.6335404,26.8680124 L31.6335404,35.1350932 L23.3664596,35.1350932 L23.3664596,26.8680124 L17.1661491,26.8680124 L27.5,16.5341615 L37.8338509,26.8680124 L31.6335404,26.8680124 Z', fill='#CFD8DC', fill-rule='nonzero')
  //-             br
  //-             .text 上传图片
  //-             input(type='file', @change='uploadImg($event)')
  //-       .input-group
  //-         label 参数
  //-         .parameters
  //-           .inputs(v-for='item, index in edited.parameters')
  //-             input(v-model='item.key', placeholder='名称')
  //-             input(v-model='item.value', placeholder='值')
  //-             .remove(@click='removeParameter(index)')
  //-               .material-icon remove
  //-   .edit-footer
  //-     button.btn.save(@click='saveEdited', v-if='!isProduct') 创建周边
  //-     button.btn.save(@click='saveEdited', v-if='isProduct') 保存修改

  //-     .btn.add-parameter(@click='addParameter')
  //-       .material-icon add
  //-       | 添加参数
  //- .float-btn(@click='createProduct')
  //-   .material-icon add
  //- v-snackbar(:open.sync='openSnackbar')
  //-   span(slot='body') 保存成功
</template>

<script>
import { mapGetters } from 'vuex'
import vSnackbar from '~components/snackbar'

export default {
  middleware: 'auth',
  layout: 'admin',
  head () {
    return {
      title: '用户订单'
    }
  },
  data () {
    return {
    }
  },
  async created () {
    this.$store.dispatch('fetchPayments')
  },
  mounted () {
  },
  computed: mapGetters([
    'imageCDN',
    'payments'
  ]),
  methods: {
  },
  components: {
    vSnackbar
  }
}
</script>
<style lang='sass', src='~static/sass/admin.sass', scoped/>
