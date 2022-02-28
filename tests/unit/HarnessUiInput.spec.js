// https://v1.test-utils.vuejs.org/guides/#testing-asynchronous-behavior
import flushPromises from 'flush-promises'

import Wrapper from './Wrapper'
import HarnessUiInput from '../../src/components/inputs/HarnessUiInput'
import Chart from './Chart'
import { data } from './mockData.json'

const PageComponent = {
  render() {
    return (
      <div>
        <HarnessUiInput filter={{key: 'search'}} labelPosition="vertical" />
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
      if (hs.getFilter('search')) {
        persons = persons.filter(person => person.name === hs.getFilter('search'))
      }
      return { chart: persons }
    }
    filters = () => ({ search: { key: 'search' }})
    charts = () => ({ chart: { key: 'chart' } })
}

describe("Input", () => {
  test("input filters chart", async () => {
    const wrapper = Wrapper([Page], PageComponent)
    const searchInput = wrapper.find('input')
    const chart = wrapper.find('p')
    
    await searchInput.setValue('Olivia')
    await flushPromises()

    expect(chart.text()).toContain('Olivia')
  });
});
