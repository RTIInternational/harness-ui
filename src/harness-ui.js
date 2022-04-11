import components from './manifest'
import jquery from 'jquery'
window.$ = window.jQuery = jquery

export const harnessUI = {
  // eslint-disable-next-line
    install(Vue, options) {
    // // globally register components
    Object.keys(components).forEach(name => {
      Vue.component(name, components[name])
    })
  }
}

export { default as components } from './manifest'
