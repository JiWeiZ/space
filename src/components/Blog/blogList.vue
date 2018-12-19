<template>
  <div style="min-height: 600px" class="blog-list">
    <header class="clearfix">
      <span class="blog-list-title">{{title}}</span>
      <!-- <span @click="clearAll" v-if="isTrash" class="blog-list-clearAll btn btn-warn-s">清空废纸篓</span> -->
      <p class="blog-list-more">
        <span :class="{select: currentSort === index}" @click="sort(item, index)" v-for="(item, index) in sortParams" :key="index"><span>{{item.title}}</span><i v-if="item.sort < 0" class="fas fa-sort-amount-down"></i><i v-else class="fas fa-sort-amount-up"></i></span>
      </p>
    </header>
    <div v-if="blogs && blogs.length">
      <blog-abstract
        v-for="(blog, index) in blogs"
        :key="index"
        v-bind="blog"
        @deleteAbstract="onDeleteBlogAbstract(index)"
        ref="blogAbstract"
      ></blog-abstract>
      <footer v-if="totalPage > 1">
        <p>
          <span class="previous-page" @click="previousPage">上一页</span>
          <span v-if="totalNumArr.length <= 8">
            <span :class="{select: currentPage === item + 1 }" class="page-num" v-for="(item, index) in totalNumArr" :key="index" @click="currentPage=item+1">{{item+1}}</span>
          </span>
          <span v-else style="font-size:0">
            <span :class="{select: currentPage === item + 1 }" class="page-num" v-for="(item, index) in totalNumArrHead" :key="index" @click="currentPage=item+1">{{item+1}}</span>
            <span class="page-num">...</span>
            <span :class="{select: currentPage === item + 1 }" class="page-num" v-for="(item, index) in totalNumArrTail" :key="index" @click="currentPage=item+1">{{item+1}}</span>
          </span>
          <span class="next-page" @click="nextPage">下一页</span>
          <span>共{{totalPage}}页</span>
          <span>跳至<input type="text" style="margin:0 3px;width:30px" v-model.lazy="currentPage">页</span>
        </p>
      </footer>
    </div>
    <div v-if="isBlogsNone" style="text-align: center;color: #555">
      <img src="../../assets/pics/wishlist.jpg" alt="">
      <p>守着你离开后的世界 空空如也</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../assets/css/static.scss';

.blog-list{
  margin: 20px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px 20px 10px 20px;
  background: #fff;
  header {
    position: relative;
    border-bottom: 1px solid;
    padding-bottom: 15px;
    .blog-list-title {
      font-size: 19px;
      font-weight: 700;
    }
    .blog-list-clearAll{
      position: absolute;
      top: -10px;
      left: 100px;
    }
    .blog-list-more {
      font-size: 14px;
      color: #777;
      float: right;
      margin-right: 15px;
      display: flex;
      .select{
        color: $mainColorL5;
        background: #ddd;
      }
      &>span{
        cursor: pointer;
        padding: 3px 5px;
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        &:first-child{
          border-left: 1px solid #ccc;
        }
        &:last-child{
          border-right: 1px solid #ccc;
        }
        &>i{
          padding: 0 3px;
        }
      }
    }
  }
  footer{
    padding-top: 10px;
    p{
      text-align: right;
    }
    .previous-page,
    .next-page,
    .page-num {
      cursor: pointer;
      &:hover,
      &.select {
        color: #2790DA;
        border-bottom: 1px solid #2790DA
      }
    }
    .page-num {
      margin-right: 5px;
      font-size: 15px;
    }
  }
}

</style>

<script>
import blogAbstract from '@/components/Blog/blogAbstract'

import fetchData from '@/store/fetchData'
import {range, parsingStrToObj} from '@/store/utils'
export default {
  name: 'blogList',
  components: {
    blogAbstract
  },
  data () {
    return {
      blogs: [],
      isBlogsNone: false,
      totalNum: 1,
      totalNumArrHead: [0, 1, 2, 3],
      currentPage: 1,
      currentSort: 0,
      sortParams: [
        {title: '最近发布', param: 'addTime', sort: -1},
        {title: '最近更新', param: 'latestUpdateTime', sort: -1},
        {title: '阅读数量', param: 'viewNum', sort: -1},
        {title: '喜欢数量', param: 'likedNum', sort: -1},
        {title: '评论数量', param: 'commentsNum', sort: -1}
      ],
      sortParamSelect: ''
    }
  },
  props: {
    title: String,
    type: String,
    findParamsStr: String,
    pageSize: {type: Number, default: 10}
  },
  computed: {
    totalPage () {
      return Math.ceil(this.totalNum / this.pageSize)
    },
    totalNumArr () {
      return range(0, this.totalPage)
    },
    totalNumArrTail () {
      return this.totalNumArr.slice(-4)
    },
    findParams () {
      if (this.findParamsStr) {
        return parsingStrToObj(this.findParamsStr)
      } else {
        return {}
      }
    },
    isTrash () {
      if (this.blogs) {
        return this.blogs.map(e => e.isDeleted).every(e => e)
      } else {
        return undefined
      }
    }
  },
  methods: {
    sort (item, index) {
      this.currentSort = index
      let sort = -1 * item.sort
      for (let param of this.sortParams) {
        param.sort = -1
      }
      this.sortParams[index].sort = sort
      if (sort > 0) {
        this.sortParamSelect = item.param
      } else {
        this.sortParamSelect = `-${item.param}`
      }
    },
    getBlogs () {
      const params = {
        type: this.type,
        page: this.currentPage,
        pageSize: this.pageSize,
        sortParams: [this.sortParamSelect],
        findParams: this.findParams
      }
      fetchData('/blog/getBlogList', params, 'GET').then((r) => {
        if (r.ok) {
          this.blogs = r.msg
          this.isBlogsNone = r.msg && r.msg.length === 0
          this.totalNum = r.totalNum
        }
      })
    },
    previousPage () {
      if (this.currentPage > 1) {
        this.currentPage -= 1
      } else {
        this.$message({
          content: '别点了，到头了',
          type: 'warn'
        })
      }
    },
    nextPage () {
      if (this.currentPage < this.totalPage) {
        this.currentPage += 1
      } else {
        this.$message({
          content: '别点了，到头了',
          type: 'warn'
        })
      }
    },
    onDeleteBlogAbstract (index) {
      this.blogs.splice(index, 1)
    },
    clearAll () {
      if (!this.isTrash) return
      this.$confirm({
        content: '清空后不可恢复，确定继续？',
        type: 'warn',
        cancelButtonText: '算了算了'
      })
        .then(() => {
          Promise.all(this.$refs.blogAbstract.map(e => {
            e.$realDelete()
          })).then(() => {
            this.$message({
              content: '已清空！',
              type: 'success'
            })
          })
        })
        .catch(() => {
          this.$message({
            content: '已取消',
            type: 'success'
          })
        })
    }
  },
  watch: {
    currentPage (newValue, oldValue) {
      if (newValue > this.totalPage) this.currentPage = this.totalPage
      if (newValue < 1) this.currentPage = 1
      this.getBlogs()
    },
    type () {
      this.currentPage = 1
      this.getBlogs()
    },
    sortParams: {
      handler: function () {
        this.getBlogs()
      },
      deep: true
    }
  },
  mounted () {
    this.getBlogs()
  }
}
</script>
