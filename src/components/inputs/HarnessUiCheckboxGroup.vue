<template>
  <div>
    <fieldset v-if="labelPosition === 'vertical'">
      <legend
        class="col-form-label harness-ui-checkboxgroup-legend"
        :for="filter.key"
        :data-toggle="collapse ? 'collapse' : ''"
        :href="collapse ?  '#harness-ui-checkbox-collapse-' + filter.key : ''"
        :role="collapse ? 'button' : ''"
      >
        <span v-html="filter.label" />
        <button
          class="harness-ui-collapse-toggle-button"
          :data-toggle="collapse ? 'collapse' : ''"
          :href="collapse ?  '#harness-ui-checkbox-collapse-' + filter.key : ''"
          :role="collapse ? 'button' : ''"
          v-if="collapse"
          aria-expanded="false"
          aria-label="Collapse Toggle"
        >
          <i class="bi-chevron-down" v-if="collapse && collapsed"></i>
          <i class="bi-chevron-up" v-if="collapse && !collapsed"></i>
        </button>
      </legend>
      <div
       v-if="collapse"
       data-toggle="collapse"
       :href="collapse ?  '#harness-ui-checkbox-collapse-' + filter.key : ''"
       role="button"
       class="harness-ui-checkboxgroup-collapse-label"
       >
        <span v-if=" collapse && getFilter(filter.key).length === getOptionsForFilter(filter.key).length">
          (All Selected)
        </span>
        <span v-else-if="collapse">
          ({{getFilter(filter.key).length}} of {{getOptionsForFilter(filter.key).length}} selected)
        </span>
      </div>
      <div
        :class="collapse ? 'collapse' : ''"
        :id="collapse ? 'harness-ui-checkbox-collapse-' + filter.key : ''"
      >
        <div
          :class="'form-check' + (inline ? ' form-check-inline' : '')"
          v-for="(option, idx) in getOptionsForFilter(filter.key)"
          :key="idx"
        >
          <CheckboxPartial v-bind="{...$props, ...$attrs, collapsed, option}" />
          <label
            class="form-check-label harness-ui-checkboxgroup-label"
            :id="filter.key + option.key + '-label'"
            :for="filter.key + option.key"
            v-html="option.label"
          />
        </div>
        <small v-if="helperText" v-html="helperText" :class="'form-text harness-ui-helper-text harness-ui-checkboxgroup-helper-text ' + helperTextClass"></small>
      </div>
    </fieldset>
    <fieldset v-if="labelPosition === 'horizontal'">
      <div class="row form-row">
        <div :class="'col-'+labelColumnSize">
          <legend
            class="col-form-label harness-ui-checkboxgroup-legend"
            :data-toggle="collapse ? 'collapse' : ''"
            :href="collapse ?  '#harness-ui-checkbox-collapse-' + filter.key : ''"
            :role="collapse ? 'button' : ''"
            :for="filter.key"
          >
            <span v-html="filter.label" />
            <button
              class="harness-ui-collapse-toggle-button"
              :data-toggle="collapse ? 'collapse' : ''"
              :href="collapse ?  '#harness-ui-checkbox-collapse-' + filter.key : ''"
              :role="collapse ? 'button' : ''"
              v-if="collapse"
              aria-expanded="false"
              aria-label="Collapse Toggle"
            >
              <i class="bi-chevron-down" v-if="collapse && collapsed"></i>
              <i class="bi-chevron-up" v-if="collapse && !collapsed"></i>
            </button>
          </legend>
        </div>
        <div :class="'col-'+(12 - labelColumnSize)">
          <div
            v-if="collapse"
            class="col-form-label harness-ui-checkboxgroup-collapse-label"
            data-toggle="collapse"
            :href="'#harness-ui-checkbox-collapse-' + filter.key"
            role="button"
          >
            <span v-if=" collapse && getFilter(filter.key).length === getOptionsForFilter(filter.key).length">
              (All Selected)
            </span>
            <span v-else-if="collapse">
              ({{getFilter(filter.key).length}} of {{getOptionsForFilter(filter.key).length}} selected)
            </span>
          </div>
          <div
            :class="collapse ? 'collapse' : ''"
            :id="collapse ? 'harness-ui-checkbox-collapse-' + filter.key : ''"
          >
            <div
              :class="'form-check' + (inline ? ' form-check-inline' : '')"
              v-for="(option, idx) in getOptionsForFilter(filter.key)"
              :key="idx"
            >
              <CheckboxPartial v-bind="{...$props, ...$attrs, collapsed, option}" />
              <label
                class="form-check-label harness-ui-checkboxgroup-label"
                :id="filter.key + option.key + '-label'"
                :for="filter.key + option.key"
                v-html="option.label"
              />
            </div>
            <small v-if="helperText" v-html="helperText" :class="'form-text harness-ui-helper-text harness-ui-checkboxgroup-helper-text ' + helperTextClass"></small>
          </div>
        </div>
      </div>
    </fieldset>
    <fieldset v-if="labelPosition === 'none'">
      <div
        :class="'form-check' + (inline ? ' form-check-inline' : '')"
        v-for="(option, idx) in getOptionsForFilter(filter.key)"
        :key="idx"
      >
        <CheckboxPartial v-bind="{...$props, ...$attrs, collapsed, option}" />
        <label
          class="form-check-label harness-ui-checkboxgroup-label"
          :id="filter.key + option.key + '-label'"
          :for="filter.key + option.key"
          v-html="option.label"
        />
      </div>
      <small v-if="helperText" v-html="helperText" :class="'form-text harness-ui-helper-text harness-ui-checkboxgroup-helper-text ' + helperTextClass"></small>
    </fieldset>
  </div>
</template>

<script>
import inputProps from '../mixins/inputProps'
import inputFilter from '../mixins/inputFilter'
import CheckboxPartial from './partials/CheckboxPartial'
export default {
  name: 'harness-ui-checkboxgroup',
  mixins: [inputProps, inputFilter],
  components: { CheckboxPartial },
  data: () => { return { collapsed: true } },
  props: {
    inline: {
      type: Boolean,
      docstring: 'asdasdasd',
      required: false,
      default: false
    },
    collapse: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  mounted () {
    if (this.collapse) {
      // adding event listener that closes the collapse
      // when clicking anywhere but the checkboxes themselves
      document.addEventListener('click', (e) => {
        if (!e.target.id.includes(this.filter.key)) {
          window.$(`#harness-ui-checkbox-collapse-${this.filter.key}`).collapse('hide')
        }
      })
      // lifecycling the vue attribute used for the chevron along with bootstrap
      window.$(`#harness-ui-checkbox-collapse-${this.filter.key}`).on('hide.bs.collapse', () => { this.collapsed = true })
      window.$(`#harness-ui-checkbox-collapse-${this.filter.key}`).on('show.bs.collapse', () => { this.collapsed = false })
    }
  }
}
</script>
<style>
.harness-ui-collapse-toggle-button {
  background-color: transparent;
  border: 0px solid transparent;
  box-shadow: none;
}
</style>
