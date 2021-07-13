<template>
  <div>
    <fieldset v-if="labelPosition === 'vertical'">
      <legend
        class="col-form-label datavue-ui-radiogroup-legend"
        :for="filter.key"
        v-html="filter.label"
      />
      <div
        :class="'form-check' + (inline ? ' form-check-inline' : '')"
        v-for="(option, idx) in getOptionsForFilter(filter.key)"
        :key="idx"
      >
        <input
          class="form-check-input databue-ui-radiogroup-input"
          type="radio"
          :name="filter.key"
          :id="filter.key + option.key"
          :value="option.key"
          :disabled="option.disabled"
          v-model="boundValue"
          :aria-labelledby="filter.key + option.key + '-label'"
        />
        <label
          class="form-check-label datavue-ui-radiogroup-label"
          :id="filter.key + option.key + '-label'"
          :for="filter.key + option.key"
          :disabled="option.disabled"
          v-html="option.label"
        />
      </div>
      <small v-if="helperText" v-html="helperText" :class="'form-text datavue-ui-helper-text datavue-ui-radiogroup-helper-text ' + helperTextClass"></small>
    </fieldset>
    <fieldset v-if="labelPosition === 'horizontal'">
      <div class="row form-row">
        <div :class="'col-'+labelColumnSize">
          <legend
            class="col-form-label datavue-ui-radiogroup-legend"
            :for="filter.key"
            v-html="filter.label"
          />
        </div>
        <div :class="'col-'+(12 - labelColumnSize)">
          <div
            :class="'form-check' + (inline ? ' form-check-inline' : '')"
            v-for="(option, idx) in getOptionsForFilter(filter.key)"
            :key="idx"
          >
            <input
              class="form-check-input databue-ui-radiogroup-input"
              type="radio"
              :name="filter.key"
              :id="filter.key + option.key"
              :value="option.key"
              :disabled="option.disabled"
              v-model="boundValue"
              :aria-labelledby="filter.key + option.key + '-label'"
            />
            <label
              class="form-check-label datavue-ui-radiogroup-label"
              :id="filter.key + option.key + '-label'"
              :for="filter.key + option.key"
              :disabled="option.disabled"
              v-html="option.label"
            />
          </div>
          <small v-if="helperText" v-html="helperText" :class="'form-text datavue-ui-helper-text datavue-ui-radiogroup-helper-text ' + helperTextClass"></small>
        </div>
      </div>
    </fieldset>
  </div>
</template>
<script>
import inputProps from '../mixins/inputProps'
import inputFilter from '../mixins/inputFilter'
export default {
  name: 'datavue-ui-radiogroup',
  mixins: [inputProps, inputFilter],
  props: {
    inline: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>
