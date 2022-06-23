<template>
  <div class="container-index">
    <h1>index</h1>
    <div class="nav">
      <router-link to="/shuffle">1.洗牌动画</router-link><br />
      <router-link to="/drag">2.自定义指令实现拖拽</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
.container-index{
  width:500px;
  margin: 0 auto;
  border: 1px solid #d81b1b;
  h1{
    text-align: center;
  }
  .nav{
    margin-bottom: 20px;
  }
}
</style>