<template>
  <div class="reply-form-wrapper clearfix">
    <div class="reply-form">
      <div v-if="!user._id">
        <p>
          <input type="text" v-model="touristName"><span>未登录&nbsp;&nbsp;请填写名称（必填）</span>
        </p>
        <p>
          <input type="text" v-model="touristEmail"><span>未登录&nbsp;&nbsp;请填写邮箱（必填，不会公开）</span>
        </p>
      </div>
      <p>
        <textarea v-model="content" name="" id="" cols="50" rows="10" placeholder="有事儿没事儿整两句"></textarea>
      </p>
      <p>
        <span @click="submit" style="margin-left:0" class="btn-s btn-primary-s">确定</span>
        <span @click="emitToggle" class="btn-s btn-warn-s">取消</span>
      </p>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import fetchData from '@/store/fetchData'

export default {
  props: {
    blogId: String,
    commentL0Id: String,
    commentL1Id: String,
    level: Number
  },
  data () {
    return {
      touristName: '',
      touristEmail: '',
      content: ''
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    emitToggle () {
      this.$emit('toggleShowForm')
    },
    submit () {
      let postData = {
        blogId: this.blogId,
        commentL0Id: this.commentL0Id,
        commentL1Id: this.commentL1Id,
        level: this.level,
        touristName: this.touristName,
        touristEmail: this.touristEmail,
        content: this.content
      }
      fetchData('/blog/comment', postData, 'POST').then(r => {
        if (r.ok) {
          this.$message({
            content: '评论成功',
            type: 'success'
          })
          this.$emit('updateComments')
          setTimeout(() => {
            this.$emit('toggleShowForm')
            this.content = ''
          }, 200)
        } else {
          this.$message({
            content: r.msg,
            type: 'error'
          })
        }
      })
    }
  },
  mounted () {
    let input = this.$el.querySelectorAll('input')[0]
    let textarea = this.$el.querySelector('textarea')
    if (input) {
      input.focus()
    } else if (textarea) {
      textarea.focus()
    }
  }
}
</script>

<style lang="scss" scoped>
.reply-form-wrapper{
  margin: 10px 0;
  width: 100%;
  height: 100%;
  padding: 10px 20px;
  overflow-y: auto;
  box-sizing: border-box;
  overflow-x: hidden;
  background: #fff;
  box-shadow: 0 0px 3px rgba(0,0,0,0.157), 0 0px 3px rgba(0,0,0,0.227);
  line-height: 24px;
  .reply-form{
    display: inline-block;
    p{
      margin: 8px;
      textarea{
        padding: 5px;
      }
      span {
        margin: 0 8px;
        color: #777;
        font-size: 14px;
      }
      .btn-s{
        color: #000;
      }
    }
  }
}
</style>
