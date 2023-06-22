<template>
  <i class="fas fa-bars" @click="toggle" />
</template>

<script>
export default {
  name: 'SidebarToggle',
  data () {
    return {
      autoCollapseSize: 992,
      noTransitionAfterReload: true,
      debounce: null,
      CLASS_NAME_COLLAPSED: 'sidebar-collapse',
      CLASS_NAME_OPEN: 'sidebar-open',
      CLASS_NAME_IS_OPENING: 'sidebar-is-opening',
      CLASS_NAME_CLOSED: 'sidebar-closed'
    }
  },
  mounted () {
    const $el = document.createElement('div')
    $el.setAttribute('id', 'sidebar-overlay')
    $el.addEventListener('click', this.collapse)
    document.getElementsByClassName('wrapper')[0].appendChild($el)
    window.addEventListener('resize', this.onResize)
    clearTimeout(this.debounce)
    this.debounce = setTimeout(() => {
      this.autoCollapse()
    }, 50)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
    clearTimeout(this.debounce)
  },
  methods: {
    toggle () {
      if (document.body.classList.contains(this.CLASS_NAME_COLLAPSED)) {
        this.expand()
      } else {
        this.collapse()
      }
    },
    expand () {
      if (window.innerWidth <= this.autoCollapseSize) {
        document.body.classList.add(this.CLASS_NAME_OPEN)
      }

      document.body.classList.add(this.CLASS_NAME_IS_OPENING)
      document.body.classList.remove(this.CLASS_NAME_COLLAPSED, this.CLASS_NAME_CLOSED)
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        document.body.classList.remove(this.CLASS_NAME_IS_OPENING)
      }, 50)
    },
    collapse () {
      if (window.innerWidth <= this.autoCollapseSize) {
        document.body.classList.remove(this.CLASS_NAME_OPEN)
        document.body.classList.add(this.CLASS_NAME_CLOSED)
      }

      document.body.classList.add(this.CLASS_NAME_COLLAPSED)
    },
    onResize () {
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.autoCollapse(true)
      }, 75)
    },
    autoCollapse (resize = false) {
      if (window.innerWidth <= this.autoCollapseSize) {
        if (!document.body.classList.contains(this.CLASS_NAME_OPEN)) {
          this.collapse()
        }
      } else if (resize === true) {
        if (document.body.classList.contains(this.CLASS_NAME_OPEN)) {
          document.body.classList.remove(this.CLASS_NAME_OPEN)
        } else if (document.body.classList.contains(this.CLASS_NAME_CLOSED)) {
          this.expand()
        }
      }
    }
  }
}
</script>

<style>

</style>
