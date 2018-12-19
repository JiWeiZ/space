<template>
  <header>
    <nav>
      <ul>
          <li><router-link to="/"><img src="../assets/logo/logo-pic.png" style="max-height:41px" alt="logo-pic"></router-link></li>
          <li><router-link to="/home">首页</router-link></li>
          <li><router-link to="/Classify">归类</router-link></li>
          <li><router-link to="/labels">标签</router-link></li>
          <li><router-link to="/timeLine">时间轴</router-link></li>
          <li><router-link to="/shared">分享</router-link></li>
          <li><router-link to="/about">关于</router-link></li>
          <li class="li-search">
              <form action="">
                <input type="text" name="" id="" class="search-input" placeholder="搜索">
                <a class="search-btn" href=""><i class="fas fa-search"></i></a>
              </form>
            </li>
          <li v-if="isLogin">
            <router-link :to="`/user/${user._id}/blogList?type=personalBlogs&title=%E6%96%87%E7%AB%A0&findParamsStr=findParams%5BuserId%5D%3D${user._id}`">
              <img :src="user.portrait" alt="用户中心" style="max-height:41px;vertical-align: bottom;">
              <span>{{user.userName}}</span>
            </router-link>
            <span class="btn btn-primary-s" @click.prevent="logout" style="margin-left:15px">退出</span>
          </li>
          <li v-if="!isLogin">
            <span class="btn" @click="openLogin">登录</span>
            <span class="btn btn-primary-s" @click="openRegister">注册</span>
          </li>
          <li><div class="btn btn-primary" @click.prevent="edit">写文章</div></li>
      </ul>
    </nav>
    <transition>
      <!-- 登陆框 -->
      <div class="login-wrapper" v-if="loging">
        <article class="login-box">
          <p class="login-title">登陆</p>
          <span class="close" @click="close"><i class="fas fa-times"></i></span>
          <form class="login-form">
            <input type="text" placeholder="用户名/邮箱" v-model="userName">
            <input type="password" placeholder="密码" v-model="password">
          <p>忘记密码？<span class="info" @click="fogetpwd">找回密码</span></p>
            <button class="submit" @click.prevent="submitLogin">登陆</button>
          </form>
          <p>没有账号？<span class="info" @click="openRegister">注册</span></p>
          <section class="thirdParty">
            <p>第三方登陆</p>
            <ul>
              <li><a href=""><i style="color:#36ACFE" class="fab fa-qq"></i></a></li>
              <li><a href=""><i style="color:#11CC1B" class="fab fa-weixin"></i></a></li>
              <li><a href=""><i style="color:#F79723" class="fab fa-weibo"></i></a></li>
            </ul>
          </section>
        </article>
      </div>
      <!-- 注册框 -->
      <div class="login-wrapper" v-if="registering">
        <article class="login-box">
          <p class="login-title">注册</p>
          <span class="close" @click="close"><i class="fas fa-times"></i></span>
          <form class="login-form">
            <input type="text" placeholder="用户名" v-model="userName" @change="checkUserName">
            <p v-if="!isUserNameOK" class="warn">{{userNameTips}}</p>
            <input type="text" placeholder="请填写邮箱" v-model="email" @change="checkEmail">
            <p v-if="!isEmailOK" class="warn">{{emailTips}}</p>
            <p v-if="canSendCode" class="sendCode-wrapper">
              <input v-focus type="text" placeholder="查看邮箱，输入验证码"  v-model="validatecode" @change="checkValidateCode">
              <button class="sendCode" :class="{disabled: waitSendCode}" @click.prevent="sendCode">{{sendCodeTips}}</button>
            </p>
            <p v-if="canSendCode">请注意是否被错误拦截为垃圾邮件</p>
            <p v-if="!isValidateCodeOK" class="warn">{{validateCodeTips}}</p>
            <input type="password" placeholder="密码" v-model="password">
            <input type="password" placeholder="确认密码" v-model="passwordAgain">
            <p v-if="pwdDiff" class="warn">两次输入的密码不一致</p>
            <button class="submit"  @click.prevent="submitRegister">注册</button>
            <p v-if="submitTips" class="warn">{{submitTips}}</p>
          </form>
          <p class="info center" @click="openLogin">已有账号登陆</p>
          <section class="thirdParty">
            <p>第三方登陆</p>
            <ul>
              <li><a href=""><i style="color:#36ACFE" class="fab fa-qq"></i></a></li>
              <li><a href=""><i style="color:#11CC1B" class="fab fa-weixin"></i></a></li>
              <li><a href=""><i style="color:#F79723" class="fab fa-weibo"></i></a></li>
            </ul>
          </section>
        </article>
      </div>
      <!-- 忘记密码 -->
      <div class="login-wrapper" v-if="pwdchanging">
        <article class="login-box">
          <p class="login-title">忘记密码</p>
          <span class="close" @click="close"><i class="fas fa-times"></i></span>
          <form class="login-form">
            <input type="text" placeholder="请填写邮箱" v-model="email" @change="checkEmailRegex">
            <p v-if="!isEmailOK" class="warn">{{emailTips}}</p>
            <p class="sendCode-wrapper">
              <input v-focus type="text" placeholder="查看邮箱，输入验证码" autofocus v-model="validatecode" @change="checkValidateCode">
              <button class="sendCode" :class="{disabled: waitSendCode || !isEmailOK}" @click.prevent="sendCode('changePwd')">{{sendCodeTips}}</button>
            </p>
            <p v-if="canSendCode">请注意是否被错误拦截为垃圾邮件</p>
            <p v-if="!isValidateCodeOK" class="warn">{{validateCodeTips}}</p>
            <input type="password" placeholder="密码" v-model="password">
            <input type="password" placeholder="确认密码" v-model="passwordAgain">
            <p v-if="pwdDiff" class="warn">两次输入的密码不一致</p>
            <button class="submit"  @click.prevent="submitPwdChange">重置密码</button>
            <p v-if="submitTips" class="warn">{{submitTips}}</p>
          </form>
          <p class="info center" @click="openLogin">返回登陆</p>
        </article>
      </div>
    </transition>
  </header>
</template>

<script>
import fetchData from '@/store/fetchData'
import focus from '@/directives/focus'

export default {
  directives: {
    focus
  },
  data () {
    return {
      isLogin: false,
      isUserNameOK: false,
      isEmailOK: false,
      isValidateCodeOK: false,
      loging: false,
      registering: false,
      pwdchanging: false,
      waitSendCode: false,
      user: {},
      userName: '',
      password: '',
      passwordAgain: '',
      email: '',
      validatecode: '',
      sendCodeTips: '发送验证码',
      userNameTips: '',
      emailTips: '',
      validateCodeTips: '',
      submitTips: ''
    }
  },
  computed: {
    pwdDiff () {
      if (this.password !== '' && this.passwordAgain !== '') {
        return this.password !== this.passwordAgain
      } else {
        return false
      }
    },
    canSendCode () {
      return this.isUserNameOK && this.isEmailOK
    }
  },
  methods: {
    openLogin () {
      this.loging = true
      this.registering = false
      this.pwdchanging = false
    },
    openRegister () {
      this.loging = false
      this.registering = true
      this.pwdchanging = false
    },
    fogetpwd () {
      this.loging = false
      this.registering = false
      this.pwdchanging = true
    },
    close () {
      this.loging = false
      this.registering = false
      this.isUserNameOK = false
      this.pwdchanging = false
      this.isEmailOK = false
      this.isValidateCodeOK = false
      this.userName = ''
      this.password = ''
      this.passwordAgain = ''
      this.email = ''
      this.validatecode = ''
      this.userNameTips = ''
      this.emailTips = ''
      this.validateCodeTips = ''
      this.submitTips = ''
    },
    sendCode (type = 'register') {
      if (type === 'register') {
        if (!this.canSendCode) return
      } else if (type === 'changePwd') {
        if (!this.isEmailOK) return
      }

      if (!this.waitSendCode) {
        this.waitSendCode = !this.waitSendCode
        let i = 60
        const timer = setInterval(() => {
          i--
          this.sendCodeTips = `${i}秒后重试`
          if (i < 0) {
            clearInterval(timer)
            this.waitSendCode = !this.waitSendCode
            this.sendCodeTips = `发送验证码`
          }
        }, 1000)
      }
      fetchData('/users/getValidateCode', {email: this.email}, 'POST')
    },
    submitRegister () {
      const postData = {
        userName: this.userName,
        password: this.password,
        email: this.email,
        validatecode: this.validatecode
      }
      if (this.password === '' || this.passwordAgain === '') {
        alert('密码没填')
        return
      }
      fetchData('/users/submitRegister', postData, 'POST').then(result => {
        if (result.ok) {
          this.openLogin()
        } else {
          this.submitTips = result.msg
        }
      })
    },
    submitLogin () {
      const postData = {
        userName: this.userName,
        password: this.password
      }
      fetchData('/users/submitLogin', postData, 'POST').then(result => {
        if (result.msg === 'matched') {
          this.isLogin = true
          this.user = result.data.user
          this.$store.commit('cmtChange', {param: 'user', value: result.data.user})
          this.close()
        } else {
          alert('用户名或密码错误')
        }
      })
    },
    submitPwdChange () {
      const postData = {
        email: this.email,
        validatecode: this.validatecode,
        password: this.password
      }
      if (this.password === '' || this.passwordAgain === '') {
        alert('密码没填')
        return
      }
      fetchData('/users/submitPwdChange', postData, 'POST').then(result => {
        if (result.ok) {
          this.userName = postData.email
          this.openLogin()
        } else {
          this.submitTips = result.msg
        }
      })
    },
    checkLogin () {
      fetchData('/users/checkLogin', {}, 'POST').then(result => {
        if (result.msg) {
          this.isLogin = true
          this.user = result.data.user
          this.$store.commit('cmtChange', {param: 'user', value: result.data.user})
        } else {
          this.isLogin = false
        }
      })
    },
    logout () {
      this.$confirm('确定退出？').then(() => {
        fetchData('/users/logout', {}, 'POST').then(result => {
          if (result.msg) {
            this.isLogin = false
            this.user = {}
            this.$store.commit('cmtChange', {param: 'user', value: {}})
            this.$router.push('/home')
          }
        })
      }).catch(() => {
        this.$message({
          content: '已取消',
          type: 'success'
        })
      })
    },
    checkUserName () {
      if (this.userName === '') {
        this.isUserNameOK = false
        this.userNameTips = ''
        return
      }
      const postData = {
        userName: this.userName
      }
      fetchData('/users/checkUserName', postData, 'POST').then(result => {
        if (!result.ok) {
          this.isUserNameOK = false
          this.userNameTips = result.msg
        } else {
          this.isUserNameOK = true
          this.userNameTips = ''
        }
      })
    },
    checkEmail () {
      if (this.email === '') {
        this.isEmailOK = false
        this.emailTips = ''
        return
      }
      const postData = {
        email: this.email
      }
      fetchData('/users/checkEmail', postData, 'POST').then(result => {
        if (!result.ok) {
          this.isEmailOK = false
          this.emailTips = result.msg
        } else {
          this.isEmailOK = true
          this.emailTips = ''
        }
      })
    },
    checkEmailRegex () {
      if (this.email === '') {
        this.isEmailOK = false
        this.emailTips = ''
        return
      }
      const postData = {
        email: this.email
      }
      fetchData('/users/checkEmailRegex', postData, 'POST').then(result => {
        if (!result.ok) {
          this.isEmailOK = false
          this.emailTips = result.msg
        } else {
          this.isEmailOK = true
          this.emailTips = ''
        }
      })
    },
    checkValidateCode () {
      if (this.validatecode === '') {
        this.isValidateCodeOK = false
        this.validateCodeTips = ''
        return
      }
      const postData = {
        validatecode: this.validatecode,
        email: this.email
      }
      fetchData('/users/checkValidateCode', postData, 'POST').then(result => {
        if (!result.ok) {
          this.isValidateCodeOK = false
          this.validateCodeTips = result.msg
        } else {
          this.isValidateCodeOK = true
          this.validateCodeTips = ''
        }
      })
    },
    edit () {
      if (this.isLogin) {
        window.location.href = '#/edit'
      } else {
        this.$alert({
          content: '请先登录',
          type: 'error'
        })
      }
    }
  },

  mounted () {
    this.checkLogin()
    this.$store.commit('cmtChange', {value: this.$el.offsetHeight, param: 'headerHeight'})
  }
}
</script>

<style scoped>
/* @import "./../assets/css/universal.css"; */

.v-enter,
.v-leave-to {
  opacity: 0;
}

.v-enter-active,
.v-leave-active {
  transition: opacity .2s ease-in-out
}

header {
  background: #f8f8f8;
  color: #2fa0f0;
  font-weight: 500;
}
nav ul {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0.2em;
}
nav li {
  margin: 0 10px;
}
nav li.li-search{
  margin-right: 20px;
}
nav li:nth-last-child(2) {
  margin-left: auto;
}
a {
  color: #2fa0f0;
}
form {
  position: relative;
}
.search-input {
  padding: 0 40px 0 20px;
  width: 160px;
  height: 38px;
  font-size: 14px;
  border: 1px solid #eee;
  border-radius: 40px;
  background: #eee;
  color: #666;
  transition: width 0.5s;
  -moz-transition: width 0.5s;
  -webkit-transition: width 0.5s;
  -o-transition: width 0.5s;
  transition-delay: 0.1s;
  -moz-transition-delay: 0.1s;
  -webkit-transition-delay: 0.1s;
  -o-transition-delay: 0.1s;
}
.search-input:focus {
  outline: none;
  width: 225px;
}
input:-ms-input-placeholder,
input::-moz-placeholder,
input:-moz-placeholder,
input::-webkit-input-placeholder {
  color: #999;
}
a.search-btn {
  position: absolute;
  width: 30px;
  height: 30px;
  top: 4px;
  right: 5px;
  text-align: center;
  line-height: 30px;
  color: #999;
  font-weight: 100;
}
.search-input:focus + .search-btn {
  background-color: #999;
  border-radius: 50%;
  color: #fff;
}
.login-wrapper{
  position: fixed;
  top:0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99999;
  background: rgba(0,0,0,0.3);
  color:#000;
}
.login-wrapper .center{
  text-align: center
}
.login-wrapper .info{
  color:#2fa0f0;
  cursor:pointer
}
.login-box{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 2em;
  width: 350px;
  box-shadow: 2px 2px 5px #333;
  border-radius: 5px;
  background: #fff;
}
.login-title{
  font-size: 18px;
  padding: 10px 0px;
  border-bottom: 1px solid #c3c3c3;
}
.login-form{
  margin: 10px 0;
}
.login-form>*{
  margin: 8px 0;
}
.login-form input{
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 18px;
  padding: 0 10px;
  border: 1px solid #999;
}
.login-form input:focus{
  box-shadow: inset 0 0 4px 0 hsla(0, 0%, 0%, 0.08);
}
.login-form button{
  background: #0084FF;
  color: #fff;
  border: 0;
  cursor: pointer;
}
.login-form button:hover{
  background: #0077e6
}
.login-form .warn{
  color: red;
  margin: 0;
}
.sendCode-wrapper{
  position: relative;
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 18px;
}
.sendCode{
  position: absolute;
  top:0;
  right: 0;
  width: 6em;
  height: 100%;
  padding: 0 5px;
  font-size: 13px;
}
.submit{
  height: 40px;
  width: 100%;
  font-size: 18px;
  border-radius: 5px;
}
.login-form button.disabled{
  background: #999;
  cursor: not-allowed;
}
.thirdParty{
  margin-top:20px;
}
.thirdParty ul{
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}
.close{
  position: absolute;
  top:32px;
  right:25px;
  font-size: 20px;
  color: #2fa0f0;
  cursor: pointer;
  padding: 5px;
}
.close:hover i{
  transform-origin: center;
  transform: scale(1.2, 1.2)
}

</style>
