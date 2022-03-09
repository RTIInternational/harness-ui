<template>
  <div>
    <h1>Chart</h1>
    <p>{{ chartData }}</p>
  </div>
</template>

<script>
export default {
  name: 'Chart',
  computed: {
    chartData () {
      return this.getChartData('chart')
    }
  }
}
</script>
