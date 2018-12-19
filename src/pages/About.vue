<template>
  <container :contentTitle="'关于'">
    <div>
      <span>This project is powered by vue.js, express and mongodb. All rights reserved</span>
    </div>
  </container>
</template>

<script>
import container from '@/components/container'
import waterWave from '@/components/waterWave'
import fetchData from '@/store/fetchData'

export default {
  components: {
    container,
    waterWave
  },
  data () {
    return {
      labels: []
    }
  },
  methods: {
    getLabels () {
      fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
