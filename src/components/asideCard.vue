<template>
  <div class="card-box">
    <h2>
      <slot name="card-title"></slot>
    </h2>
    <div class="card-main">
      <slot name="card-main"></slot>
    </div>
  </div>
</template>

<style scoped>
.card-box{
  border: 1px solid #c3c3c3;
  border-radius: 12px;
  width:240px;
  box-shadow: 2px 2px 2px #c3c3c3;
  background-color:#fff;
  margin: 0 auto 40px auto;
}
h2{
  position: relative;
  text-align: center;
  color:#555;
  margin: 10px;
}
h2::before{
  content: '';
  width: 40px;
  height:2px;
  background: #000;
  position: absolute;
  left: 10px;
  bottom: 50%;
}
h2::after{
  content: '';
  width: 40px;
  height:2px;
  background: #000;
  position: absolute;
  right: 10px;
  bottom: 50%;
}
.card-main{
  min-height: 200px;
}
</style>
