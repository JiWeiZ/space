<template>
  <container :contentTitle="'个人中心'">
    <div class="user-center">
      <div class="user-intro">
        <div class="user-portrait">
          <img :src="user.portrait" height="100px" alt="用户头像">
          <p class="change" @click="openUploadPortrait">修改头像</p>
        </div>
        <div class="user-info">
          <p>昵称：{{user.userName}}</p>
          <p>邮箱：{{user.email}}</p>
          <p style="width: 90%">简介：{{user.briefIntro}}</p>
          <p class="change changeBrief" @click="openChangeInfo">修改资料</p>
          <ul>
            <li>
              <i>文章</i>
              <i>{{blogsNum}}</i>
            </li>
            <li>
              <i>草稿</i>
              <i>{{blogDraftsNum}}</i>
            </li>
            <li>
              <i>喜欢</i>
              <i>{{likedNum}}</i>
            </li>
            <li>
              <i>评论</i>
              <i>{{commentsNum}}</i>
            </li>
          </ul>
        </div>
      </div>
      <div class="user-display">
        <ul class="display-ul">
          <li
            v-for="(item, index) in liList"
            :key="index"
            class="display-li bottom-line"
            :class="{select: item.title === $route.query.title}"
          ><router-link :to="`/user/${user._id}/blogList?type=${item.type}&title=${item.title}&findParamsStr=${item.findParamsStr}`">
              <i :class="item.icon"></i><span>{{item.title}}</span>
            </router-link>
          </li>
        </ul>
          <router-view style="border: none;"></router-view>
      </div>
    </div>
    <div class="mask" v-if="showUploadPortrait">
      <div class="mask-content-wrapper">
        <div class="mask-content">
          <h4>上传头像</h4>
          <span @click="closeUploadPortrait" class="close"><i class="fas fa-times"></i></span>
          <div @click="uploadPortrait" v-show="beforeUpload" class="upload-area-before">
            <div class="upload">
              <p class="icon"><img style="width: 35px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEbUlEQVR4Xu2aTWgdVRTHz5l8LfyiipKlLnSnC9G4MQYrCIIUdSGVWjCmyTkTMbS6EJFCFqULwQ/CwzcnL1aN1UUofi3cqKWmIFJEEDeCIt1WF2mpEIKZd+TKPHkZ33tzZ+7MvD7e3E3g3Tvnnv/vnnPmzr1BGPKGQ64fKgBVBAw5gSoFhjwAqiLYtxQQkUcB4AgAhKp6ipm/6kc09gWAiBwFgLdigo8R0dtlQygdQBfxLd2lQygVQIL4vkAoDYCl+BaERSKql5EOpQAQER8A3kkpqBQIhQPIKL60SCgUgKP4UiAUBiAn8f9CQMS5hYWFUylTyGp4IQB6iVfVLUT8DQDub/dQVS8AwJ2IuK+D54qIR4qAkDuA1dXV51X13U74I/EzqvoKIh6KjTkNAK+r6rdlQsgVQCR+zURtHEBLPBH9HATB6U4AiOiwiNxdJoTcANiKN2B6ATD9BgIAnAeAmzqlQ7PZPOz7/kdWSZ4wKBcAvcQDwBUAmDYr3/IlCUAE4V4AOFs0BGcA9Xr9kOd5H3YK+0j8fiL6sX0hbACUBcEJQBbxNinQDktECo2EzACyik8LwCYSVPVpZj6TpSZkAuAiPgsACwjmUOVgFgipAbiKzwqgKAipAIjIEwDwSZqC1yksbYtgp2cTaoKJhAPM/KVtOlgDWF5e9iYnJ8029sYOxs2r7n/VvpsTLgCSIkFVLzLzHbkDWF9fv257e/svV/EuKRB/O0Q7xuvjPo2Pj++bnZ29bAPBOgIixzcRcbrNcKqVT7MRsnFeRB5Q1a8R8T8IqvorM99l87wZkwpAvV6/3fO8GgA8pKrfI+LL7Ts820ldU6B9nkajcU8Yhm8i4hQAbIZhuLS4uPi7rS+pANgaTRqXJ4CkuZL6KwBJhIroryKgx3lAEcB72axSoGziee0D8vK7ioC8SKaxUxXBqgh2PxVOE0l5jLWqAWtrazfv7u4eRMQ/d3Z2vlhaWtpxmVxEzC3PbLsNc5fAzOY/RjK3jY2Nka2tradU9VZVPeP7/h9JxhIB1Gq1W8bGxr4DgNYHxi+jo6NTc3NzV5OMd+sPguAlRHyjvb/ZbD7rctQdfa5/joiPR3avqOoMM//ktA8QEfPx80LMyDwRmQuQTG1lZWViYmLiUwB4LDJQI6IXMxmLHgqC4BlE/Dhm4wMies4VwDkAmImF6wlmPu7isHnWfF2av77vX3S1JSInAOC1mJ/nmPlhJwBBEMTPAIy9k0S0ZzJXAa7PB0FwEhFfjQHYZOY9ixefJ7EGVACqCBjyFBARc0G5p5Co6nlENL9fS+0RAHgwVgPOMrP5vWuzqQHvIWLPV8m1RCEG4H1m3rPhSl0Eo8sQ884exPYkEX3mFAGqiiJyARHvGyQCqvoDEU0hojoBiDYst3me1wCAA4MAwdwNjIyMTM/Pz19K8jexBrQbaDQa+8MwPIaINyQZ7lO/2f/XEfEbIvrbxodUAGwMDtqYCsCgrVje/lYRkDfRQbNXRcCgrVje/g59BPwDxZ9wX+EKb6cAAAAASUVORK5CYII=" alt=""></p>
              <p class="tips">点击上传图片</p>
              <input type="file" name="uploadImg" id="uploadImg" style="display: none;">
            </div>
          </div>
          <div class="upload-area-after" v-show="!beforeUpload">
            <div class="submit clearfix">
              <div class="imgPreview-wrapper" style="">
                <img class="imgPreview" id="imgPreview" :src="imgPreview" alt="图片预览">
                <waterWave @canvasFinish="uploadPortraitOK" ref="water" class="water" v-if="canvasWidth" :canvasWidth="canvasWidth" :canvasHeight="canvasHeight"></waterWave>
              </div>
              <p class="operation">
                <span @click="submitUploadPortrait" class="btn btn-primary-s">确定上传</span>
                <span @click="closeUploadPortrait" class="btn btn-warn-s">取消</span>
              </p>
            </div>
          </div>
          <p v-show="beforeUpload" style="margin: 10px 20px">图片大小不超过1MB</p>
          <p v-show="!beforeUpload" style="margin: 10px 20px">当前图片大小{{imgSize}}</p>
        </div>
      </div>
    </div>
    <div class="mask"  v-if="showChangeInfo">
      <div class="mask-content-wrapper">
        <div class="mask-content">
          <h4>修改资料</h4>
          <span @click="closeChangeInfo" class="close"><i class="fas fa-times"></i></span>
          <div class="main">
            <p>
              <label for="nickName">昵称：
                <input v-model="userName_toChange" style="padding: 4px;" type="text" id="nickName">
              </label>
            </p>
            <p>
              <label for="briefIntro">简介：
                <textarea v-model="briefIntro_toChange" style="vertical-align: top;padding: 8px" id="briefIntro" cols="50" rows="6"></textarea>
              </label>
            </p>
            <p>
              <span @click="submitChangeInfo" class="btn btn-primary-s">确定上传</span>
              <span @click="closeChangeInfo" class="btn btn-warn-s">取消</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </container>
</template>

<script>
import {mapState} from 'vuex'
import container from '@/components/container'
import waterWave from '@/components/waterWave'
import blogList from '@/components/Blog/blogList'
import blogAbstract from '@/components/Blog/blogAbstract'
import fetchData from '@/store/fetchData'
import {floor, parsingObjToStr} from '@/store/utils'

export default {
  components: {
    container,
    waterWave,
    blogList,
    blogAbstract
  },
  data () {
    return {
      blogListTitle: '',
      blogListType: '',
      currentLi: 0,
      liList: [
        {
          title: '文章',
          type: 'personalBlogs',
          findParamsStr: parsingObjToStr({
            userId: this.$route.params.id
          }),
          icon: 'far fa-file-alt mainColorL4'
        }, {
          title: '草稿',
          type: 'allBlogDrafts',
          icon: 'far fa-sticky-note mainColorL4'
        }, {
          title: '废纸篓',
          type: 'trash',
          icon: 'far fa-trash-alt mainColorL4'
        }, {
          title: '喜欢',
          type: 'like',
          icon: 'fas fa-heart pink'
        }
      ],
      blogsNum: undefined,
      blogDraftsNum: undefined,
      likedNum: undefined,
      commentsNum: undefined,
      showUploadPortrait: false,
      showChangeInfo: false,
      beforeUpload: true,
      uploadImg: {},
      imgPreview: '',
      imgSize: undefined,
      uploadToken: '',
      userName_toChange: '',
      briefIntro_toChange: '',
      canvasWidth: undefined,
      canvasHeight: undefined,
      newPortrait: undefined
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    showCanvas () {
      let img = document.querySelector('#imgPreview')
      this.canvasWidth = img.width
      this.canvasHeight = img.height
    },
    getUserStatistics () {
      let query = {
        userId: this.$route.params.id
      }
      fetchData('blog/userStatistics', query, 'GET').then(r => {
        this.blogsNum = r.msg.blogsNum
        this.blogDraftsNum = r.msg.blogDraftsNum
        this.likedNum = r.msg.likedNum
        this.commentsNum = r.msg.commentsNum
      })
    },
    openUploadPortrait () {
      this.showUploadPortrait = true
    },
    closeUploadPortrait () {
      this.showUploadPortrait = false
      this.uploadImg = {}
      this.imgPreview = ''
      this.imgSize = ''
      this.beforeUpload = true
      this.canvasWidth = undefined
      this.canvasHeight = undefined
    },
    uploadPortrait () {
      let uploadImg = this.$el.querySelector('#uploadImg')
      uploadImg.click()
      uploadImg.addEventListener('change', e => {
        e.stopImmediatePropagation()
        let file = uploadImg.files[0]
        this.uploadImg = file
        this.imgSize = (function (f) {
          let size
          if (f.size > 1048576) {
            size = floor(f.size / (1024 * 1024), 2)
            return `${size}MB`
          } else if (f.size > 1024 && f.size < 1048576) {
            size = floor(f.size / 1024, 2)
            return `${size}KB`
          } else {
            return `${f.size}bit`
          }
        })(file)
        let reader = new FileReader()
        reader.onload = (e) => {
          this.imgPreview = e.target.result
          this.beforeUpload = false
        }
        reader.readAsDataURL(file)
      })
    },
    uploadPortraitOK () {
      let user = this.user
      user.portrait = this.newPortrait
      this.$message('修改头像成功')
      setTimeout(() => {
        this.$store.commit('cmtChange', {param: 'user', value: user})
      }, 500)
      this.closeUploadPortrait()
    },
    submitUploadPortrait () {
      if (this.uploadImg.size > 1024 * 1024) {
        this.$message({
          content: '图片最大1MB',
          type: 'error'
        })
      } else {
        this.showCanvas()
        fetchData('/blog/uploadToken', {}, 'POST').then(r => {
          if (r.ok) {
            this.uploadToken = r.msg
          } else {
            throw new Error(r.msg)
          }
        }).then(() => {
          let formData = new FormData()
          formData.append('token', this.uploadToken)
          formData.append('file', this.uploadImg)
          fetchData('http://upload-z2.qiniup.com', formData, 'POST_FD').then(r => {
            this.newPortrait = r.url
            this.$refs.water.done = true
          }).then(() => {
            let postData = {
              portrait: this.newPortrait
            }
            fetchData('users/changeInfo', postData, 'POST')
          }).catch(e => {
            console.log(e)
          })
        }).catch(error => {
          this.$message({
            content: error.message,
            type: 'error'
          })
        })
      }
    },
    openChangeInfo () {
      this.userName_toChange = this.user.userName
      this.briefIntro_toChange = this.user.briefIntro
      this.showChangeInfo = true
    },
    closeChangeInfo () {
      this.userName_toChange = ''
      this.briefIntro_toChange = ''
      this.showChangeInfo = false
    },
    submitChangeInfo () {
      let postData = {
        userName: this.userName_toChange,
        briefIntro: this.briefIntro_toChange
      }
      fetchData('/users/changeInfo', postData, 'POST').then(r => {
        if (r.ok) {
          this.$message(r.msg)
          let user = this.user
          user.userName = this.userName_toChange
          user.briefIntro = this.briefIntro_toChange
          this.$store.commit('cmtChange', {param: 'user', value: user})
          this.closeChangeInfo()
        } else {
          this.$message({
            content: r.msg,
            type: 'error'
          })
        }
      })
    }
  },
  mounted: function () {
    if (this.blogListTitle === '' || this.blogListType === '') {
      this.blogListTitle = '文章'
      this.blogListType = 'allBlogs'
    }
    this.getUserStatistics()
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/static.scss';
.mainColorL4 {
  color: $mainColorL4;
}
.pink {
  color: #F77889
}
.user-center {
  .user-intro {
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    .change{
      padding-top: 3px;
      width: 4em;
      margin: 0 auto;
      font-size:14px;
      cursor: pointer;
      color: $mainColorL4;
      &:hover{
        color: $mainColorL5;
      }
    }
    .user-portrait{
      box-sizing: content-box;
      padding: 0 20px 0 0;
      img{
        padding-top: 3px;
        vertical-align: text-bottom;
      }
    }
    .user-info {
      flex: 1;
      padding-left: 20px;
      border-left: 2px solid;
      ul {
        color: #4d4e4e;
        li {
          display: inline-block;
          padding: 0 10px;
          border-right: 1px solid;
          i {
            display: block;
            text-align: right;
            margin-top: 2px;
          }
          span {
            display: block;
          }
        }
      }
      p {
        margin: 8px 0;
      }
      .changeBrief{
        position: absolute;
        top: 20px;
        right: 40px;
      }
    }
  }
  .user-display {
    .display-ul {
      display: flex;
      margin: 10px 10px 0 10px;
      padding-bottom: 2px;
      border-bottom: 1px solid $mainColorL3
    }
    .display-li{
      position: relative;
      margin-right: 2em;
      cursor: pointer;
      font-size: 20px;
      font-weight: 600;
      border-bottom: none;
      span{
        margin-left: 5px;
      }
    }
  }
}
.mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  .mask-content-wrapper{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: 4px;
    .mask-content{
      height: 300px;
      width: 600px;
      padding: 20px;
      font-size: 14px;
      color: #555;
      .close{
        position: absolute;
        font-size: 20px;
        color: #999;
        cursor: pointer;
        padding: 5px;
        top: 7px;
        right: 10px;
        font-weight: 100;
        &:hover{
          transform-origin: center;
          transform: scale(1.12)
        }
      }
      .upload-area-before {
        height: 160px;
        width: 93%;
        margin: 40px auto 20px auto;
        border: 1px solid #ccc;
        text-align: center;
        cursor: pointer;
        &:hover{
          background: #eee;
        }
        .icon{
          margin: 40px 0 20px 0;
        }
      }
      .upload-area-after {
        height: 160px;
        width: 93%;
        margin: 40px auto 20px auto;
        border: 1px solid #ccc;
        .submit{
          position: relative;
          height: 100%;
          .imgPreview-wrapper{
            position: relative;
            float: left;
            margin: 2px;
            padding: 2px;
            border: 1px dashed #ccc;
            height: 154px;
            max-width: 300px;
            .imgPreview{
              height: auto;
              width: auto;
              max-height: 100%;
              max-width: 100%;
            }
            .water{
              position: absolute;
              bottom: 2px;
              left: 2px;
            }
          }
          .operation{
            position: absolute;
            bottom: 10px;
            right: 25px;
          }
        }
      }
      .main{
        p:not(:last-child) {
          margin: 20px;
        }
        p:last-child{
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
