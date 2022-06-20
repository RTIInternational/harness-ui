// https://v1.test-utils.vuejs.org/guides/#testing-asynchronous-behavior
import flushPromises from 'flush-promises'

import Wrapper from './Wrapper'
import HarnessUiSelect from '../../src/components/inputs/HarnessUiSelect'
import Chart from './Chart'
import { data } from './mockData.json'

const PageComponent = {
  render () {
    return (
      <div>
        <HarnessUiSelect filter={{ key: 'select' }} labelPosition="vertical" />
        <Chart />
      </div>
    )
  }
}

class Page {
    key = 'home'
    pageComponent = PageComponent
    retrieveData = async function (state, pageObject, hs) {
      let persons = data
      if (hs.getFilter('select')) {
        persons = persons.filter(person => person.name === hs.getFilter('select'))
      }
      return { chart: persons }
    }
    filters = () => ({ select: { key: 'select' } })
    charts = () => ({ chart: { key: 'chart' } })
}

describe('Select', () => {
  test('select filters chart', async () => {
    const wrapper = Wrapper([Page], PageComponent)
    const select = wrapper.find('select')
    const chart = wrapper.find('p')

    await select.setValue('Olivia')
    await flushPromises()

    expect(chart.text()).toContain('Olivia')
  })
})
