import Vuex from 'vuex'
import harness from '@rtidatascience/harness'
import { harnessUI } from '../../src/harness-ui'
import { mount, createLocalVue } from '@vue/test-utils'

const Wrapper = (pages, AppComponent, routeName) => {

  const localVue = createLocalVue()
  localVue.use(Vuex)

  const store = new Vuex.Store()
  localVue.use(harness, { store, pages })
  localVue.use(harnessUI)

  const wrapper = mount(AppComponent, {
    localVue,
    store,
  })

  return wrapper
}

export default Wrapper
