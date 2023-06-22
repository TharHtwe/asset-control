<template>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper bg-transparent">

    <!-- Main content -->
    <section class="content">
      <div v-if="error.statusCode === 404" class="error-page">
        <h2 class="headline text-warning"> 404</h2>

        <div class="error-content">
          <h3><i class="fas fa-exclamation-triangle text-warning"></i> Oops! Page not found.</h3>

          <p>
            We could not find the page you were looking for.
            Meanwhile, you may <b-link @click="$router.push('/' + ($route.query.scope ? '?scope=' + $route.query.scope : ''))">return to dashboard</nuxt-link>.
          </p>
        </div>
        <!-- /.error-content -->
      </div>
      <div v-else class="error-page">
        <h2 class="headline text-danger">500</h2>

        <div class="error-content">
          <h3><i class="fas fa-exclamation-triangle text-danger"></i> Oops! Something went wrong.</h3>

          <p>
            We will work on fixing that right away.
            Meanwhile, you may <b-link @click="$router.push('/' + ($route.query.scope ? '?scope=' + $route.query.scope : ''))">return to dashboard</nuxt-link>.
          </p>
        </div>
      </div>
      <!-- /.error-page -->
    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
export default {
  name: 'ErrorPage',
  layout: 'blank',
  props: {
    error: {
      type: Object,
      default: null
    }
  }
}
</script>

<style>

</style>
