<template>
<footer>
  <div class="footer-inter">
    <div class="footer-links">
      <ul class="link-list">
          <li class="title">友情链接</li>
          <li><a href="https://developer.mozilla.org/zh-CN/">MDN</a></li>
          <li><a href="https://cn.vuejs.org/v2/guide/">Vue.js</a></li>
          <li><a href="https://mongoosejs.com/docs/guide.html">Mongoose文档</a></li>
      </ul>
    </div>
    <div class="footer-sub">
      <p>Powered by SpaceBlog</p>
    </div>
  </div>
</footer>
</template>

<style scoped>
a {
  color: #bbb;
}
footer {
  background: #4d4e4e;
  padding: 30px 100px 10px 100px;
  font-size: 13px;
  line-height: 20px;
  color: #888;
}
.footer-inter {
  display: flex;
  flex-direction: column;
}
.link-list {
  display: flex;
  margin-bottom: 10px;
}
.link-list > li {
  margin-right: 1em;
}
.footer-about {
  margin: 20px 0;
  display: flex;
}
.footer-about p{
  width: 70%;
}
.footer-about-left{
  max-width: 900px;
}
.footer-sub{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>

<script>
export default {
  mounted () {
    this.$store.commit('cmtChange', {value: this.$el.offsetHeight, param: 'footerHeight'})
  }
}
</script>
