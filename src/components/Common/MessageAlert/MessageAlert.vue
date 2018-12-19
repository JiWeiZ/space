<template>
  <transition name="message">
    <div v-if="show" class="message-box" :class="[type]">
      <span class="message-close" @click="closeMsg"><i class="fas fa-times"></i></span>
      <div class="message-content-wrapper">
        <i class="fas" :class="[iconType]"></i><span class="message-content" >{{content}}</span>
      </div>
      <div class="message-box-button">
        <div class="btn btn-primary" @click="closeMsg">{{confirmBtnText}}</div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data () {
    return {
      show: undefined
    }
  },
  computed: {
    iconType () {
      switch (this.type) {
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
  props: {
    content: {type: String},
    type: {type: String, default: 'info'},
    confirmBtnText: {type: String, default: '知道了'}
  },
  methods: {
    showMsg () {
      this.show = true
      setTimeout(() => {
        this.show = false
      }, 5000)
    },
    closeMsg () {
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/css/static.scss';
.btn {
  padding: 5px;
  font-size: 14px;
  border-radius: 3px;
  margin: 0;
  float: right;
}
.message-enter-active,
.message-leave-active {
  transition: all .4s ease-in-out;
}

.message-enter,
.message-leave-to {
  top: -55px !important;
  opacity: 0;
}
.message-leave,
.message-enter-to {
  top: 30px !important;
}

.success{
  color: $successColor;
  background: $successBgColor;
}
.info{
  color: $infoColor;
  background: $infoBgColor;
}
.error{
  color: $errorColor;
  background: $errorBgColor;
}
.warn{
  color: $warnColor;
  background: $warnBgColor;
}
.message-box {
  position: fixed;
  top: 30px;
  left: 50%;
  width: 300px;
  transform: translateX(-50%);
  border-radius: 5px;
  border: 1px solid $mainColorL1;
  display: inline-block;
  padding: 0.8em 1.2em;
  z-index: 99999;
  .message-content-wrapper{
    margin:7px 10px 0 0;
  }
  .message-content {
    height: 1.5em;
    line-height: 1.5em;
    margin: 0 0.6em;
  }
  .message-box-button {
    margin-top: 5px;
  }
  .message-close {
    @include boxClose;
    top: 6px;
    right: 8px;
    font-size: 12px;
  }
}
</style>
