<template>
  <div>
    <div v-if="labelPosition == 'horizontal'" :class="(isFilterDirty(filter.key) ? 'dirty-filter-wrapper' : '')">
      <div class="row form-row">
        <div :class="'col-'+labelColumnSize + ' ' + (isFilterDirty(filter.key) ? 'dirty-filter-label-wrapper' : '')">
          <label
            :for="filter.key"
            :class="'col-form-label datavue-ui-select-label datavue-ui-select-label-horizontal ' + (isFilterDirty(filter.key) ? 'dirty-filter-label' : '')"
            :id="filter.key+'-label'"
            v-html="filter.label"
          />
        </div>
        <div :class="'col-'+(12 - labelColumnSize) + ' ' + (isFilterDirty(filter.key) ? 'dirty-filter-input-wrapper' : '')">
          <input
          :type="type"
          :class="'form-control datavue-ui-' + type + '-input ' + (isFilterDirty(filter.key) ? 'dirty-filter-input' : '')"
          v-model="boundValue"
          :id="filter.key+'-'+type+'-input'"
          :aria-labelledby="filter.key + '-label'"
          />
          <small v-if="helperText" v-html="helperText" :class="'form-text datavue-ui-helper-text datavue-ui-input-helper-text ' + helperTextClass"></small>
        </div>
      </div>
    </div>
    <div v-if="labelPosition == 'vertical'" :class="(isFilterDirty(filter.key) ? 'dirty-filter-wrapper' : '')">
      <label
        :for="filter.key"
        :class="'col-form-label datavue-ui-select-label datavue-ui-select-label-vertical ' + (isFilterDirty(filter.key) ? 'dirty-filter-label' : '')"
        :id="filter.key+'-label'"
        v-html="filter.label"
      />
      <input
          :type="type"
          :class="'form-control datavue-ui-' + type + '-input ' + (isFilterDirty(filter.key) ? 'dirty-filter-input' : '')"
          v-model="boundValue"
          :id="filter.key+'-'+type+'-input'"
          :aria-labelledby="filter.key + '-label'"
      />
      <small v-if="helperText" v-html="helperText" :class="'form-text datavue-ui-helper-text datavue-ui-input-helper-text ' + helperTextClass"></small>
    </div>
    <div v-if="labelPosition == 'none'" :class="'form-inline ' + (isFilterDirty(filter.key) ? 'dirty-filter-wrapper' : '')">
      <input
        :type="type"
        :class="'form-control datavue-ui-' + type + '-input ' + (isFilterDirty(filter.key) ? 'dirty-filter-input' : '')"
        v-model="boundValue"
        :id="filter.key+'-'+type+'-input'"
        :aria-label="filter.label"
      />
      <small v-if="helperText" v-html="helperText" :class="'form-text datavue-ui-helper-text datavue-ui-input-helper-text ' + helperTextClass"></small>
    </div>
  </div>
</template>
<script>
import inputProps from '../mixins/inputProps'
import inputFilter from '../mixins/inputFilter'
export default {
  name: 'datavue-ui-input',
  mixins: [inputProps, inputFilter],
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
    }
  }
}
</script>
