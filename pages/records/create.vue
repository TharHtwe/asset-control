<template>
  <div class="content-wrapper">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Records</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><b-link @click="$router.push('/' + ($route.query.scope ? '?scope=' + $route.query.scope : ''))">Home</b-link></li>
              <li class="breadcrumb-item"><b-link @click="$router.push('/records' + ($route.query.scope ? '?scope=' + $route.query.scope : ''))">Records</b-link></li>
              <li class="breadcrumb-item active">Create</li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>
    <!-- /.content-header -->

    <!-- Main content -->
    <div class="content">
      <div class="container-fluid">
        <b-card no-body :class="['card-primary card-outline', screenWidth < 576 ? 'p-1' : 'p-3']">
        <b-row>
          <b-col class="mt-3">
            <b-form-group :label="float_label ? null : 'Date'" :label-cols-sm="float_label ? null : 2">
              <span :class="float_label ? 'has-float-label' : null">
                <b-form-datepicker
                  v-model.trim="$v.form.record.record_date.$model"
                  :disabled="form.processing"
                  :state="(form.submitted && !form.processing) ? !$v.form.record.record_date.$error : null"
                  placeholder=""
                  name="recordDate"
                />
                <span v-if="float_label">Date</span>
              </span>
            </b-form-group>
            <b-form-group :label="float_label ? null : 'Asset'" :label-cols-sm="float_label ? null : 2">
              <span :class="float_label ? 'has-float-label' : null">
                <v-select
                  v-model="$v.form.record.asset_id.$model"
                  label="name"
                  class="style-chooser"
                  :options="paginated"
                  :filterable="false"
                  :reduce="asset => asset.id"
                  :enabled="!form.processing"
                  :state="(form.submitted && !form.processing) ? !$v.form.record.asset_id.$error : null"
                  @search="onSearch"
                >
                  <template #option="option">
                    <div style="display: table; min-width: 120px;background: transparent;">
                      <div style="display: table-row">
                        <div class="img-square elevation-2" :style="`background: url(${option.photo}) center center / cover no-repeat; height: 100px; width: 100px; display: table-cell`" />
                        <label class="pl-3 align-middle mb-0 cursor-pointer text-primary" style="display: table-cell">
                          {{ option.name }}
                        </label>
                      </div>
                    </div>
                  </template>
                  <template #selected-option="{ name }">
                    <span style="background: transparent;">{{ name }}</span>
                  </template>
                  <b-row slot="list-footer">
                    <b-col>
                      <b-button block size="sm" variant="primary" :disabled="!hasPrevPage" @click="offset -= limit">Prev</b-button>
                    </b-col>
                    <b-col>
                      <b-button block size="sm" variant="primary" :disabled="!hasNextPage" @click="offset += limit">Next</b-button>
                    </b-col>
                  </b-row>
                </v-select>
                <span v-if="float_label">Asset</span>
              </span>
            </b-form-group>
            <b-form-group :label="float_label ? null : 'Location'" :label-cols-sm="float_label ? null : 2">
              <span :class="float_label ? 'has-float-label' : null">
                <b-form-select
                  v-model="$v.form.record.location_id.$model"
                  :enabled="!form.processing"
                  :options="mLocations"
                  value-field="id"
                  text-field="name"
                  :state="(form.submitted && !form.processing) ? !$v.form.record.location_id.$error : null"
                />
                <span v-if="float_label">Location</span>
              </span>
            </b-form-group>
            <b-form-group :label="float_label ? null : 'Type'" :label-cols-sm="float_label ? null : 2">
              <span :class="float_label ? 'has-float-label' : null">
                <b-form-select
                  v-model="$v.form.record.movement_type.$model"
                  :enabled="!form.processing"
                  :options="types"
                  value-field="value"
                  text-field="name"
                  :state="(form.submitted && !form.processing) ? !$v.form.record.movement_type.$error : null"
                />
                <span v-if="float_label">Type</span>
              </span>
            </b-form-group>
            <b-form-group :label="float_label ? null : 'Quantity'" :label-cols-sm="float_label ? null : 2">
              <span :class="float_label ? 'has-float-label' : null">
                <b-form-input
                  v-model.trim="$v.form.record.quantity.$model"
                  type="number"
                  step="1"
                  min="1"
                  :disabled="form.processing"
                  :state="(form.submitted && !form.processing) ? !$v.form.record.quantity.$error : null"
                />
                <span v-if="float_label">Quantity</span>
              </span>
            </b-form-group>
            <b-form-group :label="float_label ? null : 'Remark'" :label-cols-sm="float_label ? null : 2">
              <span :class="float_label ? 'has-float-label' : null">
                <b-form-textarea
                  v-model.trim="form.record.remark"
                  rows="2"
                  max-rows="3"
                  :disabled="form.processing"
                />
                <span v-if="float_label">Remark</span>
              </span>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-radio-group
              v-model="record_by"
              stacked
              :options="[{text: 'Record by Location', value: 'location'}, {text: 'Record by Asset', value: 'asset'}]"
            ></b-form-radio-group>
          </b-col>
          <b-col class="text-right">
            <b-button variant="warning" :disabled="form.uploading || form.processing" @click="cancelSaveRecord()">
              Cancel
            </b-button>
            <b-button variant="primary" :disabled="form.uploading || form.processing" @click="saveRecord('')">
              Save
            </b-button>
            <b-button variant="primary" :disabled="form.uploading || form.processing" @click="saveRecord('new')">
              Save & New
            </b-button>
          </b-col>
        </b-row>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
const {
  required, minValue
} = require('vuelidate/lib/validators')
export default {
  name: 'CreateRecord',
  async asyncData({ $store, $axios, route }) {
    let mAssets = []
    let mLocations = []
    await $axios.$get('/api/movements/create' + (route.query.scope ? '?scope=' + route.query.scope : ''))
      .then((res) => {
        mAssets = res.assets
        mLocations = res.locations
      })
      .catch(() => {})
    return { mAssets, mLocations }
  },
  data () {
    return {
      screenWidth: window.innerWidth,
      submitted: false,
      processing: false,
      search: '',
      offset: 0,
      limit: 5,
      record_by: 'location',
      form: {
        submitted: false,
        processing: false,
        record: {
          id: 0,
          record_date: new Date(),
          asset_id: null,
          location_id: null,
          to_location_id: null,
          movement_type: 'opening',
          quantity: 1,
          remark: null
        }
      },
      types: [{ name: 'Opening', value: 'opening' }, { name: 'Moved', value: 'moved' }, { name: 'Disposed', value: 'disposed' }],
    }
  },
  validations: {
    form: {
      record: {
        record_date: {
          required
        },
        asset_id: {
          required
        },
        location_id: {
          required
        },
        movement_type: {
          required
        },
        quantity: {
          required,
          minValue: minValue(1)
        }
      }
    }
  },
  computed: {
    float_label: {
      get () {
        return this.$store.state.theme.float_label
      }
    },
    filtered() {
      return this.mAssets.filter((asset) =>
        asset.name.toLocaleLowerCase().includes(this.search.toLocaleLowerCase())
      )
    },
    paginated() {
      return this.filtered.slice(this.offset, this.limit + this.offset)
    },
    hasNextPage() {
      const nextOffset = this.offset + this.limit
      return Boolean(
        this.filtered.slice(nextOffset, this.limit + nextOffset).length
      )
    },
    hasPrevPage() {
      const prevOffset = this.offset - this.limit
      return Boolean(
        this.filtered.slice(prevOffset, this.limit + prevOffset).length
      )
    },
  },
  watch: {
  },
  mounted () {
    if(this.$route.query.asset) {
      this.form.record.asset_id = parseInt(this.$route.query.asset)
    }
  },
  methods: {
    async saveRecord (status) {
      this.form.submitted = true
      this.$v.form.record.$touch()
      if (!this.$v.form.record.$anyError) {
        this.form.processing = true
        this.form.record.record_date = new Date(this.$helper.getDate(this.form.record.record_date) + ' ' + this.$helper.getTime(new Date()))
        await this.$axios.$post(`/api/movements` + (this.$route.query.scope ? '?scope=' + this.$route.query.scope : ''), { data: JSON.stringify(this.form.record) })
          .then((res) => {
            if (status === 'new') {
              this.$snotify.success('Saved successfully.')
              this.reset()
            } else {
              this.$router.push('/records' + (this.$route.query.scope ? '?scope=' + this.$route.query.scope : ''))
            }
          })
          .catch((err) => {
            this.form.processing = false
            if(err.response) {
              this.$snotify.error(err.response.data.message)
            } else {
              this.$snotify.error(err.message)
            }
          })
      }
    },
    cancelSaveRecord () {
      this.$confirm({
        title: 'Confirmation',
        message: 'Are you sure want to leave?',
        button: {
          no: 'No',
          yes: 'Yes'
        },
        callback: (confirm) => {
          if (confirm) {
            this.$router.push('/records' + (this.$route.query.scope ? '?scope=' + this.$route.query.scope : ''))
          }
        }
      })
    },
    onSearch(query) {
      this.search = query
      this.offset = 0
    },
    reset () {
      this.form.processing = false
      this.form.submitted = false
      this.form.record.id = 0
      if (this.record_by === 'location') {
        this.form.record.asset_id = null
      } else {
        this.form.record.location_id = null
      }
      this.form.quantity = 1
      this.form.remark = null
    }
  }
}
</script>

<style lang="scss" scoped>
// .dark-mode .vs--single,
// .dark-mode .vs--searchable,
// .dark-mode .vs__dropdown-toggle,
// .vs__selected-options,
// .vs__search,
// .vs__dropdown-menu {
//   background: #ec7607 !important;
// }
ul {
  background: #ec7607 !important;
  background-color: #ec7607 !important;
}
.style-chooser .vs__search::placeholder,
.style-chooser .vs__dropdown-toggle,
.style-chooser .vs__dropdown-menu {
  background: #dfe5fb;
  border: none;
  color: #394066;
  text-transform: lowercase;
  font-variant: small-caps;
}
.v-select ul {
  background: green;
}
.v-select li {
  background: green;
}
</style>
