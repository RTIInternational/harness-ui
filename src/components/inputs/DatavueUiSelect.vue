<template>
  <div>
    <div v-if="labelPosition == 'horizontal'" :class="(isFilterDirty(filter.key) ? 'dirty-filter-wrapper' : '')">
      <div class="row form-row">
        <div :class="'col-'+labelColumnSize">
          <label
            :for="filter.key"
            :class="'col-form-label datavue-ui-select-label datavue-ui-select-label-horizontal ' + (isFilterDirty(filter.key) ? 'dirty-filter-label' : '')"
            :id="filter.key+'-label'"
            v-html="filter.label"
          />
        </div>
        <div :class="'col-'+(12 - labelColumnSize)">
          <select
            :multiple="multiple"
            :class="'form-control datavue-ui-select ' + (isFilterDirty(filter.key) ? 'dirty-filter-select' : '')"
            v-model="boundValue"
            :id="filter.key+'-select'"
            :aria-labelledby="filter.key + '-label'"
          >
            <option
              v-for="option in getOptionsForFilter(filter.key)"
              :key="option.key"
              :value="option.key"
              :disabled="option.disabled"
              v-html="option.label"
            />
          </select>
          <small v-if="helperText" v-html="helperText" :class="'form-text datavue-ui-select-helper-text datavue-ui-helper-text ' + helperTextClass"></small>
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
      <select
        :multiple="multiple"
        :class="'form-control datavue-ui-select ' + (isFilterDirty(filter.key) ? 'dirty-filter-select' : '')"
        v-model="boundValue"
        :id="filter.key+'-select'"
        :aria-labelledby="filter.key + '-label'"
      >
        <option
          v-for="option in getOptionsForFilter(filter.key)"
          :key="option.key"
          :value="option.key"
          :disabled="option.disabled"
          v-html="option.label"
        />
      </select>
      <small v-if="helperText" v-html="helperText" :class="'form-text datavue-ui-select-helper-text datavue-ui-helper-text ' + helperTextClass"></small>
    </div>
    <div v-if="labelPosition == 'none'" :class="'form-inline ' + (isFilterDirty(filter.key) ? 'dirty-filter-wrapper' : '')">
      <select
        :multiple="multiple"
        :class="'form-control datavue-ui-select ' + (isFilterDirty(filter.key) ? 'dirty-filter-select' : '')"
        v-model="boundValue"
        :id="filter.key+'-select'"
        :aria-label="filter.label"
      >
        <option
          v-for="option in getOptionsForFilter(filter.key)"
          :key="option.key"
          :value="option.key"
          :disabled="option.disabled"
          v-html="option.label"
        />
      </select>
      <small v-if="helperText" v-html="helperText" :class="'form-text datavue-ui-select-helper-text datavue-ui-helper-text ' + helperTextClass"></small>
    </div>
  </div>
</template>
<script>
import inputProps from '../mixins/inputProps'
import inputFilter from '../mixins/inputFilter'
export default {
  name: 'datavue-ui-select',
  mixins: [inputProps, inputFilter],
  props: {
    multiple: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>
