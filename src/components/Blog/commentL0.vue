<template>
  <div class="commentL0">
    <div class="commentL0-main">
      <p @click="toggleShowForm" class="leaveMsg"><i class="far fa-comment-alt"></i><span>回复</span></p>
      <p><span class="commentL0-author">{{creator?creator.userName : touristName}}：</span><i class="commentL0-time">发布于 {{addTimeS}}</i></p>
      <p class="commentL0-content">&nbsp;&nbsp;{{content}}</p>
    </div>
    <transition name="replyForm">
      <keep-alive>
        <reply-form
          @updateComments="updateComments"
          @toggleShowForm="toggleShowForm"
          v-if="showForm"
          :blogId="replyBlog"
          :commentL0Id="_id"
          :level="1"
        ></reply-form>
      </keep-alive>
    </transition>
    <commentL1
      @updateComments="updateComments"
      v-for="(item, index) in commentsL1"
      :key="index"
      v-bind="item"
    ></commentL1>
  </div>
</template>

<script>
import commentL1 from '@/components/Blog/commentL1'
import replyForm from '@/components/Blog/replyForm'
import {timeStampToLocaleString} from '@/store/utils'

export default {
  data () {
    return {
      showForm: false,
      replies: []
    }
  },
  props: {
    _id: String,
    touristName: String,
    content: String,
    addTime: Number,
    creator: Object,
    replyBlog: String,
    commentsL1: Array
  },
  computed: {
    addTimeS () {
      return timeStampToLocaleString(this.addTime)
    }
  },
  components: {
    commentL1,
    replyForm
  },
  methods: {
    toggleShowForm () {
      this.showForm = !this.showForm
    },
    updateComments () {
      this.$emit('updateComments')
    }
  }
}
</script>

<style lang="scss" scoped>
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

.commentL0{
  margin: 10px 0;
  width: 100%;
  height: 100%;
  padding: 0px 25px 15px 25px;
  overflow-y: auto;
  box-sizing: border-box;
  overflow-x: hidden;
  background: #fff;
  border-bottom: 1px solid rgba(0,0,0,0.157);
  line-height: 24px;
  .commentL0-main{
    position: relative;
  }
  .leaveMsg{
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    i {
      margin: 5px;
    }
  }
  .commentL0-author {
    margin-right: 10px;
  }
  .commentL0-time {
    color: #777;
  }
}
</style>
