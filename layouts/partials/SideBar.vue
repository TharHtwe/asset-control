<template>
    <!-- Main Sidebar Container -->
  <aside class="main-sidebar sidebar-dark-primary elevation-4">
    <!-- Brand Logo -->
    <a href="#" class="brand-link py-4">
      <img src="/icon6.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style="opacity: .8">
      <span class="brand-text font-weight-light">Asset Control</span>
      <!-- <div style="padding-left: 0.8rem;">
        <i class="fas fa-2xl fa-laptop-house img-circle elevation-3" style="opacity: .8;"/>
        <span class="brand-text font-weight-light">AdminLTE 3</span>
      </div> -->
    </a>

    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Sidebar user panel (optional) -->
      <!-- <div class="user-panel mt-3 pb-3 mb-3 d-flex">
        <div class="image">
          <img :src="$auth.user.avatar" class="img-circle elevation-2" alt="User Image">
        </div>
        <div class="info">
          <a href="#" class="d-block">{{$auth.user.name}}</a>
        </div>
      </div> -->

      <!-- Sidebar Menu -->
      <nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
          <!-- Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library -->
          <li class="nav-item">
            <b-link @click="$router.push('/' + ($route.query.scope ? '?scope=' + $route.query.scope : ''))" :class="['nav-link', { 'active' : $route.path === '/' || $route.path.indexOf('assets') > -1 }]">
              <i class="nav-icon fas fa-laptop-house"></i>
              <p>
                Assets
              </p>
            </b-link>
          </li>
          <li class="nav-item">
            <b-link @click="$router.push('/locations' + ($route.query.scope ? '?scope=' + $route.query.scope : ''))" :class="['nav-link', { 'active' : $route.path.indexOf('locations') > -1 }]">
              <i class="nav-icon fas fa-search-location"></i>
              <p>
                Locations
              </p>
            </b-link>
          </li>
          <li class="nav-item">
            <b-link @click="$router.push('/records' + ($route.query.scope ? '?scope=' + $route.query.scope : ''))" :class="['nav-link', { 'active' : $route.path.indexOf('records') > -1 }]">
              <i class="nav-icon fas fa-book"></i>
              <p>
                Records
              </p>
            </b-link>
          </li>
          <li class="nav-item">
            <b-link @click="$router.push('/reports' + ($route.query.scope ? '?scope=' + $route.query.scope : ''))" :class="['nav-link', { 'active' : $route.path.indexOf('reports') > -1 }]">
              <i class="nav-icon fas fa-chart-line"></i>
              <p>
                Reports
              </p>
            </b-link>
          </li>
        </ul>
      </nav>
      <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->
  </aside>
</template>

<script>
export default {

}
</script>

<style>

</style>
