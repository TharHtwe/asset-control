import '@fortawesome/fontawesome-free/css/all.min.css'
import Vue from 'vue'

import ResizeDetector from 'vue-resize-detector'
import PerfectScrollbar from 'vue-perfect-scrollbar'
import Snotify, { SnotifyPosition } from 'vue-snotify'
import VueConfirmDialog from 'vue-confirm-dialog'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
import Vuelidate from 'vuelidate'
import vSelect from 'vue-select'
import contentmenu from 'v-contextmenu'

const snotifyOptions = {
  toast: {
    position: SnotifyPosition.rightTop,
    showProgressBar: false,
    timeout: 3000,
    icon: false
  }
}

Vue.use(Snotify, snotifyOptions)
Vue.use(VueConfirmDialog)
Vue.use(Vuelidate)
Vue.use(contentmenu)
// Vue.use(DropDownListPlugin)
// Vue.use(MultiSelectPlugin)
// Vue.use(AutoCompletePlugin)

Vue.component('PerfectScrollbar', PerfectScrollbar)
Vue.component('ResizeDetector', ResizeDetector)
Vue.component('VueConfirmDialog', VueConfirmDialog.default)
Vue.component('VueCtkDatetimepicker', VueCtkDateTimePicker)
Vue.component('VSelect', vSelect)
