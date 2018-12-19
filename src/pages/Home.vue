<template>
<div class="container clearfix">
  <div class="content-wrapper">
    <div class="content">
      <h4>首页</h4>
      <blog-list :title="'博文列表'" :type="'allBlogs'"></blog-list>
    </div>
  </div>
    <div class="aside">
    <asideCard>
      <template slot="card-title">最近更新</template>
      <template slot="card-main">
        <div class="card1">
        </div>
      </template>
    </asideCard>
  </div>
</div>
</template>

<style lang="scss" scoped>
.container {
  position: relative;
  margin: 0 auto;
  padding: 20px 30px;
  max-width: 1300px;
  min-width: 1000px;
  min-height: 600px;
}
.content-wrapper{
  float:left;
  margin-right:20px;
  width:100%;
}
.content {
  padding-right: 260px;
}
.aside {
  float:left;
  margin-top:37px;
  margin-left:-260px;
}
.card1{
  margin: 20px;
  &>p{
    line-height: 1.5em;
  }
}
</style>

<script>
import asideCard from '@/components/asideCard'
import blogList from '@/components/Blog/blogList'

export default {
  data () {
    return {
      blogLists: [
        {
          title: '最新博文',
          type: 'latest'
        }, {
          title: '热门博文',
          type: 'hot'
        }
      ]
    }
  },
  components: {
    asideCard,
    blogList
  }
}
</script>
