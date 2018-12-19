<template>
  <div class="commentL1">
    <div class="commentL1-main">
      <p @click="toggleShowForm" class="leaveMsg"><i class="far fa-comment-alt"></i><span>回复</span></p>
      <p><span class="commentL1-author">{{creator?creator.userName : touristName}} 回复 {{peopleReplied}}：</span><i class="commentL1-time">发布于 {{addTimeS}}</i></p>
      <p class="commentL1-content">&nbsp;&nbsp;{{content}}</p>
    </div>
    <transition name="replyForm">
      <keep-alive>
        <reply-form
          @updateComments="updateComments"
          @toggleShowForm="toggleShowForm"
          v-if="showForm"
          :blogId="replyBlog"
          :commentL0Id="replyCommentL0._id"
          :commentL1Id="_id"
          :level="1"
        ></reply-form>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import replyForm from '@/components/Blog/replyForm'
import {timeStampToLocaleString} from '@/store/utils'

export default {
  data () {
    return {
      showForm: false
    }
  },
  props: {
    _id: String,
    touristName: String,
    content: String,
    addTime: Number,
    creator: Object,
    replyBlog: String,
    replyCommentL0: Object,
    replyCommentL1: Object
  },
  computed: {
    addTimeS () {
      return timeStampToLocaleString(this.addTime)
    },
    peopleReplied () {
      let { replyCommentL0, replyCommentL1 } = this
      if (replyCommentL1) {
        if (replyCommentL1.touristName) {
          return replyCommentL1.touristName
        } else if (replyCommentL1.creator.userName) {
          return replyCommentL1.creator.userName
        }
      } else {
        if (replyCommentL0.touristName) {
          return replyCommentL0.touristName
        } else if (replyCommentL0.creator.userName) {
          return replyCommentL0.creator.userName
        }
      }
    }
  },
  components: {
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

.commentL1{
  margin: 3px 0;
  width: 100%;
  height: 100%;
  padding: 10px 15px;
  border-radius: 4px;
  overflow-y: auto;
  box-sizing: border-box;
  overflow-x: hidden;
  background: #eee;
  line-height: 24px;
  .commentL1-main{
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
  .commentL1-author {
    margin-right: 10px;
  }
  .commentL1-time {
    color: #777;
  }
}
</style>
