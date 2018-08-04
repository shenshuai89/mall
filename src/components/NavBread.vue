<template>
    <div class="bread">
        <nav class="container bread-wrap">
            <a href="/">首页</a>
            <slot></slot>
        </nav>
    </div>
</template>

<script>
    export default{
        name:"navBread"
    }
</script>

<style scoped>
  .bread{
      height: 45px;
      line-height: 45px;
      background-color: #f0f0f0;
      margin:0 auto;
  }
  .bread-wrap{
      padding: 0 10px;
      text-align: left;
      font-size: 14px;
      color: #a1a1a1;
  }
  .bread-wrap a{
    position: relative;
    margin-right: 3px;
  }
  .bread-wrap a:after{
      position: absolute;
      top: 0px;
      content:'/';
      height:20px;
      line-height: 20px;
  }
  .bread-wrap span{
      color:#d1434a;
  }
</style>