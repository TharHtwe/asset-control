<template>
  <div class="content-wrapper">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Assets</h1>
          </div>
          <!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item">
                <b-link @click="$router.push('/' + ($route.query.scope ? '?scope=' + $route.query.scope : ''))">Home</b-link>
              </li>
              <li class="breadcrumb-item">
                <b-link @click="$router.push('/' + ($route.query.scope ? '?scope=' + $route.query.scope : ''))">Assets</b-link>
              </li>
              <li class="breadcrumb-item active">{{ label }}</li>
            </ol>
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
        <b-card
          no-body
          :class="[
            'card-primary card-outline',
            screenWidth < 576 ? 'p-1' : 'p-3',
          ]"
        >
          <b-row>
            <b-col sm="4" class="mt-3">
              <b-form-group class="mb-0">
                <div class="avatar-upload">
                  <div class="avatar-edit">
                    <b-form-file
                      id="avatar-input"
                      v-model="photo"
                      plain
                      type="file"
                      accept="image/*"
                      :disabled="processing"
                    />
                    <label
                      id="avatar-input-label"
                      :class="[
                        'fas fa-pencil-alt',
                        form.asset.photo ? 'd-none' : 'd-block',
                      ]"
                      for="avatar-input"
                    />
                    <label
                      id="avatar-remove-label"
                      :class="[
                        'fas fa-times avatar-remove',
                        form.asset.photo ? 'd-block' : 'd-none',
                      ]"
                      @click="form.asset.photo = null"
                    />
                  </div>
                  <div class="avatar-preview">
                    <div
                      id="avatarPreview"
                      :style="
                        form.asset.photo
                          ? `background-image: url('${form.asset.photo}')`
                          : `background-image: url()`
                      "
                    />
                  </div>
                  <div class="text-center mt-3">
                    <label>Image</label> (256 x 256)
                  </div>
                </div>
              </b-form-group>
            </b-col>
            <b-col sm="8" class="mt-3">
              <b-form-group
                :label="float_label ? null : 'Code'"
                :label-cols-sm="float_label ? null : 2"
              >
                <span :class="float_label ? 'has-float-label' : null">
                  <b-form-input
                    v-model.trim="form.asset.code"
                    :disabled="form.processing"
                  />
                  <span v-if="float_label">Code</span>
                </span>
              </b-form-group>
              <b-form-group
                :label="float_label ? null : 'Name'"
                :label-cols-sm="float_label ? null : 2"
              >
                <span :class="float_label ? 'has-float-label' : null">
                  <b-form-input
                    v-model.trim="$v.form.asset.name.$model"
                    :disabled="form.processing"
                    :state="
                      form.submitted && !form.processing
                        ? !$v.form.asset.name.$error
                        : null
                    "
                  />
                  <span v-if="float_label">Name</span>
                </span>
              </b-form-group>
              <b-form-group
                :label="float_label ? null : 'Group'"
                :label-cols-sm="float_label ? null : 2"
              >
                <span :class="float_label ? 'has-float-label' : null">
                  <v-select
                    v-model="form.asset.group"
                    :options="mAssetGroups"
                    label="group"
                    taggable
                    :reduce="(group) => group.group"
                    :create-option="(group) => ({ group: group })"
                  />
                  <!-- <v-select
                  v-model="form.asset.group"
                  :options="mAssetGroups"
                  label="group"
                  multiple
                  taggable
                  push-tags
                  :reduce="group => group.group"
                  :selectable="() => form.asset.group.length < 3"
                /> -->
                  <span v-if="float_label">Group</span>
                </span>
              </b-form-group>
              <b-form-group
                :label="float_label ? null : 'Serial No'"
                :label-cols-sm="float_label ? null : 2"
              >
                <span :class="float_label ? 'has-float-label' : null">
                  <b-form-input
                    v-model.trim="form.asset.serial_no"
                    autocomplete="off"
                    :disabled="form.processing"
                  />
                  <span v-if="float_label">Serial No</span>
                </span>
              </b-form-group>
              <b-form-group
                :label="float_label ? null : 'Details'"
                :label-cols-sm="float_label ? null : 2"
              >
                <span :class="float_label ? 'has-float-label' : null">
                  <b-form-textarea
                    v-model.trim="form.asset.details"
                    rows="2"
                    max-rows="3"
                    :disabled="form.processing"
                  />
                  <span v-if="float_label">Details</span>
                </span>
              </b-form-group>
              <b-form-group
                :label="float_label ? null : 'Status'"
                :label-cols-sm="float_label ? null : 2"
              >
                <span :class="float_label ? 'has-float-label' : null">
                  <b-form-select
                    v-model="$v.form.asset.status.$model"
                    :enabled="!form.processing"
                    :options="statuses"
                    value-field="value"
                    text-field="name"
                    :state="
                      form.submitted && !form.processing
                        ? !$v.form.asset.status.$error
                        : null
                    "
                  />
                  <span v-if="float_label">Status</span>
                </span>
              </b-form-group>
              <b-row
                cols="1"
                cols-sm="2"
                align-h="start"
                align-v="center"
                class="mb-2"
                >
                <b-col sm="auto">
                  <b-form-checkbox v-model="form.asset.summarize_by_group">
                    Summarize by
                  </b-form-checkbox>
                </b-col>
                <b-col sm="auto">
                  <b-form-input
                    v-model.trim="$v.form.asset.summarize_by.$model"
                    :placeholder="form.asset.group"
                    :disabled="form.processing"
                    :state="
                      form.submitted && !form.processing
                        ? !$v.form.asset.summarize_by.$error
                        : null
                    "/>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="text-right">
              <b-button
                variant="warning"
                :disabled="form.uploading || form.processing"
                @click="cancelSaveAsset()"
              >
                Cancel
              </b-button>
              <b-button
                variant="primary"
                :disabled="form.uploading || form.processing"
                @click="saveAsset('active')"
              >
                Save
              </b-button>
              <b-button
                variant="success"
                :disabled="
                  form.uploading || form.processing || form.asset.id === 0
                "
                @click="resetAssetForm"
              >
                New
              </b-button>
            </b-col>
          </b-row>
          <div>
            <b-tabs class="mt-2">
              <b-tab active title="Records">
                <b-card no-body>
                  <b-card-header class="py-2">
                    <div class="card-tools">
                      <button
                        type="button"
                        :disabled="form.asset.id === 0"
                        class="btn btn-tool text-success"
                        @click="addRecord"
                      >
                        <i class="fas fa-plus-circle" />
                      </button>
                      <button
                        type="button"
                        class="btn btn-tool text-warning"
                        :disabled="!record"
                        @click="editRecord"
                      >
                        <i class="fas fa-pencil-alt" />
                      </button>
                      <button
                        type="button"
                        class="btn btn-tool text-danger"
                        :disabled="!record"
                        @click="destroy"
                      >
                        <i class="fas fa-trash-alt" />
                      </button>
                      <button
                        type="button"
                        class="btn btn-tool text-info"
                        @click="drawRecords()"
                      >
                        <i class="fas fa-sync" />
                      </button>
                    </div>
                  </b-card-header>
                  <b-card-body class="p-1">
                    <b-row>
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
                      :items="form.records"
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
                          {{
                            intl.formatDate(
                              typeof data.item.record_date === 'string'
                                ? new Date(data.item.record_date)
                                : date,
                              { format: 'dd MMM yyyy HH:mm' }
                            )
                          }}
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
              </b-tab>
            </b-tabs>
          </div>
        </b-card>
      </div>
    </div>
    <b-modal
      id="recordEditor"
      size="lg"
      :title="form.record.id === 0 ? `Create Record` : `Edit Record`"
      no-close-on-backdrop
      ok-title="Save"
      @ok="saveRecord"
    >
      <b-form-group
        :label="float_label ? null : 'Date'"
        :label-cols-sm="float_label ? null : 2"
      >
        <span :class="float_label ? 'has-float-label' : null">
          <b-form-datepicker
            v-model.trim="$v.form.record.record_date.$model"
            :disabled="form.processing"
            :state="
              form.submitted && !form.processing
                ? !$v.form.record.record_date.$error
                : null
            "
            placeholder=""
            name="recordDate"
            value-as-date
          />
          <span v-if="float_label">Date</span>
        </span>
      </b-form-group>
      <b-form-group
        :label="float_label ? null : 'Location'"
        :label-cols-sm="float_label ? null : 2"
      >
        <span :class="float_label ? 'has-float-label' : null">
          <b-form-select
            v-model="$v.form.record.location_id.$model"
            :enabled="!form.processing"
            :options="mLocations"
            value-field="id"
            text-field="name"
            :state="
              form.submitted && !form.processing
                ? !$v.form.record.location_id.$error
                : null
            "
          />
          <span v-if="float_label">Location</span>
        </span>
      </b-form-group>
      <b-form-group
        :label="float_label ? null : 'Type'"
        :label-cols-sm="float_label ? null : 2"
      >
        <span :class="float_label ? 'has-float-label' : null">
          <b-form-select
            v-model="$v.form.record.movement_type.$model"
            :enabled="!form.processing"
            :options="types"
            value-field="value"
            text-field="name"
            :state="
              form.submitted && !form.processing
                ? !$v.form.record.movement_type.$error
                : null
            "
          />
          <span v-if="float_label">Type</span>
        </span>
      </b-form-group>
      <b-form-group
        :label="float_label ? null : 'Quantity'"
        :label-cols-sm="float_label ? null : 2"
      >
        <span :class="float_label ? 'has-float-label' : null">
          <b-form-input
            v-model.trim="$v.form.record.quantity.$model"
            type="number"
            step="1"
            min="1"
            :disabled="form.processing"
            :state="
              form.submitted && !form.processing
                ? !$v.form.record.quantity.$error
                : null
            "
          />
          <span v-if="float_label">Quantity</span>
        </span>
      </b-form-group>
      <b-form-group
        :label="float_label ? null : 'Remark'"
        :label-cols-sm="float_label ? null : 2"
      >
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
    </b-modal>
    <b-modal
      id="avatar-edit"
      size="lg"
      title="Crop Image"
      no-close-on-backdrop
      ok-title="Crop Image"
      @ok="cropAvatar"
      @shown="initCropper"
      @hidden="destroyCropper"
    >
      <div class="img-container">
        <img id="avatar-image" alt="Picture" />
      </div>
    </b-modal>
  </div>
</template>

<script>
import { Internationalization } from '@syncfusion/ej2-base'
import Cropper from 'cropperjs/src/index'
import 'cropperjs/dist/cropper.min.css'
const { required, minValue, requiredIf } = require('vuelidate/lib/validators')
export default {
  name: 'CreateAsset',
  async asyncData({ $store, $axios, route }) {
    let mAssetGroups = []
    let mLocations = []
    await $axios
      .$get('/api/assets/create' + (route.query.scope ? '?scope=' + route.query.scope : ''))
      .then((res) => {
        mAssetGroups = res.groups
        mLocations = res.locations
      })
      .catch(() => {})
    return { mAssetGroups, mLocations }
  },
  data() {
    return {
      screenWidth: window.innerWidth,
      submitted: false,
      processing: false,
      intl: new Internationalization(),
      perpage: 25,
      currentPage: 1,
      filter: '',
      sortBy: 'record_date',
      sortDirection: 'desc',
      isDesc: false,
      isBusy: false,
      totalrows: 0,
      photo: null,
      cropper: null,
      record: null,
      label: 'Create',
      form: {
        submitted: false,
        processing: false,
        records: [],
        asset: {
          id: 0,
          name: null,
          group: null,
          photo: null,
          serial_no: null,
          details: null,
          warranty_end: null,
          status: 'active',
          summarize_by_group: false,
          summarize_by: null
        },
        record: {
          asset_id: 0,
          record_date: new Date(),
          location_id: null,
          to_location_id: null,
          movement_type: 'opening',
          quantity: 1,
          remark: null,
        },
      },
      recordFields: [
        {
          key: 'record_date',
          class: 'w-10 text-truncate',
          sortable: true,
        },
        {
          key: 'location.name',
          class: 'w-10 text-truncate',
          sortable: true,
          label: 'Location',
        },
        {
          key: 'quantity',
          class: 'w-10 text-nowrap',
          sortable: true,
        },
        {
          key: 'remark',
          class: 'w-10 text-nowrap',
        },
      ],
      statuses: [
        { name: 'Active', value: 'active' },
        { name: 'Repairing', value: 'repairing' },
        { name: 'Disposed', value: 'disposed' },
      ],
      types: [
        { name: 'Opening', value: 'opening' },
        { name: 'Moved', value: 'moved' },
        { name: 'Disposed', value: 'disposed' },
      ],
    }
  },
  validations: {
    form: {
      asset: {
        name: {
          required,
        },
        summarize_by: {
          required: requiredIf(function () {
            return this.form.asset.summarize_by_group && !this.form.asset.summarize_by && !this.form.asset.group
          })
        },
        status: {
          required,
        },
      },
      record: {
        record_date: {
          required,
        },
        location_id: {
          required,
        },
        movement_type: {
          required,
        },
        quantity: {
          required,
          minValue: minValue(1),
        },
      },
    },
  },
  computed: {
    float_label: {
      get() {
        return this.$store.state.theme.float_label
      },
    }
  },
  watch: {
    async photo(file) {
      if (file !== null) {
        if (file.size / 1024 / 1024 > 10) {
          this.$snotify.warning('Image file size must be less than 10MB.')
          this.photo = null
          return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
          document.getElementById('avatar-image').src = e.target.result
        }
        await reader.readAsDataURL(file)
        this.$bvModal.show('avatar-edit')
      }
    },
    'form.asset.photo'(img) {
      if (img !== null) {
        document.getElementById(
          'avatarPreview'
        ).style.backgroundImage = `url('${img}')`
        document.getElementById('avatar-input-label').style.display = 'none'
        document.getElementById('avatar-remove-label').style.display = 'block'
      } else {
        document.getElementById(
          'avatarPreview'
        ).style.backgroundImage = `url('${this.form.asset.photo}')`
        document.getElementById('avatar-input-label').style.display = 'block'
        document.getElementById('avatar-remove-label').style.display = 'none'
      }
    },
    processing(val) {
      if (val) {
        this.$nuxt.$loading.start()
      } else {
        this.$nuxt.$loading.finish()
      }
    },
  },
  mounted() {},
  methods: {
    async saveAsset(status) {
      this.form.submitted = true
      this.$v.form.asset.$touch()
      if (!this.$v.form.asset.$anyError) {
        this.form.processing = true
        if (this.form.asset.id === 0) {
          await this.$axios
            .$post(`/api/assets` + (this.$route.query.scope ? '?scope=' + this.$route.query.scope : ''), { data: JSON.stringify(this.form.asset) })
            .then((res) => {
              this.label = 'Edit'
              this.form.asset.id = res.asset.id
            })
            .then(() => {
              this.form.processing = false
              this.form.submitted = false
              this.$snotify.success('Saved successfully.')
            })
            .catch((err) => {
              this.form.processing = false
              if(err.response) {
                this.$snotify.error(err.response.data.message)
              } else {
                this.$snotify.error(err.message)
              }
            })
        } else {
          await this.$axios
            .$put(`/api/assets/${this.form.asset.id}` + (this.$route.query.scope ? '?scope=' + this.$route.query.scope : ''), {
              data: JSON.stringify(this.form.asset),
            })
            .then(() => {
              this.form.processing = false
              this.form.submitted = false
              this.$snotify.success('Updated successfully.')
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
      }
    },
    cancelSaveAsset() {
      this.$confirm({
        title: 'Confirmation',
        message: 'Are you sure want to leave?',
        button: {
          no: 'No',
          yes: 'Yes',
        },
        callback: (confirm) => {
          if (confirm) {
            this.$router.push('/' + (this.$route.query.scope ? '?scope=' + this.$route.query.scope : ''))
          }
        },
      })
    },
    async drawRecords() {
      this.isBusy = true
      await this.$axios
        .$get('/api/movements' + (this.$route.query.scope ? '?scope=' + this.$route.query.scope : ''), {
          params: {
            per_page: this.perpage,
            page: this.currentPage,
            filter: this.filter,
            sort_by: this.sortBy,
            sort_direction: this.sortDirection,
            asset_id: this.form.asset.id,
          },
        })
        .then((res) => {
          this.form.records = res.movements
          this.totalrows = res.total_rows
        })
        .then(() => {
          this.isBusy = false
        })
        .catch((err) => {
          this.isBusy = false
          if(err.response) {
            this.$snotify.error(err.response.data.message)
          } else {
            this.$snotify.error(err.message)
          }
        })
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
              .$delete(`/api/movements/${this.record.id}` + (this.$route.query.scope ? '?scope=' + this.$route.query.scope : ''))
              .then(() => {
                const index = this.form.records.findIndex(
                  (e) => e.id === this.record.id
                )
                this.form.records.splice(index, 1)
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
    onRecordRowSelected(items) {
      if (items !== null && Array.isArray(items) && items.length === 1) {
        this.record = items[0]
      } else {
        this.record = null
      }
    },
    onRecordRowDblClicked(item, index, event) {
      this.editRecord()
    },
    sortChanged(ctx) {
      if (this.sortBy !== ctx.sortBy) {
        this.isDesc = false
        this.sortDirection = 'asc'
      } else {
        this.sortDirection = ctx.sortDesc ? 'desc' : 'asc'
      }
      this.sortBy = ctx.sortBy

      this.drawRecords()
    },
    addRecord() {
      this.resetForm()
      this.$bvModal.show('recordEditor')
    },
    editRecord() {
      if (this.record !== null) {
        this.fillForm()
        this.$bvModal.show('recordEditor')
      }
    },
    async saveRecord(e) {
      e.preventDefault()
      this.form.submitted = true
      this.$v.form.record.$touch()
      if (!this.$v.form.record.$anyError) {
        this.form.processing = true
        if (this.form.record.id === 0) {
          await this.$axios
            .$post(`/api/movements`, { data: JSON.stringify(this.form.record) })
            .then((res) => {
              this.drawRecords()
            })
            .then(() => {
              this.$bvModal.hide('recordEditor')
            })
            .catch((err) => {
              if(err.response) {
                this.$snotify.error(err.response.data.message)
              } else {
                this.$snotify.error(err.message)
              }
            })
          this.form.processing = false
        } else {
          await this.$axios
            .$put(`/api/movements/${this.record.id}`, {
              data: JSON.stringify(this.form.record),
            })
            .then((res) => {
              this.drawRecords()
            })
            .then(() => {
              this.$bvModal.hide('recordEditor')
            })
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
    resetAssetForm() {
      this.form.asset.id = 0
      this.label = 'Create'
      this.form.asset.name = null
      this.form.asset.group = null
      this.form.asset.code = null
      this.form.asset.serial_no = null
      this.form.asset.details = null
      this.form.asset.quantity = 1
      this.form.asset.status = 'active'
      this.form.asset.summarize_by_group = false
      this.form.asset.photo = null
      this.form.photo = null
      this.form.records = []
    },
    resetForm() {
      this.form.submitted = false
      this.form.record.id = 0
      this.form.record.record_date = new Date()
      this.form.record.asset_id = this.form.asset.id
      this.form.record.location_id = null
      this.form.record.to_location_id = null
      this.form.record.quantity = 1
      this.form.record.movement_type = 'opening'
      this.form.record.remark = null
    },
    fillForm() {
      if (this.record !== null) {
        this.form.record.id = this.record.id
        this.form.record.record_date = this.record.record_date
        this.form.record.asset_id = this.form.asset.id
        this.form.record.location_id = this.record.location_id
        this.form.record.to_location_id = this.record.to_location_id
        this.form.record.quantity = this.record.quantity
        this.form.record.movement_type = this.record.movement_type
        this.form.record.remark = this.record.remark
      }
    },
    initCropper() {
      const image = document.getElementById('avatar-image')
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'move',
        cropBoxResizable: false,
        setCropBoxData: {
          width: 500,
          height: 500,
        },
      })
    },
    cropAvatar() {
      if (this.cropper !== null) {
        this.form.photo = this.cropper
          .getCroppedCanvas({
            width: 512,
            height: 512,
          })
          .toDataURL(this.photo.type)
        this.form.asset.photo = this.form.photo
      }
    },
    destroyCropper() {
      if (this.cropper !== null) {
        this.cropper.destroy()
      }
      this.photo = null
      this.cropper = null
    },
    reset() {
      this.form.submitted = false
      this.form.asset.photo = null
    },
  },
}
</script>

<style lang="scss" scoped>
.img-container img {
  max-width: 100%;
  height: 360px;
}
.avatar-upload {
  position: relative;
  max-width: 170px;
  margin: 20px auto;

  .avatar-edit {
    position: absolute;
    right: 15px;
    z-index: 1;
    top: 5px;

    input {
      display: none;

      + label {
        display: inline-block;
        width: 30px;
        height: 30px;
        margin-bottom: 0;
        border-radius: 100%;
        background: #ffffff;
        border: 1px solid transparent;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.12);
        cursor: pointer;

        transition: all 0.2s ease-in-out;

        &:hover {
          background: #f1f1f1;
          border-color: #d6d6d6;
        }

        &:before {
          font-size: 18px;
          color: #757575;
          position: absolute;
          top: 5px;
          left: 0;
          right: 0;
          text-align: center;
          margin: auto;
        }
      }
    }

    .avatar-remove {
      display: inline-block;
      width: 30px;
      height: 30px;
      margin-bottom: 0;
      border-radius: 100%;
      background: #ffffff;
      border: 1px solid transparent;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.12);
      cursor: pointer;

      transition: all 0.2s ease-in-out;

      &:hover {
        background: #f1f1f1;
        border-color: #d6d6d6;
      }

      &:before {
        font-size: 18px;
        color: #ff3d3d;
        position: absolute;
        top: 5px;
        left: 0;
        right: 0;
        text-align: center;
        margin: auto;
      }
    }
  }

  .avatar-preview {
    width: 150px;
    height: 150px;
    position: relative;
    border: 6px solid #f8f8f8;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);

    > div {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    }
  }
}
</style>
