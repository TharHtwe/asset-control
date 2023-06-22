<template>
  <div class="content-wrapper">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Assets</h1>
          </div>
          <!-- /.col -->
        </div>
        <!-- /.row -->
      </div>
      <!-- /.container-fluid -->
    </div>
    <!-- /.content-header -->

    <!-- Main content -->
    <div class="content">
      <div class="container-fluid">
        <div class="mt-2">
          <b-card no-body>
            <b-card-header class="py-2">
              <div class="card-tools">
                <button
                  type="button"
                  class="btn btn-tool text-success"
                  @click="$router.push('/assets/create' + ($route.query.scope ? '?scope=' + $route.query.scope : ''))"
                >
                  <i class="fas fa-plus-circle" />
                </button>
                <button
                  type="button"
                  class="btn btn-tool text-warning"
                  :disabled="!asset"
                  @click="$router.push(`/assets/${asset.id}` + ($route.query.scope ? '?scope=' + $route.query.scope : ''))"
                >
                  <i class="fas fa-pencil-alt" />
                </button>
                <button
                  type="button"
                  class="btn btn-tool text-danger"
                  :disabled="!asset"
                  @click="destroy"
                >
                  <i class="fas fa-trash-alt" />
                </button>
                <button
                  type="button"
                  class="btn btn-tool text-info"
                  @click="drawAssets()"
                >
                  <i class="fas fa-sync" />
                </button>
              </div>
            </b-card-header>
            <b-card-body class="p-1">
              <b-row class="justify-content-between">
                <b-col sm="6" md="4">
                  <b-form-group class="mb-1">
                    <b-form-select
                      v-model="perpage"
                      size="sm"
                      :options="[10, 25, 50, 100]"
                      :clearable="false"
                    />
                  </b-form-group>
                </b-col>
                <b-col sm="6" md="4" offset-md="4">
                  <b-form-group class="mb-1">
                    <b-form-input
                      v-model="filter"
                      type="search"
                      size="sm"
                      placeholder="Search"
                      debounce="750"
                    />
                  </b-form-group>
                </b-col>
              </b-row>
              <b-table
                id="assets-table"
                v-contextmenu:assetsGridContextMenu
                :items="mAssets"
                :fields="assetFields"
                :outlined="true"
                :per-page="perpage"
                :sort-by.sync="sortBy"
                :sort-desc.sync="isDesc"
                :sort-direction.sync="sortDirection"
                :no-local-sorting="true"
                :busy="isBusy"
                responsive
                show-empty
                selectable
                select-mode="single"
                @row-selected="onAssetRowSelected"
                @row-dblclicked="onAssetRowDblClicked"
                @sort-changed="sortChanged"
              >
                <template #table-busy>
                  <div class="text-center my-2">
                    <b-spinner class="align-middle" />
                    <strong>Loading...</strong>
                  </div>
                </template>
                <template #cell(name)="{ item }">
                  <div style="display: table; min-width: 120px">
                    <div style="display: table-row">
                      <div
                        class="img-square elevation-2"
                        :style="`background: url(${item.photo}) center center / cover no-repeat; height: 100px; width: 100px; min-width: 100px; display: table-cell`"
                      />
                      <label
                        class="
                          pl-3
                          align-middle
                          mb-0
                          cursor-pointer
                          text-primary
                        "
                        style="display: table-cell"
                        @click="$router.push(`/assets/${item.id}` + ($route.query.scope ? '?scope=' + $route.query.scope : ''))"
                      >
                        {{ item.name }}
                      </label>
                    </div>
                  </div>
                </template>
                <template #cell(asset_locations)="data">
                  <span v-html="data.item.asset_locations"></span>
                </template>
                <template #cell(status)="data">
                  <span
                    v-if="data.item.status.toLowerCase() === 'draft'"
                    class="text-warning text-capitalize"
                  >
                    <i class="fas fa-exclamation-circle" />
                    {{ data.item.status }}
                  </span>
                  <span
                    v-else-if="data.item.status.toLowerCase() === 'disposed'"
                    class="text-danger text-capitalize"
                  >
                    <i class="fas fa-stop-circle" /> {{ data.item.status }}
                  </span>
                  <span
                    v-else
                    :class="
                      ['active'].includes(data.item.status)
                        ? 'text-success'
                        : 'text-warning'
                    "
                    class="text-capitalize"
                  >
                    <i class="fas fa-check-circle" /> {{ data.item.status }}
                  </span>
                </template>
              </b-table>
              <b-pagination
                v-model="currentPage"
                :per-page="perpage"
                :total-rows="totalrows"
                aria-controls="tblTrainers"
                align="center"
              />
            </b-card-body>
          </b-card>
        </div>
      </div>
    </div>
    <v-contextmenu ref="assetsGridContextMenu">
      <v-contextmenu-item
        class="mt-1 mb-1"
        @click="$router.push('/assets/create' + ($route.query.scope ? '?scope=' + $route.query.scope : ''))"
      >
        <i class="fas fa-plus-circle mr-1" /> Create Asset
      </v-contextmenu-item>
      <v-contextmenu-item
        class="mt-1 mb-1"
        :disabled="asset === null"
        @click="$router.push(`/assets/${asset.id}` + ($route.query.scope ? '?scope=' + $route.query.scope : ''))"
      >
        <i class="fas fa-pencil-alt mr-1" /> Edit Asset
      </v-contextmenu-item>
      <v-contextmenu-item
        class="mt-1 mb-1"
        :disabled="asset === null"
        @click="editAsset"
      >
        <i class="fas fa-pencil-alt mr-1" /> Edit Asset in New Tab
      </v-contextmenu-item>
      <v-contextmenu-item
        class="mt-1 mb-1"
        :disabled="asset === null"
        @click="destroy"
      >
        <i class="fas fa-trash mr-1" /> Delete Asset
      </v-contextmenu-item>
      <v-contextmenu-item class="mt-1 mb-1" @click="drawAssets">
        <i class="fas fa-sync mr-1" /> Refresh Assets
      </v-contextmenu-item>
      <v-contextmenu-item
        class="mt-1 mb-1"
        :disabled="asset === null"
        @click="$router.push(`/records/create?asset=${asset.id}` + ($route.query.scope ? '&scope=' + $route.query.scope : ''))"
      >
        <i class="fas fa-plus-circle mr-1" /> Add Record
      </v-contextmenu-item>
    </v-contextmenu>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  async asyncData({ $axios, route }) {
    let mAssets = []
    let totalrows = 0
    await $axios
      .$get('/api/assets' + (route.query.scope ? '?scope=' + route.query.scope : ''))
      .then((res) => {
        mAssets = res.assets
        totalrows = res.total_rows
      })
      .catch(() => {})
    return { mAssets, totalrows }
  },
  data() {
    return {
      perpage: 25,
      currentPage: 1,
      filter: '',
      sortBy: 'name',
      sortDirection: 'asc',
      isDesc: false,
      isBusy: false,
      asset: null,
      assetFields: [
        {
          key: 'name',
          class: 'w-25 text-truncate',
          sortable: true,
        },
        {
          key: 'group',
          class: 'w-15 text-truncate',
          sortable: true,
        },
        {
          key: 'quantity',
          class: 'w-10 text-truncate',
          sortable: true,
        },
        {
          key: 'asset_locations',
          label: 'Locations',
          class: 'text-truncate'
        },
      ],
    }
  },
  watch: {
    perpage() {
      this.drawAssets()
    },
    currentPage() {
      this.drawAssets()
    },
    filter() {
      this.drawAssets()
    },
  },
  mounted() {},
  methods: {
    async drawAssets() {
      this.isBusy = true
      await this.$axios
        .$get('/api/assets' + (this.$route.query.scope ? '?scope=' + this.$route.query.scope : ''), {
          params: {
            per_page: this.perpage,
            page: this.currentPage,
            filter: this.filter,
            sort_by: this.sortBy,
            sort_direction: this.sortDirection,
          },
        })
        .then((res) => {
          this.mAssets = res.assets
          this.totalrows = res.total_rows
        })
        .then(() => {
          this.isBusy = false
        })
        .catch(() => {
          this.isBusy = false
        })
    },
    editAsset () {
      // const routeData = this.$router.resolve({name: `/assets/${this.asset.id}` + (this.$route.query.scope ? '?scope=' + this.$route.query.scope : '')});
      window.open(`/assets/${this.asset.id}` + (this.$route.query.scope ? '?scope=' + this.$route.query.scope : ''), '_blank');
    },
    destroy() {
      this.$confirm({
        title: 'Confirmation',
        message: 'Are you sure want to delete?',
        button: {
          no: 'No',
          yes: 'Yes',
        },
        callback: async (confirm) => {
          if (confirm) {
            await this.$axios
              .$delete(`/api/assets/${this.asset.id}` + (this.$route.query.scope ? '?scope=' + this.$route.query.scope : ''))
              .then(() => {
                this.drawAssets()
              })
              .catch((err) => {
                if(err.response) {
                  this.$snotify.error(err.response.data.message)
                } else {
                  this.$snotify.error(err.message)
                }
              })
          }
        },
      })
    },
    onAssetRowSelected(items) {
      if (items !== null && Array.isArray(items) && items.length === 1) {
        this.asset = items[0]
      } else {
        this.asset = null
      }
    },
    onAssetRowDblClicked(item, index, event) {
      this.$router.push(`/assets/${item.id}` + (this.$route.query.scope ? '?scope=' + this.$route.query.scope : ''))
    },
    sortChanged(ctx) {
      if (this.sortBy !== ctx.sortBy) {
        this.isDesc = false
        this.sortDirection = 'asc'
      } else {
        this.sortDirection = ctx.sortDesc ? 'desc' : 'asc'
      }
      this.sortBy = ctx.sortBy

      this.drawAssets()
    },
  },
}
</script>
