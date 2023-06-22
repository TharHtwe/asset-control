<template>
  <div class="content-wrapper">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Reports</h1>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>
    <!-- /.content-header -->

    <!-- Main content -->
    <div class="content">
      <div class="container-fluid">
        <b-card>
            <b-card-header>
              <h5>Assets</h5>
            </b-card-header>
            <b-card-body>
              <b-link @click="$router.push('/reports/assetreport' + ($route.query.scope ? '?scope=' + $route.query.scope : ''))">
                Asset Details Report
              </b-link><br>
              <!-- <b-link @click="$router.push('/reports/summaryreport' + ($route.query.scope ? '?scope=' + $route.query.scope : ''))">
                Asset Summary Report
              </b-link><br> -->
              <b-link @click="$router.push('/reports/locationreport' + ($route.query.scope ? '?scope=' + $route.query.scope : ''))">
                Location Details Report
              </b-link><br>
            </b-card-body>
          </b-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportsHome',
  data () {
    return {
      hello: 'Hello World'
    }
  }
}
</script>

<style>

</style>
