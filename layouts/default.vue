<template>
  <div class="wrapper">
    <nav-bar/>
    <side-bar/>
    <nuxt/>
    <main-footer/>
    <vue-snotify/>
    <vue-confirm-dialog/>
  </div>
</template>

<script>
import MainFooter from './partials/Footer.vue'
import NavBar from './partials/NavBar.vue'
import SideBar from './partials/SideBar.vue'
export default {
  name: 'DefaultLayout',
  components: { NavBar, SideBar, MainFooter },
  head () {
    return {
      link: [
        { rel: 'stylesheet', href: this.dark ? '/css/bootstrap-dark.css' : '/css/bootstrap.css' }
      ],
      bodyAttrs: {
        class: ['sidebar-mini', 'layout-fixed', 'layout-footer-fixed', this.mode]
      }
    }
  },
  computed: {
    dark () {
      return this.$store.state.theme.dark
    },
    mode () {
      return this.$store.state.theme.mode
    }
  }
}
</script>

<style>

</style>
