<template>
  <container>
    <blog v-bind="blogData"></blog>
  </container>
</template>

<script>
import container from '@/components/container'
import blog from '@/components/Blog/blog'
import fetchData from '@/store/fetchData'

export default {
  components: {
    container,
    blog
  },
  data () {
    return {
      blogId: this.$route.params.id,
      blogData: {}
    }
  },
  methods: {
    getBlogData () {
      fetchData('/blog', {id: this.blogId}, 'GET').then((r) => {
        if (r.ok) {
          this.blogData = r.msg
        }
      })
    }
  },
  created () {
    this.getBlogData()
  }
}
</script>

<style lang="scss" scoped>

</style>
