<template>
  <div
    id="Omnibar"
    class="Flex"
  >
    <img id="BG" :src="require(`./img/bg/${currentEvent.toLowerCase() || 'default'}.png`)" />
    <img id="Logo" :event="currentEvent" src="./img/GSPS_PNG.png" />
    <div id="Body">
      <omnibar-ticker />
    </div>
    <omnibar-clock class="OmnibarClock"></omnibar-clock>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import { Getter } from 'vuex-class';
  import type { RunDataActiveRun } from 'nodecg/bundles/nodecg-speedcontrol/src/types/schemas';
  import OmnibarClock from './components/Clock.vue';
  import OmnibarTicker from './components/Ticker.vue';

  @Component({
    components: {
      OmnibarClock,
      OmnibarTicker,
    },
  })
  export default class extends Vue {
    @Getter readonly currentEvent!: string;
  }
</script>

<style>
  @import url('../css/styles.css');
  #Omnibar {
    position: fixed;
    width: 1920px;
    height: 66px;
    justify-content: flex-start;
  }
  #BG {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: -1;
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
