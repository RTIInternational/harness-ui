<template>
    <div v-if="validatedChartData && validatedChartData.length" :id="chart.key+'_data_table'" class="datavue-ui-datatable">
        <table :class="'datavue-ui-table table ' + tableClass">
            <thead :class="headerClass">
                <tr>
                    <th
                      v-for="(column, idx) in columnHeaders"
                      scope="col"
                      :key="idx"
                      :class="labelClass"
                      v-html="column"
                    />
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, idx) in validatedChartData" :key="idx" :class="rowClass">
                    <template v-for="(column, idx2) in columnHeaders">
                      <th
                        v-if="idx2 === 0 && rowHeaderCol"
                        :key="idx2"
                        :class="cellClass"
                        v-html="row[column]"
                        scope="row"
                      />
                      <td
                        v-else
                        :key="idx2"
                        :class="cellClass"
                        v-html="row[column]"
                      />
                    </template>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
  name: 'DataTable508',
  props: {
    'chart': {
      type: Object,
      required: true
    },
    'tableClass': {
      type: String,
      required: false,
      default: null
    },
    'headerClass': {
      type: String,
      required: false,
      default: null
    },
    'labelClass': {
      type: String,
      required: false,
      default: null
    },
    'rowClass': {
      type: String,
      required: false,
      default: null
    },
    'cellClass': {
      type: String,
      required: false,
      default: null
    },
    'rowHeaderCol': {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    columnHeaders () {
      return this.validatedChartData ? Object.keys(this.validatedChartData[0]) : []
    },
    chartData () {
      let chartData = this.getChartData(this.chart.key) || null
      let tableAdapter = this.getChartProps(this.chart.key).tableAdapter || null
      if (chartData) {
        if (tableAdapter) {
          try {
            return tableAdapter(this.chart, this.filters, chartData, this.dv)
          } catch (error) {
            throw String('There was an error in the formatted text from your tableAdapter function: ' + String(error))
          }
        }
      }
      return chartData
    },
    validatedChartData () {
      return this.validateChartData(this.chartData, this.chart.key)
    }
  }
}
</script>
<style scoped>
.row {
    margin-top: 10px;
}

.card {
    min-height: 100%;
}
.datavue-ui-table {
    overflow: auto;
}
</style>
