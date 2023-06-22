<template>
  <div class="content-wrapper">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Locations</h1>
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
                <button type="button" class="btn btn-tool text-success" @click="addLocation">
                  <i class="fas fa-plus-circle" />
                </button>
                <button type="button" class="btn btn-tool text-warning" :disabled="!location" @click="editLocation">
                  <i class="fas fa-pencil-alt" />
                </button>
                <button type="button" class="btn btn-tool text-danger" :disabled="!location" @click="destroy">
                  <i class="fas fa-trash-alt" />
                </button>
                <button type="button" class="btn btn-tool text-info" @click="drawLocations()">
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
                id="locations-table"
                :items="mLocations"
                :fields="locationFields"
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
                @row-selected="onLocationRowSelected"
                @row-dblclicked="onLocationRowDblClicked"
                @sort-changed="sortChanged"
              >
                <template #table-busy>
                  <div class="text-center my-2">
                    <b-spinner class="align-middle" />
                    <strong>Loading...</strong>
                  </div>
                </template>
              </b-table>
              <b-pagination v-model="currentPage" :per-page="perpage" :total-rows="totalrows" aria-controls="tblTrainers" align="center" />
            </b-card-body>
          </b-card>
        </div>
      </div>
    </div>
    <b-modal
      id="locationEditor"
      :title="(form.id === 0 || location === null) ? `Create Location` : `Edit Location`"
      no-close-on-backdrop
      size="lg"
      ok-title="Save"
      @ok="saveLocation"
    >
      <b-form-group :label="float_label ? null : 'Name'" :label-cols-sm="float_label ? null : 2">
        <span :class="float_label ? 'has-float-label' : null">
          <b-form-input
            v-model.trim="$v.form.location.name.$model"
            :disabled="form.processing"
            :state="(form.submitted && !form.processing) ? !$v.form.location.name.$error : null"
          />
          <span v-if="float_label">Name</span>
        </span>
      </b-form-group>
    </b-modal>
  </div>
</template>

<script>
const {
  required
} = require('vuelidate/lib/validators')
export default {
  name: 'LocationHome',
  async asyncData ({ $axios }) {
    let mLocations = []
    let totalrows = 0
    await $axios.$get('/api/locations')
      .then((res) => {
        mLocations = res.locations
        totalrows = res.total_rows
      })
      .catch(() => {})
    return { mLocations, totalrows }
  },
  data () {
    return {
      perpage: 25,
      currentPage: 1,
      filter: '',
      sortBy: 'name',
      sortDirection: 'asc',
      isDesc: false,
      isBusy: false,
      location: null,
      form: {
        submitted: false,
        processing: false,
        location: {
          id: 0,
          branch_id: 1,
          name: null
        }
      },
      locationFields: [
        {
          key: 'name',
          class: 'w-25 text-truncate',
          sortable: true
        }
      ]
    }
  },
  validations: {
    form: {
      location: {
        name: {
          required
        }
      }
    }
  },
  computed: {
    float_label: {
      get () {
        return this.$store.state.theme.float_label
      }
    }
  },
  watch: {
    perpage () {
      this.drawLocations()
    },
    currentPage () {
      this.drawLocations()
    },
    filter () {
      this.drawLocations()
    }
  },
  mounted () {
  },
  methods: {
    async drawLocations () {
      this.isBusy = true
      await this.$axios.$get('/api/locations', {
        params: {
          per_page: this.perpage,
          page: this.currentPage,
          filter: this.filter,
          sort_by: this.sortBy,
          sort_direction: this.sortDirection
        }
      })
        .then((res) => {
          this.mLocations = res.locations
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
            await this.$axios.$delete(`/api/locations/${this.location.id}`)
              .then(() => {
                const index = this.mLocations.findIndex(e => e.id === this.location.id)
                this.mLocations.splice(index, 1)
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
    onLocationRowSelected (items) {
      if (items !== null && Array.isArray(items) && items.length === 1) {
        this.location = items[0]
      } else {
        this.location = null
      }
    },
    onLocationRowDblClicked (item, index, event) {
      this.editLocation()
    },
    sortChanged (ctx) {
      if (this.sortBy !== ctx.sortBy) {
        this.isDesc = false
        this.sortDirection = 'asc'
      } else {
        this.sortDirection = ctx.sortDesc ? 'desc' : 'asc'
      }
      this.sortBy = ctx.sortBy

      this.drawLocations()
    },
    addLocation () {
      this.resetForm()
      this.$bvModal.show('locationEditor')
    },
    editLocation () {
      if (this.location !== null) {
        this.fillForm()
        this.$bvModal.show('locationEditor')
      }
    },
    async saveLocation (e) {
      e.preventDefault()
      this.form.submitted = true
      this.$v.form.location.$touch()
      if (!this.$v.form.location.$anyError) {
        this.form.processing = true
        if (this.form.location.id === 0) {
          await this.$axios.$post(`/api/locations`, { data: JSON.stringify(this.form.location) })
            .then((res) => {
              this.drawLocations()
            })
            .then(() => { this.$bvModal.hide('locationEditor') })
            .catch((err) => {
              if(err.response) {
                this.$snotify.error(err.response.data.message)
              } else {
                this.$snotify.error(err.message)
              }
            })
            this.form.processing = false
        } else {
          await this.$axios.$put(`/api/locations/${this.location.id}`, { data: JSON.stringify(this.form.location) })
            .then((res) => {
              this.drawLocations()
            })
            .then(() => { this.$bvModal.hide('locationEditor') })
            .catch((err) => {
              if(err.response) {
                this.$snotify.error(err.response.data.message)
              } else {
                this.$snotify.error(err.message)
              }
            })
            this.form.processing = false
        }
      }
    },
    resetForm () {
      this.form.submitted = false
      this.form.location.id = 0
      this.form.location.branch_id = 1
      this.form.location.name = null
    },
    fillForm () {
      if (this.location !== null) {
        this.form.location.id = this.location.id
        this.form.location.branch_id = this.location.branch_id
        this.form.location.name = this.location.name
      }
    }
  }
}
</script>
