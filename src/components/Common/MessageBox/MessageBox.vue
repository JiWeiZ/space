<template>
<transition name="MessageBox">
  <div class="MessageBox-mask" v-if="show">
    <div class="MessageBox">
      <span class="MessageBox-close" @click="cancel"><i class="fas fa-times"></i></span>
      <p class="MessageBox-title">{{title}}</p>
      <div class="MessageBox-message">
        <i class="fas" :class="[iconType]"></i><span class="message-content" >{{content}}</span>
      </div>
      <div class="MessageBox-buttons">
        <div class="btn btn-primary" @click="confirm">{{confirmButtonText}}</div>
        <div class="btn btn-primary-s" @click="cancel">{{cancelButtonText}}</div>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
export default {
  data () {
    return {
      show: false,
      isConfirm: undefined,
      promise: undefined,
      resolve: undefined,
      reject: undefined
    }
  },
  props: {
    content: {type: String, default: '确定要进行该操作？'},
    type: {type: String, default: 'question'},
    title: {type: String, default: '提示'},
    confirmButtonText: {type: String, default: '确认'},
    cancelButtonText: {type: String, default: '取消'}
  },
  computed: {
    iconType () {
      switch (this.type) {
        case 'question':
          return 'fa-question-circle'
        case 'success':
          return 'fa-check-circle'
        case 'info':
          return 'fa-info-circle'
        case 'warn':
          return 'fa-exclamation-circle'
        case 'error':
          return 'fa-times-circle'
      }
    }
  },
  methods: {
    closeMsgBox () {
      this.show = false
    },
    showMsgBox () {
      this.show = true
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
      return this.promise
    },
    confirm () {
      this.show = false
      this.resolve()
    },
    cancel () {
      this.show = false
      this.reject('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/css/static.scss';

.MessageBox-enter,
.MessageBox-leave-to {
  opacity: 0;
}

.MessageBox-enter-active,
.MessageBox-leave-active {
  transition: opacity .2s ease-in-out
}

.MessageBox-mask {
  @include maskLayer;
  .MessageBox-close {
    @include boxClose;
    top: 7px;
    right: 10px;
    font-weight: 100;
  }
  .MessageBox{
    @include maskInnerBox;
    width: 450px;
    padding: 15px;
    .MessageBox-title {
      font-size: 18px;
    }
    .MessageBox-message {
      display: flex;
      margin-top: 15px;
      padding-right: 10px;
      align-content: center;
      color: #333;
      .fas {
        margin-left: 2px;
        font-size: 28px;
      }
      .fa-question-circle {
        color: $mainColorL4;
      }
      .fa-check-circle {
        color: $successColor;
      }
      .fa-info-circle {
        color: $infoColor;
      }
      .fa-exclamation-circle {
        color: $warnColor;
      }
      .fa-times-circle {
        color: $errorColor;
      }
      .message-content{
        line-height: 2em;
        margin-left: 0.8em;
      }
    }
    .MessageBox-buttons{
      margin-top: 10px;
      display: flex;
      flex-direction: row-reverse;
    }
  }
}

</style>
