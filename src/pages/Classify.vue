<template>
<div class="container clearfix">
  <div class="content-wrapper">
    <div class="content">
      <h4>归类</h4>
      <blog-list v-bind="blogList" :pageSize="8"></blog-list>
    </div>
  </div>
  <div class="aside">
    <asideCard>
      <template slot="card-title">文章归类</template>
      <template slot="card-main">
        <div class="labels-wrapper">
          <div :class="{select: index === currentIndex}" @click="selectCategory(item, index)" v-for="(item, index) in categories" :key="index" class="label">{{item.content}}&nbsp;<i>({{item.blogs.length}})</i></div>
        </div>
      </template>
    </asideCard>
  </div>
</div>
</template>

<style lang="scss" scoped>
@import '../assets/css/static.scss';

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
    .labels-wrapper {
      margin: 10px 15px;
    }
    .label {
    display: inline-block;
    margin: 3px;
    white-space: nowrap;
    background: $mainColorL1;
    border: 1px solid $mainColorL2;
    padding: 3px 7px;
    border-radius: 10px;
    color: #222;
    &:hover {
      cursor: pointer;
    }
    &.hover,
    &.select {
      background: $mainColorL2;
      border: 1px solid $mainColorL3;
    }
  }
}

</style>

<script>
import blogList from '@/components/Blog/blogList'
import asideCard from '@/components/asideCard'

import fetchData from '@/store/fetchData'
import {parsingObjToStr} from '@/store/utils'

export default {
  data () {
    return {
      categories: [],
      blogList: {},
      currentIndex: undefined
    }
  },
  components: {
    asideCard,
    blogList
  },
  methods: {
    getCategories () {
      fetchData('/blog/getCategories', {}, 'GET').then((result) => {
        if (result.ok) {
          this.categories = result.msg
        }
      })
    },
    selectCategory (item, index) {
      this.blogList = {
        type: `category-${item._id}`,
        title: `类别：${item.content}`,
        findParamsStr: parsingObjToStr({
          categoryId: item._id
        })
      }
      this.currentIndex = index
    }
  },
  watch: {
    categories () {
      this.selectCategory(this.categories[0], 0)
    }
  },
  created () {
    this.getCategories()
  }

}
</script>
