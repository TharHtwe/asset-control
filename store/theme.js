export const state = () => ({
  dark: false,
  mode: 'light-mode',
  float_label: true
})

export const getters = {
  getMode(state) {
    return state.mode
  }
}

export const mutations = {
  set(state, dark) {
    state.dark = dark
    if (dark) {
      state.mode = 'dark-mode'
    } else {
      state.mode = 'light-mode'
    }
  },

  toggleDark(state) {
    state.dark = !state.dark
  }
}
