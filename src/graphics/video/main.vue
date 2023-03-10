<template>
  <div id="container">
    <img id="Background" src="../img/layouts/video_bg-min.png" />

    <div id="nextRunInfo" v-if="activeRun">
      <div id="nextRunLabel"><b>NADCHODZĄCY RUN</b></div>
      <video-next-run />
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Watch, Ref } from 'vue-property-decorator';
  import type { RunDataActiveRun } from 'speedcontrol/src/types/schemas';
  import type { Asset } from '@gsps-layouts/types';
  import type { ObsData, Configschema } from '@gsps-layouts/types/schemas';
  import { Getter } from 'vuex-class';
  import VideoNextRun from './components/NextRun.vue';

  @Component({
    components: {
      VideoNextRun,
    },
  })
  export default class extends Vue {
    @Getter readonly activeRun!: RunDataActiveRun;
    @Getter readonly videosCharity!: Asset[];
    @Getter readonly videosSponsors!: Asset[];
    @Getter readonly videosLong!: Asset[];
    @Getter readonly playLongVideo!: boolean;
    @Getter readonly obsData!: ObsData;
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
    margin-bottom: 10px;
  }

  #player {
    position: absolute;
    left: 222px;
    top: 26px;
    width: 1476px;
    height: 830px;
  }

  html {
    display: block;
    width: 1920px;
    height: 1014px;
  }
</style>
