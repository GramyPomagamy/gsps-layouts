<template>
  <div id="Omnibar" class="Flex">
    <img id="Logo" src="./img/GSPS_PNG.png" />
    <div id="Body">
      <omnibar-ticker />
    </div>
    <omnibar-clock class="OmnibarClock"></omnibar-clock>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import OmnibarClock from './components/Clock.vue';
  import OmnibarTicker from './components/Ticker.vue';

  @Component({
    components: {
      OmnibarClock,
      OmnibarTicker,
    },
  })
  export default class extends Vue {}
</script>

<style>
  @import url('../css/styles.css');
  #Omnibar {
    position: fixed;
    width: 1920px;
    height: 66px;
    background: url('./img/omnibar_bg.png');
    justify-content: flex-start;
  }

  #Logo {
    z-index: 3;
    flex-shrink: 0;
    background-color: #3a008b;
    width: 7.4%;
  }

  #Body {
    display: flex;
    flex-grow: 1;
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  .OmnibarClock {
    float: right;
  }
</style>
