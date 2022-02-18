<template>
  <div>
    <div class="container layout-horizontal layout-center">
      <img id="host-icon" src="../img/host-icon.png" />
      <span class="text">{{ host }}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Host',
    props: ['host'],
  };
</script>

<style scoped>
  @import url('../../css/styles.css');

  .container {
    background-color: rgb(0, 0, 0, 0.6);
    height: 58px;
    width: 400px;
    text-align: center;
  }

  .text {
    position: relative;
    top: 1px;
    font-size: 36px;
    color: white;
    margin-left: 0px;
    width: 400px;
  }

  #host-icon {
    float: left;
  }
</style>
