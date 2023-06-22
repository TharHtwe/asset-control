<template>
    <!-- Navbar -->
  <nav class="main-header navbar navbar-expand navbar-white navbar-light">
    <!-- Left navbar links -->
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" data-widget="pushmenu" role="button"><sidebar-toggle/></a>
      </li>
    </ul>

    <h4 class="mx-auto">Asset Control</h4>

    <ul class="navbar-nav">
      <li class="nav-item my-auto">
        <b-form-checkbox v-model="dark" switch/>
      </li>
      <li class="nav-item">
        <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-expand-arrows-alt"></i></a>
      </li>
    </ul>
    <!-- <div class="user-panel pb-1 d-flex">
      <div class="image">
        <img :src="$auth.user.avatar" class="img-circle elevation-2" alt="User Image">
      </div>
      <div class="info">
        <a href="#" class="d-block">{{$auth.user.name}}</a>
      </div>
    </div> -->
    <b-nav-item-dropdown right class="pb-1 d-flex">
      <template #button-content>
        <i class="fas fa-user mr-1" /> {{ $auth.user.name }}
      </template>
      <!-- <b-dropdown-item to="/settings">
        <i class="fas fa-cogs" /> Settings
      </b-dropdown-item> -->
      <b-dropdown-item @click="logout">
        <i class="fas fa-sign-out-alt" /> Logout
      </b-dropdown-item>
    </b-nav-item-dropdown>
  </nav>
  <!-- /.navbar -->

</template>

<script>
import SidebarToggle from './SidebarToggle.vue'
export default {
  components: { SidebarToggle },
  data () {
    return {
    }
  },
  computed: {
    dark: {
      get () {
        return this.$store.state.theme.dark
      },
      set (value) {
        this.$store.commit('theme/set', value)
      }
    }
  },
  methods: {
    async logout () {
      await this.$auth.logout()
        .then(() => {
          this.$router.push('/login' + (this.$route.query.scope ? '?scope=' + this.$route.query.scope : ''))
        })
    }
  }
}
</script>

<style>

</style>
