<template>
  <div class="content-wrapper">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Records</h1>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>
    <!-- /.content-header -->

    <!-- Main content -->
    <div class="content">
      <div class="container-fluid">
        <div class="mt-2">
          <b-card no-body>
            <b-card-header class="py-2">
              <div class="card-tools">
                <button type="button" class="btn btn-tool text-success" @click="$router.push('/records/create' + ($route.query.scope ? '?scope=' + $route.query.scope : ''))">
                  <i class="fas fa-plus-circle" />
                </button>
                <button type="button" class="btn btn-tool text-warning" :disabled="!record" @click="$router.push(`/records/${record.id}` + ($route.query.scope ? '?scope=' + $route.query.scope : ''))">
                  <i class="fas fa-pencil-alt" />
                </button>
                <button type="button" class="btn btn-tool text-danger" :disabled="!record" @click="destroy">
                  <i class="fas fa-trash-alt" />
                </button>
                <button type="button" class="btn btn-tool text-info" @click="drawRecords()">
                  <i class="fas fa-sync" />
                </button>
              </div>
            </b-card-header>
            <b-card-body class="p-1">
              <b-row>
                <b-col sm="6" md="4">
                  <b-form-group class="mb-1">
                    <b-form-select v-model="perpage" size="sm" :options="[10, 25, 50, 100]" :clearable="false" />
                  </b-form-group>
                </b-col>
                <b-col sm="6" md="4" offset-md="4">
                  <b-form-group class="mb-1">
                    <b-form-input v-model="filter" type="search" size="sm" placeholder="Search" debounce="750" />
                  </b-form-group>
                </b-col>
              </b-row>
              <b-table
                id="records-table"
                v-contextmenu:recordsGridContextMenu
                :items="mRecords"
                :fields="recordFields"
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
                @row-selected="onRecordRowSelected"
                @row-dblclicked="onRecordRowDblClicked"
                @sort-changed="sortChanged"
              >
                <template #table-busy>
                  <div class="text-center my-2">
                    <b-spinner class="align-middle" />
                    <strong>Loading...</strong>
                  </div>
                </template>
                <template #cell(movement_type)="data">
                  <span class="text-capitalize">
                    {{ data.item.movement_type }}
                  </span>
                </template>
                <template #cell(record_date)="data">
                  <span>
                    {{ intl.formatDate(typeof data.item.record_date === 'string' ? new Date(data.item.record_date) : date, { format : 'dd MMM yyyy HH:mm' }) }}
                  </span>
                </template>
              </b-table>
              <b-pagination v-model="currentPage" :per-page="perpage" :total-rows="totalrows" aria-controls="tblTrainers" align="center" />
            </b-card-body>
          </b-card>
        </div>
      </div>
    </div>
    <v-contextmenu ref="recordsGridContextMenu">
      <v-contextmenu-item
        class="mt-1 mb-1"
        @click="$router.push('/records/create' + ($route.query.scope ? '?scope=' + $route.query.scope : ''))"
      >
        <i class="fas fa-plus-circle mr-1" /> Create Record
      </v-contextmenu-item>
      <v-contextmenu-item
        class="mt-1 mb-1"
        :disabled="record === null"
        @click="$router.push(`/records/${record.id}` + ($route.query.scope ? '?scope=' + $route.query.scope : ''))"
      >
        <i class="fas fa-pencil-alt mr-1" /> Edit Record
      </v-contextmenu-item>
      <v-contextmenu-item
        class="mt-1 mb-1"
        :disabled="record === null"
        @click="destroy"
      >
        <i class="fas fa-trash mr-1" /> Delete Record
      </v-contextmenu-item>
      <v-contextmenu-item
        class="mt-1 mb-1"
        @click="drawRecords"
      >
        <i class="fas fa-sync mr-1" /> Refresh Records
      </v-contextmenu-item>
    </v-contextmenu>
  </div>
</template>

<script>
import { Internationalization } from '@syncfusion/ej2-base'
export default {
  name: 'IndexPage',
  async asyncData ({ $axios, route }) {
    let mRecords = []
    let totalrows = 0
    await $axios.$get('/api/movements' + (route.query.scope ? '?scope=' + route.query.scope : ''))
      .then((res) => {
        mRecords = res.movements
        totalrows = res.total_rows
      })
      .catch(() => {})
    return { mRecords, totalrows }
  },
  data () {
    return {
      intl: new Internationalization(),
      perpage: 25,
      currentPage: 1,
      filter: '',
      sortBy: 'record_date',
      sortDirection: 'desc',
      isDesc: false,
      isBusy: false,
      record: null,
      recordFields: [
        {
          key: 'record_date',
          class: 'w-25 text-truncate',
          sortable: true
        },
        {
          key: 'asset.name',
          class: 'w-15 text-truncate',
          sortable: true,
          label: 'Asset'
        },
        {
          key: 'location.name',
          class: 'w-10 text-truncate',
          sortable: true,
          label: 'Location'
        },
        {
          key: 'movement_type',
          class: 'w-10 text-nowrap',
          sortable: true,
          label: 'Type'
        },
        {
          key: 'quantity',
          class: 'w-10 text-nowrap',
          sortable: true
        }
      ]
    }
  },
  watch: {
    perpage () {
      this.drawRecords()
    },
    currentPage () {
      this.drawRecords()
    },
    filter () {
      this.drawRecords()
    }
  },
  mounted () {
  },
  methods: {
    async drawRecords () {
      this.isBusy = true
      await this.$axios.$get('/api/movements' + (this.$route.query.scope ? '?scope=' + this.$route.query.scope : ''), {
        params: {
          per_page: this.perpage,
          page: this.currentPage,
          filter: this.filter,
          sort_by: this.sortBy,
          sort_direction: this.sortDirection
        }
      })
        .then((res) => {
          this.mRecords = res.movements
          this.totalrows = res.total_rows
        }).then(() => {
          this.isBusy = false
        })
        .catch(() => {
          this.isBusy = false
        })
    },
    destroy () {
      this.$confirm({
        title: 'Confirmation',
        message: 'Are you sure want to delete?',
        button: {
          no: 'No',
          yes: 'Yes'
        },
        callback: async (confirm) => {
          if (confirm) {
            await this.$axios.$delete(`/api/movements/${this.record.id}` + (this.$route.query.scope ? '?scope=' + this.$route.query.scope : ''))
              .then(() => {
                this.drawRecords()
              })
              .catch((err) => {
                if(err.response) {
                  this.$snotify.error(err.response.data.message)
                } else {
                  this.$snotify.error(err.message)
                }
              })
          }
        }
      })
    },
    onRecordRowSelected (items) {
      if (items !== null && Array.isArray(items) && items.length === 1) {
        this.record = items[0]
      } else {
        this.record = null
      }
    },
    onRecordRowDblClicked (item, index, event) {
      this.$router.push(`/records/${item.id}` + (this.$route.query.scope ? '?scope=' + this.$route.query.scope : ''))
    },
    sortChanged (ctx) {
      if (this.sortBy !== ctx.sortBy) {
        this.isDesc = false
        this.sortDirection = 'asc'
      } else {
        this.sortDirection = ctx.sortDesc ? 'desc' : 'asc'
      }
      this.sortBy = ctx.sortBy

      this.drawRecords()
    }
  }
}
</script>
