<template>
  <container :contentTitle="'时间轴'">
    <div>
      <timeline :blogs="blogs"></timeline>
    </div>
  </container>
</template>

<script>
import container from '@/components/container'
import timeline from '@/components/timeline'
import fetchData from '@/store/fetchData'

export default {
  components: {
    container,
    timeline
  },
  data () {
    return {
      blogs: []
    }
  },
  methods: {
    getblogs () {
      fetchData('/blog/timeline', {}, 'GET').then(r => {
        if (r.ok) {
          this.blogs = r.msg
        }
      })
    }
  },
  created () {
    this.getblogs()
  }
}
</script>

<style lang="scss" scoped>

</style>
