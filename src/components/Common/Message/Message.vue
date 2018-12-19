<template>
  <transition name="message">
    <div v-if="show" class="message-box" :class="[type]">
      <i class="fas" :class="[iconType]"></i><span class="message-content" >{{content}}</span>
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
    type: {type: String, default: 'info'}
  },
  methods: {
    showMsg () {
      this.show = true
      setTimeout(() => {
        this.show = false
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/css/static.scss';

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
  transform: translateX(-50%);
  border-radius: 5px;
  display: inline-block;
  padding: 0.8em 1.2em;
  border: 1px solid $mainColorL1;
  z-index: 99999;
  .message-content {
    height: 1.5em;
    line-height: 1.5em;
    margin-left: 0.6em;
  }
}
</style>
