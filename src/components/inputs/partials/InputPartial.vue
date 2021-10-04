<template>
  <input
    :type="type"
    :class="`form-control harness-ui-${type}-input ${isFilterDirty(filter.key) ? 'dirty-filter-input' : ''} ${strictError ? 'typeahead-strict-error' : ''}`"
    v-model="boundValue"
    :id="`${filter.key}-${type}-input`"
    :aria-labelledby="`${filter.key}-label`"
    />
</template>
<script>
import inputProps from '../../mixins/inputProps'
import inputFilter from '../../mixins/inputFilter'
export default {
  name: 'InputPartial',
  mixins: [inputProps, inputFilter],
  props: {
    type: {
      required: true,
      type: String
    },
    strictError: {
      type: Boolean,
      required: true
    }
  }
}
</script>
