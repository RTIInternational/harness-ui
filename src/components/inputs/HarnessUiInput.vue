<template>
  <div>
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
        datumTokenizer: Bloodhound.tokenizers.ngram,
        queryTokenizer: Bloodhound.tokenizers.ngram,
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
<style>
  .tt-input {
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
}

.tt-hint {
    color: #999;
}

.tt-menu {
    max-width: 100%;
    margin-top: 5px;
    padding: 5px 0;
    background-color: white;
    border: 1px solid black;
    border: 1px solid rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    box-shadow: 0 5px 5px rgba(0,0,0,.5);
}

.tt-suggestion {
    padding: 5px 10px;
}

.tt-suggestion.tt-cursor {
    color: #fff;
    background-color: #0097cf;

}
.tt-suggestion p {
    margin: 0;
}

</style>
