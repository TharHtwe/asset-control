<template>
  <div class="content-wrapper">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Reports</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><b-link @click="$router.push('/' + ($route.query.scope ? '?scope=' + $route.query.scope : ''))">Home</b-link></li>
              <li class="breadcrumb-item"><b-link @click="$router.push('/reports' + ($route.query.scope ? '?scope=' + $route.query.scope : ''))">Reports</b-link></li>
              <li class="breadcrumb-item active">Asset Details</li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>
    <!-- /.content-header -->

    <!-- Main content -->
    <div class="content">
      <div class="container-fluid">
        <b-row
          cols="1"
          cols-sm="2"
          align-h="between"
          align-v="center"
          class="m-0 p-0"
        >
          <b-col lg="4" class="mx-0 px-0 pr-sm-1 pr-md-1">
            <b-form-group :label="float_label ? null : 'Filter Group(s)'" :label-cols-sm="float_label ? null : 2" class="mb-1">
              <span :class="float_label ? 'has-float-label' : null">
                <div>
                <v-select
                  v-model="form.groups"
                  label="group"
                  :options="mGroups"
                  multiple
                  :reduce="(group) => group.group"
                  :enabled="!form.processing"
                >
                  <template #selected-option="{ group }">
                    <span style="background: transparent;">{{ group }}</span>
                  </template>
                </v-select>
                </div>
                <span v-if="float_label">Filter Group(s)</span>
              </span>
            </b-form-group>
          </b-col>
          <b-col lg="auto" class="mx-0 px-0 mt-0 mb-0 pr-sm-1 pr-md-1">
            <b-form-group class="mb-1">
              <b-button class="text-nowrap" variant="primary" :disabled="form.processing" @click="generateReport">
                Generate Report
              </b-button>
            </b-form-group>
          </b-col>
          <b-col lg="auto" class="mr-n3 ml-lg-auto">
            <div class="float-right">
              <button type="button" class="btn btn-tool text-primary" @click="printReport">
                <i class="fas fa-print fa-lg" />
              </button>
              <button type="button" class="btn btn-tool text-success" :disabled="form.processing || !dataSuccess" @click="excelExportReport">
                <i class="fas fa-file-excel fa-lg" />
              </button>
            </div>
          </b-col>
        </b-row>
        <hr class="mt-2">
        <b-card id="printArea">
          <h3 class="text-center">
            Asset Details Report
          </h3>
          <vue-good-table
            :columns="columns"
            :rows="form.report_data"
            row-style-class="m-0 p-0">
            <!-- <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'asset_locations'">
                <span>{{ props.row.asset_locations }}</span>
              </span>
              <span v-else>
                {{props.formattedRow[props.column.field]}}
              </span>
            </template> -->
          </vue-good-table>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
// import { ColumnChooser, Resize, Toolbar, PdfExport, ExcelExport } from '@syncfusion/ej2-vue-treegrid'
import { Internationalization } from '@syncfusion/ej2-base'
export default {
  name: 'AssetReort',
  // provide: {
  //   treegrid: [ColumnChooser, Resize, Toolbar, PdfExport, ExcelExport]
  // },
  async asyncData ({ $axios, route }) {
    let mGroups = []
    await $axios.$get('/api/reports/datas?datas=groups' + (route.query.scope ? '&scope=' + route.query.scope : ''))
      .then((res) => {
        mGroups = res.groups
      })
      .catch(() => {})
    return { mGroups }
  },
  data () {
    return {
      intl: new Internationalization(),
      form: {
        processing: false,
        groups: [],
        report_data: null
      },
      dataSuccess: false,
      columns: [
        {
          label: 'Code',
          field: 'code',
          tdClass: 'p-2',
          width: '150px'
        },
        {
          label: 'Name',
          tdClass: 'p-2',
          field: 'name',
        },
        {
          label: 'Group',
          tdClass: 'p-2',
          field: 'group',
        },
        {
          label: 'Quantity',
          field: 'quantity',
          tdClass: 'p-2',
          type: 'number',
          width: '100px'
        },
        {
          label: 'Locations',
          field: 'asset_locations',
          tdClass: 'p-2',
          html: true
        }
      ]
    }
  },
  computed: {
    float_label: {
      get () {
        return this.$store.state.theme.float_label
      }
    }
  },
  mounted () {
  },
  methods: {
    async generateReport () {
      this.form.processing = true
      this.dataSuccess = false
      await this.$axios.$get(`/api/reports/asset-details?groups=${this.form.groups}` + (this.$route.query.scope ? '&scope=' + this.$route.query.scope : ''))
        .then((res) => {
          this.form.report_data = res.report_data
          this.form.processing = false
          this.dataSuccess = true
        })
        .catch((err) => {
          if(err.response) {
            this.$snotify.error(err.response.data.message)
          } else {
            this.$snotify.error(err.message)
          }
          this.form.processing = false
        })
    },
    locationFormatter (value) {
      return value.split(',').join('<br>')
    },
    printReport () {
      const allCSS = [...document.styleSheets]
        .map((styleSheet) => {
          let styles = []
          try {
            styles = [...styleSheet.cssRules]
              .map(rule => rule.cssText)
              .join('')
          } catch (e) {
          }
          return styles
        })
        .filter(Boolean)
        .join('\n')
      const prtContent = document.getElementById('printArea')
      const w = window.open('', 'Booking', '800', '600')
      w.document.write('<html><head><style type="text/css">')
      w.document.write(allCSS)
      w.document.write('<link rel="stylesheet" type="text/css" href="https://unpkg.com/bootstrap/dist/css/bootstrap.min.css">')
      w.document.write('<link rel="stylesheet" type="text/css" href="https://unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.min.css">')
      w.document.write('<link rel="stylesheet" type="text/css" href="assets/scss/index.scss">')
      w.document.write('<link rel="stylesheet" type="text/css" href="vue-good-table/dist/vue-good-table.css">')
      // w.document.write('<link rel="stylesheet" type="text/css" href="assets/styles/spec/utils/layout/helpers/typography.scss">')
      w.document.write('</style></head><body>')
      w.document.write(prtContent.innerHTML)
      w.document.write('</body></html>')
      w.document.close()
      w.setTimeout(function () {
        w.focus()
        w.print()
        w.close()
      }, 1000)
    },
    async excelExportReport ({ $axios }) {
      this.form.processing = true
      await this.$axios.$get(`/api/reports/asset-details-excel?groups=${this.form.groups}` + (this.$route.query.scope ? '&scope=' + this.$route.query.scope : ''), { responseType: 'blob' })
        .then((response) => {
          this.form.processing = false
          const url = window.URL.createObjectURL(new Blob([response]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', 'asset-details.xlsx');
          document.body.appendChild(link)
          link.click()
        })
        .catch((err) => {
          if(err.response) {
            this.$snotify.error(err.response.data.message)
          } else {
            this.$snotify.error(err.message)
          }
          this.form.processing = false
        })
    }
  }
}
</script>

<style>

</style>
