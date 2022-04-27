<template>
  <div id="currentTimeDiv">
    <span id="currentTime">{{ clock }}</span>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Ref } from 'vue-property-decorator';

  @Component
  export default class OmnibarClock extends Vue {
    get clock(): string {
      var date_ob = new Date();
      // current hours
      let hours = ('0' + date_ob.getHours()).slice(-2);

      // current minutes
      let minutes = ('0' + date_ob.getMinutes()).slice(-2);

      return hours + ':' + minutes;
    }
  }
</script>

<style scoped>
  #currentTimeDiv {
    color: white;
    background-color: #3a008b;
    font-size: 32px;
    position: relative;
    height: 100%;
    white-space: nowrap;
    -ms-flex: none;
    -webkit-flex: none;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    display: flex;
    flex: none;
  }

  #currentTime {
    display: block;
    font-weight: 600;
    margin-left: 14px;
    margin-right: 14px;
  }
</style>
