<template>
  <div class="blog">
    <h1 class="title">{{title}}</h1>
    <div class="author clearfix">
      <router-link class="portrait" to=""><img :src="creator?creator.portrait:''" style="height: 50px" alt=""></router-link>
      <div class="info">
        <p>
          <router-link to=""><i style="color:#4D4E4E" class="fas fa-user"></i> {{creator?creator.userName:''}}</router-link>
        </p>
        <p class="meta">
          <span>{{addTimeS}}</span>
          <span>归类: {{category?category.content:''}}</span>
          <span>阅读: {{viewNum + 1}}</span>
        </p>
        <p class="meta">
          <span class="string-list">
            标签：<span style="margin-right: 5px;" v-for="(item, index) in labels" :key="index">{{item?item.content:''}}</span>
          </span>
        </p>
        <p class="operation">
          <span @click="toggleLike" v-if="liked" class="btn select"><i class="c1 fas fa-heart"></i><span class="c2">喜欢&nbsp;&nbsp;&nbsp;{{likedNumShow}}</span></span>
          <span @click="toggleLike" v-else class="btn"><i class="c1 far fa-heart"></i><span class="c2">喜欢&nbsp;&nbsp;&nbsp;{{likedNumShow}}</span></span>
        </p>
      </div>
    </div>
    <mavon-editor :value="sourceValue" :toolbarsFlag="false" :subfield="false" :defaultOpen="'preview'"></mavon-editor>
    <div class="comment-wrapper">
      <header>
        <h2>评论</h2>
        <p @click="toggleShowForm" class="leaveMsg"><i class="far fa-comment-alt"></i><span>我要评论</span></p>
      </header>
      <transition name="replyForm">
        <keep-alive>
          <reply-form
            @toggleShowForm="toggleShowForm"
            @updateComments="updateComments"
            v-if="showForm"
            :blogId="_id"
            :level="0"
          ></reply-form>
        </keep-alive>
      </transition>
      <commentL0
        @updateComments="updateComments"
        v-for="(item, index) in commentsShow"
        :key="index"
        v-bind="item"
      ></commentL0>
    </div>
  </div>
</template>

<script>
import 'mavon-editor/dist/css/index.css'
import { mavonEditor } from 'mavon-editor'
import fetchData from '@/store/fetchData'
import {timeStampToLocaleString} from '@/store/utils'
import commentL0 from '@/components/Blog/commentL0'
import replyForm from '@/components/Blog/replyForm'
import {mapState} from 'vuex'

export default {
  components: {
    mavonEditor,
    commentL0,
    replyForm
  },
  data () {
    return {
      showForm: false,
      likedNumShow: undefined,
      commentsShow: [],
      liked: undefined
    }
  },
  props: {
    _id: String,
    title: String,
    sourceValue: String,
    viewNum: Number,
    creator: Object,
    category: Object,
    labels: Array,
    comments: {type: Array, default: undefined},
    usersLiked: Array,
    isDeleted: Boolean,
    deleteTime: Number,
    latestUpdateTime: Number,
    addTime: Number
  },
  computed: {
    ...mapState(['user']),
    addTimeS () {
      return timeStampToLocaleString(this.addTime)
    }
  },
  methods: {
    toggleLike () {
      if (!this.user._id) {
        this.$message({
          content: '请先登录',
          type: 'error'
        })
      } else {
        this.liked = !this.liked
        const postData = {
          id: this._id,
          liked: this.liked
        }
        fetchData('/blog/like', postData, 'POST').then(r => {
          if (r.ok) {
            if (r.liked) {
              this.likedNumShow += 1
            } else {
              if (this.likedNumShow > 0) {
                this.likedNumShow -= 1
              }
            }
            this.$message(r.msg)
          } else {
            this.$message({
              content: r.msg,
              type: 'error'
            })
          }
        })
      }
    },
    toggleShowForm () {
      this.showForm = !this.showForm
    },
    updateComments () {
      let queries = {
        blogId: this._id
      }
      fetchData('/blog/comments', queries, 'GET').then(r => {
        if (r.ok) {
          this.commentsShow = r.msg
        }
      })
    }
  },
  watch: {
    comments () {
      this.updateComments()
    },
    usersLiked (newValue, oldValue) {
      function has (Arr, prop) {
        if (!Arr) return false
        for (let item of Arr) {
          if (prop === item) {
            return true
          }
        }
        return false
      }
      if (newValue && newValue.length >= 0) {
        this.likedNumShow = newValue.length
        this.liked = has(newValue, this.user._id)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/static.scss';
.replyForm-enter{
  transform: translateX(-110%);
}

.replyForm-leave-to {
  transform: translateX(110%);
}

.replyForm-enter-active,
.replyForm-leave-active {
  transition: all .4s ease-in-out
}
.blog{
  .title {
    word-break: break-word!important;
    word-break: break-all;
    margin: 20px 0 15px 0;
    font-family: -apple-system,SF UI Display,Arial,PingFang SC,Hiragino Sans GB,Microsoft YaHei,WenQuanYi Micro Hei,sans-serif;
    font-size: 34px;
    font-weight: 700;
    line-height: 1.3;
  }
  .author {
    margin: 0px 20px 20px 20px;
    .portrait {
      padding: 7.5px 0;
      float: left;
      line-height: 0;
      vertical-align: text-bottom;
    }
    .info {
      position: relative;
      overflow: hidden;
      padding-left: 10px;
      p{
        margin: 5px;
      }
      .meta {
        color: #777;
        font-size: 13px;
        &>span{
          margin-right: 5px;
        }
      }
      .operation {
        position: absolute;
        top: 0;
        right: 0;
        .c1 {
          padding-left: 3px;
          padding-right: 5px;
        }
        .c2 {
          padding-right: 3px;
        }
        .btn {
          border: 1px solid hsl(358, 79%, 65%);
          border-radius: 20px;
          background: $errorBgColor;
          color: hsl(358, 79%, 65%);
        }
        .select {
          border: 1px solid hsl(358, 79%, 65%);
          border-radius: 20px;
          background: hsl(358, 79%, 65%);
          color: #fff;
        }
        }
      }
    }
  }
  .comment-wrapper{
    position: relative;
    margin: 20px 0;
    width: 100%;
    height: 100%;
    padding: 8px 25px 15px 25px;
    overflow-y: auto;
    box-sizing: border-box;
    overflow-x: hidden;
    background: #fff;
    border: none;
    box-shadow: 0 0px 3px rgba(0,0,0,0.157), 0 0px 3px rgba(0,0,0,0.227);
    line-height: 24px;
    h2{
      display: inline-block;
      margin: 10px 0;
    }
    .leaveMsg{
      display: inline-block;
      cursor: pointer;
      margin: 0 20px;
      i{
        margin: 0 5px;
      }
    }
  }
</style>
