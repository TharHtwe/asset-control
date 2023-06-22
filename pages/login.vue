<template>
  <div class="login-box">
    <div class="login-logo">
      <b>Asset Control</b>
    </div>
    <!-- /.login-logo -->
    <div class="card">
      <div class="card-body login-card-body">
        <p class="login-box-msg">Sign in to start your session</p>

        <b-form @submit.prevent="login">
          <div class="input-group mb-3">
            <b-form-input v-model="$v.form.email.$model" type="email" :state="submitted ? !$v.form.email.$error : null" :disabled="processing" placeholder="Email"/>
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="fas fa-envelope"></span>
              </div>
            </div>
          </div>
          <div class="input-group mb-3">
            <b-form-input v-model="$v.form.password.$model" type="password" :state="submitted ? !$v.form.password.$error : null" :disabled="processing" placeholder="Password"/>
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="fas fa-lock"></span>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-8"/>
            <!-- /.col -->
            <div class="col-4">
              <button type="submit" :disabled="processing" class="btn btn-primary btn-block">Sign In</button>
            </div>
            <!-- /.col -->
          </div>
		  <b-row>
		   <b-col>
		    {{ test_result }}
		   </b-col>
		  </b-row>
        </b-form>
      </div>
      <!-- /.login-card-body -->
    </div>
  </div>
  <!-- /.login-box -->
</template>

<script>
const {
  required, email, minLength
} = require('vuelidate/lib/validators')
export default {
  name: 'LoginPage',
  layout: 'blank',
  auth: false,
  data () {
    return {
      processing: false,
      submitted: false,
	  test_result: null,
      form: {
        email: '',
        password: '',
        recaptcha: ''
      }
    }
  },
  validations: {
    form: {
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(6)
      }
    }
  },
  head () {
    return {
      bodyAttrs: {
        class: ['login-page', this.mode]
      }
    }
  },
  computed: {
    mode () {
      return this.$store.state.theme.mode
    }
  },
  mounted () {
    // try {
    //   this.$recaptcha.init()
    // } catch (e) {
    //   this.$snotify.error('Recaptcha cannot be initialized.')
    // }
  },
  beforeDestroy () {
    // try {
    //   this.$recaptcha.destroy()
    //   document.querySelectorAll('div.grecaptcha-badge').forEach((a) => {
    //     a.parentElement.remove()
    //   })
    // } catch (e) {

    // }
  },
  methods: {
  async test () {
        await this.$axios.$get('/api/test')
          .then((res) => {
            this.test_result = res.message
          }).catch((err) => {
            console.log(err)
          })
    },
  async test2 () {
        await this.$axios.$post('/api/test2')
          .then((res) => {
            this.test_result = res.message
          }).catch((err) => {
            console.log(err)
          })
    },
    async login () {
      this.submitted = true
      this.$v.form.$touch()
      if (!this.$v.$anyError) {
        this.processing = true
        this.form.recaptcha = 'abc'
        // this.form.recaptcha = await this.$recaptcha.execute('login').catch(() => {})
        await this.$auth.loginWith('local', { data: this.form })
          .then(() => {
            this.processing = false
            this.$router.push('/' + (this.$route.query.scope ? '?scope=' + this.$route.query.scope : ''))
          }).catch(() => {
            this.processing = false
          })
      }
    }
  }
}
</script>

<style>

</style>
