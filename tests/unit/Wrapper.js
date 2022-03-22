
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import harness from '@rtidatascience/harness'
import { harnessUI } from '../../src/harness-ui'

const Wrapper = (pages, AppComponent, routeName) => {
  const store = createStore({})
  const wrapper = mount(AppComponent, {
    global: {
      plugins: [
        store,
        [harness, {store, pages}],
        harnessUI
      ]
    }
  })

  return wrapper
}

export default Wrapper
