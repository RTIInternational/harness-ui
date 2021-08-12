<template>
  <div>
    <div>
      <div class="row py-2">
        <div class="col-sm-3">
          <div class="row form-row">
            <div class="offset-1 col-4">
              <select
                class="form-control harness-ui-interactivetable-select"
                :id="chart.key + 'NumRowsSelect'"
                aria-label="Amount of rows to paginate by"
                v-model="paginationAmount"
              >
                <option
                  v-for="option in numRowOptions"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="col-sm-4 offset-sm-5 text-right">
          <div class="row form-row">
            <div class="offset-4 col-8 pr-4">
              <input
                type="text"
                class="form-control harness-ui-interactivetable-text-input"
                :id="chart.key + 'SearchQueryInput'"
                aria-label="Table search"
                v-model="searchText"
                placeholder="Search..."
              />
            </div>
          </div>
        </div>
      </div>
      <div v-if="validatedChartData && validatedChartData.length" :id="chart.key+'_data_table'" class="harness-ui-interactivetable-datatable">
        <table :class="'harness-ui-interactivetable-table table ' + tableClass">
          <thead :class="headerClass">
            <tr>
              <th
                v-for="(column, idx) in columnHeaders"
                scope="col"
                :key="idx"
                :class="labelClass"
                @click="setColumnFilter(column)"
              >
                {{ column }}
                <span
                  v-if="isActiveAndDescending(column)"
                  :class="['activeCol']"
                >&#9660;</span>
                <span
                  v-if="isActiveAndAscending(column)"
                  :class="['activeCol']"
                >&#9650;</span>
              </th>
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
    </div>
    <div class="row justify-content-center">
      <div class="col-md-2 text-center">
        <nav
          aria-label="Table pagination navigation"
          class="navigation text-center harness-ui-interactivetable-pagination-navigation"
        >
          <ul class="pagination harness-ui-interactivetable-pagination">
            <li
              v-for="index in numberOfPages"
              :key="index"
              :class="['page-item', 'harness-ui-interactivetable-pagination-pageitem', index === pageNumber ? ' active' : '']"
            >
              <a
                :class="'page-link'"
                @click="setPageNum(index)"
              >
                {{ index }}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>
<script>
import tables from './mixins/tables'
export default {
  name: 'InteractiveTable',
  mixins: [tables],
  props: {
    'local': {
      type: Object,
      required: false,
      default: () => {}
    },
    'numRowOptions': {
      type: Array,
      required: true
    },
    'defaultSortColumn': {
      type: String,
      required: true
    },
    'defaultSortOrder': {
      type: String,
      required: false,
      default: 'asc',
      validator: function (value) {
        return ['asc', 'desc'].includes(value)
      }
    }
  },
  data () {
    return {
      sortedDescending: this.defaultSortOrder === 'desc',
      pageNumber: 1,
      searchQuery: '',
      columnSelector: this.defaultSortColumn,
      columnSort: this.defaultSortOrder,
      paginationAmount: 5
    }
  },
  methods: {
    setColumnFilter (columnName) {
      if (columnName === this.columnSelector) {
        this.sortedDescending = !this.sortedDescending
      }
      this.columnSelector = columnName
      this.columnSort = this.sortedDescending ? 'desc' : 'asc'
      if (this.tableOptions) {
        this.setOptionsForFilter(this.chart.key + 'TableOptions', [{
          'pageNumber': this.pageNumber,
          'searchQuery': this.searchQuery,
          'columnSelector': this.columnSelector,
          'columnSort': this.sortedDescending ? 'desc' : 'asc',
          'paginationAmount': this.paginationAmount,
          'numberOfPages': this.numberOfPages
        }])
      }
      if (!this.isSearchable || !this.isSortable || !this.isPaginated) {
        this.LOAD_DATA()
      }
    },
    setPageNum (index) {
      this.pageNumber = index
      if (this.tableOptions) {
        this.setFilter(this.chart.key + 'TableOptions', {
          'pageNumber': this.pageNumber,
          'searchQuery': this.searchQuery,
          'columnSelector': this.columnSelector,
          'columnSort': this.columnSort,
          'paginationAmount': this.paginationAmount,
          'numberOfPages': this.numberOfPages
        })
      }
      if (!this.isSearchable || !this.isSortable || !this.isPaginated) {
        this.LOAD_DATA()
      }
    },
    isActiveAndDescending (columnName) {
      return (this.columnSort === 'desc') && (this.columnSelector === columnName)
    },
    isActiveAndAscending (columnName) {
      return (this.columnSort === 'asc') && (this.columnSelector === columnName)
    }
  },
  computed: {
    tableOptions () {
      return this.getOptionsForFilter(this.chart.key + 'TableOptions') || []
    },
    tableAdaptedData () {
      let filteredData = this.getChartData(this.chart.key) || null
      let tableAdapter = this.getChartProps(this.chart.key).tableAdapter || null
      if (filteredData && tableAdapter) {
        try {
          filteredData = tableAdapter(this.chart, this.filters, filteredData, this.hs)
        } catch (error) {
          throw String('There was an error in the formatted text from your tableAdapter function: ' + String(error))
        }
      }
      return filteredData
    },
    chartData () {
      let filteredData = this.tableAdaptedData
      if (filteredData) {
        // searching
        if (this.isSearchable) {
          filteredData = filteredData.filter(row => {
            return Object.values(row).reduce((acc, cell) => {
              if (!acc) {
                if (cell) {
                  return cell.toLowerCase().includes(this.searchQuery.toLowerCase())
                }
                return false
              }
              return acc
            }, false)
          })
        }
        // sorting
        if (this.isSortable) {
          if (this.columnSort === 'asc') {
            filteredData = filteredData.sort((a, b) => {
              return a[this.columnSelector].toString().localeCompare(b[this.columnSelector], 'en', { sensitivity: 'base' })
            })
          } else if (this.columnSort === 'desc') {
            filteredData = filteredData.sort((a, b) => {
              return b[this.columnSelector].toString().localeCompare(a[this.columnSelector], 'en', { sensitivity: 'base' })
            })
          }
        }
        // pagination
        if (this.isPaginated) {
          let currentPageNum = this.pageNumber
          let tableRows = filteredData.length
          let rowsPerPage = parseInt(this.paginationAmount)
          let lastVisibleRow = (currentPageNum * rowsPerPage) > tableRows ? tableRows : (currentPageNum * rowsPerPage)
          let firstVisibleRow = (currentPageNum - 1) * rowsPerPage
          filteredData = filteredData.slice(firstVisibleRow, lastVisibleRow)
        }
        return filteredData
      }
      return filteredData
    },
    isSearchable () {
      return !this.local.hasOwnProperty('search') || (this.local.hasOwnProperty('search') && this.local.search !== false)
    },
    isSortable () {
      return !this.local.hasOwnProperty('sort') || (this.local.hasOwnProperty('sort') && this.local.sort !== false)
    },
    isPaginated () {
      return !this.local.hasOwnProperty('paginate') || (this.local.hasOwnProperty('paginate') && this.local.paginate !== false)
    },
    numberOfPages () {
      let filteredData = this.tableAdaptedData
      // searching
      if (filteredData) {
        filteredData = filteredData.filter(row => {
          return Object.values(row).reduce((acc, cell) => {
            if (!acc) {
              if (cell) {
                return cell.toLowerCase().includes(this.searchQuery.toLowerCase())
              }
              return false
            }
            return acc
          }, false)
        })
      }
      let pageRange = [1]
      let rowsPerPage = parseInt(this.paginationAmount)
      let totalRows = this.validateChartData(filteredData, this.chart.key) ? this.validateChartData(filteredData, this.chart.key).length : 0
      let numPages = Math.ceil(totalRows / rowsPerPage)
      for (let i = 2; i <= numPages; i++) {
        pageRange.push(i)
      }
      return pageRange
    },
    searchText: {
      get () {
        return this.searchQuery
      },
      set (value) {
        this.searchQuery = value
        this.pageNumber = 1
        if (this.tableOptions) {
          this.setFilter(this.chart.key + 'TableOptions', {
            'pageNumber': this.pageNumber,
            'searchQuery': this.searchQuery,
            'columnSelector': this.columnSelector,
            'columnSort': this.columnSort,
            'paginationAmount': this.paginationAmount,
            'numberOfPages': this.numberOfPages
          })
        }
        if (!this.isSearchable || !this.isSortable || !this.isPaginated) {
          this.LOAD_DATA()
        }
      }
    }
  },
  beforeUpdate () {
    if (this.pageNumber > this.numberOfPages.length) {
      this.pageNumber = 1
      if (this.tableOptions) {
        this.setFilter(this.chart.key + 'TableOptions', {
          'pageNumber': this.pageNumber,
          'searchQuery': this.searchQuery,
          'columnSelector': this.columnSelector,
          'columnSort': this.columnSort,
          'paginationAmount': this.paginationAmount,
          'numberOfPages': this.numberOfPages
        })
      }
      this.LOAD_DATA()
    }
  }
}
</script>
