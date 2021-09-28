<template>
  <div>
    {{getFilter(this.filter.key)}}
    <div v-if="labelPosition == 'horizontal'" :class="(isFilterDirty(filter.key) ? 'dirty-filter-wrapper' : '')">
      <div class="row form-row">
        <div :class="'col-'+labelColumnSize + ' ' + (isFilterDirty(filter.key) ? 'dirty-filter-label-wrapper' : '')">
          <label
            :for="filter.key"
            :class="'col-form-label harness-ui-select-label harness-ui-select-label-horizontal ' + (isFilterDirty(filter.key) ? 'dirty-filter-label' : '')"
            :id="filter.key+'-label'"
            v-html="filter.label"
          />
        </div>
        <div :class="'col-'+(12 - labelColumnSize) + ' ' + (isFilterDirty(filter.key) ? 'dirty-filter-input-wrapper' : '')">
          <InputPartial v-bind="{...$props, ...$attrs, strictError}" />
          <small v-if="helperText" v-html="helperText" :class="'form-text harness-ui-helper-text harness-ui-input-helper-text ' + helperTextClass"></small>
        </div>
      </div>
    </div>
    <div v-if="labelPosition == 'vertical'" :class="(isFilterDirty(filter.key) ? 'dirty-filter-wrapper' : '')">
      <label
        :for="filter.key"
        :class="'col-form-label harness-ui-select-label harness-ui-select-label-vertical ' + (isFilterDirty(filter.key) ? 'dirty-filter-label' : '')"
        :id="filter.key+'-label'"
        v-html="filter.label"
      />
      <InputPartial v-bind="{...$props, ...$attrs, strictError}" />
      <small v-if="helperText" v-html="helperText" :class="'form-text harness-ui-helper-text harness-ui-input-helper-text ' + helperTextClass"></small>
    </div>
    <div v-if="labelPosition == 'none'" :class="'form-inline ' + (isFilterDirty(filter.key) ? 'dirty-filter-wrapper' : '')">
      <InputPartial v-bind="{...$props, ...$attrs, strictError}" />
      <small v-if="helperText" v-html="helperText" :class="'form-text harness-ui-helper-text harness-ui-input-helper-text ' + helperTextClass"></small>
    </div>
  </div>
</template>
<script>
import inputProps from '../mixins/inputProps'
import inputFilter from '../mixins/inputFilter'
import InputPartial from './partials/InputPartial'
import $ from 'jquery'
import Bloodhound from 'corejs-typeahead'
export default {
  name: 'harness-ui-input',
  mixins: [inputProps, inputFilter],
  components: { InputPartial },
  props: {
    type: {
      required: false,
      type: String,
      default: 'text',
      validator: function (value) {
        let validOptions = [
          'date',
          'datetime-local',
          'email',
          'month',
          'number',
          'password',
          'search',
          'tel',
          'text',
          'time',
          'url',
          'week'
        ]
        return validOptions.includes(value)
      }
    },
    typeahead: {
      type: Boolean,
      required: false,
      default: false
    },
    strict: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data () {
    return {
      bloodhound: null,
      subscription: null,
      strictError: false
    }
  },
  computed: {
    boundValue: {
      get () {
        return this.getFilter(this.filter.key)
      },
      set (value) {
        // if strict is enabled, only allow options that are in the list
        if (!this.strict || this.evaluateStrict) {
          this.strictError = false
          this.setFilterLoadData(this.filter.key, value)
        } else if (this.strict && !this.evaluateStrict) {
          this.strictError = true
        }
      }
    }
  },
  methods: {
    evaluateStrict (val) {
      return this.getOptionsForFilter(this.filter.key).map(f => f.key).includes(val)
    },
    initTypeahead () {
      // create Bloodhound instance with flattened/tokenized list of option labels
      this.bloodhound = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: this.getOptionsForFilter(this.filter.key).map(f => f.key)
      })
      // instantiate typeahead
      $(`#${this.filter.key}-${this.type}-input`).typeahead({
        highlight: true,
        minLength: 1
      },
      {
        name: this.filter.key,
        limit: 10,
        source: this.bloodhound
      })
        .bind('typeahead:select', (ev, selection) => {
          this.setFilter(this.filter.key, selection)
        })
        .bind('typeahead:autocomplete', (ev, selection) => {
          this.setFilter(this.filter.key, selection)
        })
    }
  },
  mounted () {
    if (this.typeahead) {
      this.initTypeahead()
      this.subscription = this.$store.subscribeAction({
        before: (action, state) => {},
        after: (action, state) => {
          // respond to options changing
          if (action.type.includes(`SET_${this.filter.key.toUpperCase()}_OPTIONS`)) {
            this.bloodhound.clear()
            this.bloodhound.add(this.getOptionsForFilter(this.filter.key).map(f => f.key))
          }
        }
      })
    }
  },
  beforeDestroy () {
    if (this.typeahead) {
      this.subscription()
      this.bloodhound.clear()
    }
  }
}
</script>
