module.exports = {
  head: {
    title: 'loading',
    meta: [
      { charset: 'utf-8' },
      { hid: 'description', name: 'description', content: '冰与火之歌' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'static/favicon.ico' }
    ],
    script: [
      { src: 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js' }
    ]
  },
  css: [
    {
      src: 'static/sass/base.sass',
      lang: 'sass?indentedSyntax=true'
    },
    {
      src: 'swiper/dist/css/swiper.css'
    }
  ],
  plugins: [
    { src: '~plugins/swiper.js', ssr: false },
    { src: '~plugins/flexible.js', ssr: false }
  ],
  build: {
    // extend (config, ctx) {
    //   if (ctx.isClient) {
    //     config.module.rules.push({
    //       enforce: 'pre',
    //       test: /\.(js|vue)$/,
    //       loader: 'eslint-loader',
    //       exclude: /(node_modules)/
    //     })
    //   }
    // },
    loaders: [
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'img/[name].[hash].[ext]'
        }
      }
    ]
  },
  loading: { color: '#F44336' },
  performance: {
    prefetch: false
  }
}
