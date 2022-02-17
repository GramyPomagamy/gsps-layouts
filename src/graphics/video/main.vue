<template>
  <div id="container">
    <img id="Background" src="../img/layouts/video_bg-min.png" />

    <div id="nextRunInfo">
      <div id="nextRunLabel"><b>NADCHODZĄCY RUN</b></div>
      <div id="nextRun" v-if="activeRun">{{ activeRun.game }}</div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue } from 'vue-property-decorator';
  import type { RunDataActiveRun } from 'nodecg/bundles/nodecg-speedcontrol/src/types/schemas';
  import { Getter } from 'vuex-class';

  export default class extends Vue {
    @Getter readonly activeRun!: RunDataActiveRun;
  }
</script>

<style>
  @import url('../css/styles.css');

  #container {
    text-align: center;
  }

  #Background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: -1;
  }

  #nextRunInfo {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 866px;
    left: 208px;
    width: 1502px;
    height: 100px;
    /* background-color: blue; */
  }

  #nextRunLabel {
    text-align: center;
    color: white;
    font-size: 24px;
  }

  #nextRun {
    display: flex;
    flex-direction: row;
  }

  html {
    display: block;
    width: 1920px;
    height: 1014px;
  }
</style>
