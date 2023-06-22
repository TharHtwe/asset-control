export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Asset Control',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preload', as: 'style', href: '/css/bootstrap.css' },
      { rel: 'preload', as: 'style', href: '/css/bootstrap-dark.css' }
      // { rel: 'stylesheet', type: 'text/css', href:'https://cdn.rawgit.com/tonystar/bootstrap-float-label/v4.0.1/dist/bootstrap-float-label.min.css' }
    ],

  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    // '@/css/adminlte.min.css',
    '@/assets/scss/index.scss',
    '@/assets/css/adminlte.min.css',
    '@/assets/css/float-label.css',
    'v-contextmenu/dist/index.css',
	'vue-snotify/styles/material.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src : '@/plugins/main.js' },
    { src : '@/plugins/helper.js' },
	{ src: '~/plugins/vue-good-table', ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/auth',
    '@nuxtjs/proxy',
    ['nuxt-vuex-localstorage', {
      key: 'foo',
      salt: 'bar',
      localStorage: ['theme']
    }],
  ],

  router: {
    middleware: ['auth']
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    // baseURL: process.env.NODE_ENV === 'production' ? process.env.PROD_API_URL : process.env.DEV_API_URL
	proxy: true
  },

  proxy: {
    '/api': { target: process.env.NODE_ENV === 'production' ? process.env.PROD_API_URL : process.env.DEV_API_URL, pathRewrite: {'^/api': '/api'}, changeOrigin: true }
  },

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: '/api/user/login', method: 'post', propertyName: 'token' },
          logout: { url: '/api/user/logout', method: 'post' },
          user: { url: '/api/user', method: 'get', propertyName: 'user' }
        }
      }
    }
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
}
