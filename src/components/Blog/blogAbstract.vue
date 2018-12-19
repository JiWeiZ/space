<template>
  <article>
    <section class="blog-abstract clearfix">
      <div v-if="imgAbstract" class="img-abstract">
        <router-link v-if="isDraft" :to="'/blog/draft/' + _id"><img width="135px" :src="imgAbstract" alt=""></router-link>
        <router-link v-else :to="'/blog/' + _id"><img width="135px" :src="imgAbstract" alt=""></router-link>
      </div>
      <div class="blog-abstract-content">
        <header>
          <p class="title-p">
            <span v-if="showRealDelete">{{isDraft ? '[草稿]' : '[博文]'}}</span>
            <span v-if="isDeleted">
              <span class="title">{{title}}</span>
            </span>
            <span v-else>
              <router-link class="title bottom-line" v-if="isDraft" :to="'/blog/draft/' + _id">{{title}}</router-link>
              <router-link class="title bottom-line" v-else :to="'/blog/' + _id">{{title}}</router-link>
            </span>
            <span class="author"><i style="color:#4D4E4E" class="fas fa-user"></i> {{creator.userName}}</span>
            <span v-if="showDelete" class="operation">
              <span @click="deleteBlog" class="btn-s btn-warn">删除</span>
            </span>
            <span v-if="showEdit" class="operation">
              <router-link class="btn-s btn-primary-s" :to="'/blog/edit/' + _id">编辑</router-link>
            </span>
            <span v-if="showRealDelete" class="operation">
              <span @click="restoreBlog" class="btn-s btn-primary-s">恢复</span>
              <span @click="realDeleteBlog" class="btn-s btn-warn">彻底删除</span>
            </span>
          </p>
          <p class="info">
            <span><i style="color:#2FA0F0" class="fas fa-book"></i> 归类：{{category? category.content : '未填写'}}</span>
            <span><i style="color:#2FA0F0" class="far fa-clock"></i> 创建时间：{{addTimeS}}</span>
            <span><i style="color:#2FA0F0" class="far fa-clock"></i> 最近更新：{{latestUpdateTimeS}}</span>
            <span v-if="isDeleted" ><i style="color:#2FA0F0" class="far fa-clock"></i> 删除时间：{{deleteTimeS}}</span>
          </p>
        </header>
        <p class="content">{{abstract}}</p>
      </div>
    </section>
    <section class="blog-footer clearfix">
      <span><i style="color:#777" class="fa fa-eye"></i> 阅读 ({{viewNum}})</span>
      <span><i style="color:#777" class="fas fa-heart"></i> 喜欢 ({{usersLiked?usersLiked.length:0}})</span>
      <span><i style="color:#777" class="fas fa-comment-alt"></i> 评论 ({{comments?comments.length:0}})</span>
      <span class="string-list">
        <i style="color:#777" class="fa fa-tag"></i>&nbsp;标签: <span class="blog-label" v-for="(item, index) in labels" :key="index">{{item.content}}</span>
      </span>
    </section>
  </article>
</template>

<style lang="scss" scoped>
article {
  border-bottom: 1px solid #ccc;
  padding: 20px 0 5px 10px;
  background: #fff;
  .blog-abstract {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    .img-abstract {
      float: left;
      margin: auto 0;
    }
    .blog-abstract-content {
      padding-left: 15px;
      overflow: hidden;
      header {
        margin-bottom: 10px;
      }
      .title-p{
        margin-bottom: 10px;
        .title{
          font-size: 19px;
          font-weight: 700;
        }
        .author{
          margin: 0 20px;
        }
        .operation{
          float: right;
          margin-right: 10px;
        }
      }
      .info{
        font-size: 13px;
        span{
          margin-right: 5px;
        }
      }
      .content{
        width: 90%;
        line-height: 1.5em;
      }
    }
  }
  .blog-footer {
    color: #777;
    font-size: 12px;
    line-height: 1.5em;
    &>span {
      float: left;
      margin-right: 10px;
      .blog-label{
        margin-right: 3px;
      }
    }
  }
}
</style>

<script>
import {mapState} from 'vuex'
import fetchData from '@/store/fetchData'
import {timeStampToLocaleString} from '@/store/utils'

export default {
  props: {
    _id: String,
    isDraft: Boolean,
    isDeleted: Boolean,
    creator: Object,
    title: String,
    imgAbstract: String,
    abstract: String,
    category: Object,
    labels: Array,
    addTime: Number,
    latestUpdateTime: Number,
    deleteTime: Number,
    viewNum: {type: Number, default: 0},
    usersLiked: Array,
    comments: Array,
    collectNum: {type: Number, default: 0}
  },
  computed: {
    ...mapState(['user']),
    showEdit () {
      const regex = /user\/\w{24}\/blogList\?type=personalBlogs\S+/
      return regex.test(this.$route.fullPath) && this.user._id === this.creator._id
    },
    showDelete () {
      const regex = /user\/\w{24}\/blogList\?type=(personalBlogs|allBlogDrafts)\S+/
      return regex.test(this.$route.fullPath) && this.user._id === this.creator._id
    },
    showRealDelete () {
      const regex = /user\/\w{24}\/blogList\?type=trash\S+/
      return regex.test(this.$route.fullPath) && this.user._id === this.creator._id && this.isDeleted
    },
    addTimeS () {
      return timeStampToLocaleString(this.addTime)
    },
    latestUpdateTimeS () {
      return timeStampToLocaleString(this.latestUpdateTime)
    },
    deleteTimeS () {
      return timeStampToLocaleString(this.deleteTime)
    }
  },
  methods: {
    sayId () {
      console.log(this._id)
    },
    deleteBlog () {
      this.$confirm({
        content: '确定删除？',
        type: 'warn'
      })
        .then(() => {
          let postData = {
            id: this._id,
            realDelete: false,
            isDraft: this.isDraft
          }
          fetchData('/blog/delete', postData, 'POST').then(r => {
            if (r.ok) {
              this.$emit('deleteAbstract')
              this.$message({
                content: r.msg,
                type: 'success'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            content: '已取消删除',
            type: 'success'
          })
        })
    },
    restoreBlog () {
      this.$confirm({
        content: '确定恢复？',
        type: 'warn'
      })
        .then(() => {
          let postData = {
            id: this._id,
            isDraft: this.isDraft
          }
          fetchData('/blog/restore', postData, 'POST').then(r => {
            if (r.ok) {
              this.$emit('deleteAbstract')
              this.$message({
                content: r.msg,
                type: 'success'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            content: '已取消',
            type: 'success'
          })
        })
    },
    realDeleteBlog () {
      if (!this.isDeleted) return
      this.$confirm({
        content: '彻底删除后不可恢复，确定继续？',
        type: 'warn'
      }).then(() => {
        let postData = {
          id: this._id,
          realDelete: true,
          isDraft: this.isDraft
        }
        fetchData('/blog/delete', postData, 'POST').then(r => {
          if (r.ok) {
            this.$emit('deleteAbstract')
            this.$message({
              content: r.msg,
              type: 'success'
            })
          }
        })
      }).catch(() => {
        this.$message({
          content: '已取消删除',
          type: 'success'
        })
      })
    },
    $realDelete () {
      if (!this.isDeleted) return
      let postData = {
        id: this._id,
        realDelete: true,
        isDraft: this.isDraft
      }
      return fetchData('/blog/delete', postData, 'POST')
    }
  }
}
</script>
