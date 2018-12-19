<template>
<div class="container">
  <div class="content">
    <h4 class="content-tile">{{contentTitle}}</h4>
    <div class="content-main clearfix">
      <slot></slot>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    contentTitle: String
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  overflow: hidden;
  margin: 0 auto;
  padding: 20px 30px;
  max-width: 1300px;
  min-width: 1000px;
  min-height: 600px;
}
.content-main {
  position: relative;
  margin: 20px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
}
</style>
