<template>
  <div>
    <head-top class="head-top"></head-top>
    <article class="main-article">
      <!-- <transition name="main" appear> -->
        <router-view></router-view>
      <!-- </transition> -->
    </article>
    <footer-buttom class="footer-bottom"></footer-buttom>
  </div>
</template>

<script>
import headTop from './components/header.vue'
import footerButtom from './components/footer.vue'

export default {
  name: 'App',
  components: {
    headTop,
    footerButtom
  }
}
</script>

<style>
/* @import './../static/css/font-awesome.min.css'; */
@import './../static/css/normalize.min.css';
@import './../src/assets/css/universal.css';

.main-enter {
  opacity: 0;
}

.main-enter-active {
  transition: opacity .5s ease-in-out
}

/* .main-enter,
.main-leave-to {
  opacity: 0;
}

.main-enter-to,
.main-leave {
  opacity: 1;
}

.main-enter-active,
.main-leave-active {
  transition: opacity .5s ease-in-out
} */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html,
body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-size: 15px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-width: 1050px;
}
a {
  text-decoration: none;
}
li {
  list-style-type: none;
}
.main-article{
  background: #DADADA;
  min-height: 570px;
}
</style>
