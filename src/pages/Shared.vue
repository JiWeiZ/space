<template>
  <container :contentTitle="'分享'">
    <div class="share">
      <h1>电子书</h1>
      <ul>
        <li v-for="(item, index) in pdfs" :key="index"><router-link class="bottom-line" :to="'/shared/pdf/' + item._id">《{{item.name}}》</router-link></li>
      </ul>
    </div>
  </container>
</template>

<script>
import container from '@/components/container'
import fetchData from '@/store/fetchData'

export default {
  components: {
    container
  },
  data () {
    return {
      pdfs: []
    }
  },
  created () {
    fetchData('/share/pdfs', {}, 'GET').then(r => {
      if (r.ok) {
        this.pdfs = r.msg
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.share {
  ul {
    margin-left: 15px;
  }
  li {
    display: inline-block;
    margin: 5px;
  }
  .bottom-line::before {
    height: 1px;
  }
}
</style>
