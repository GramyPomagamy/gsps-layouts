<template>
  <div id="break" :event="currentEvent">
    <break-next-runs id="next-runs" :runs="nextRuns" />
    <img id="ClassicLogo" src="./img/GSPS_Classic_White.png" />
    <div id="bottom">
      <img id="GSPSLogo" src="./img/GSPS_logo.png" />
      <div id="names">
        <break-song id="song" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Watch } from 'vue-property-decorator';
  import type { Song } from '@gsps-layouts/types/schemas';
  import { Getter } from 'vuex-class';
  import { RunDataActiveRun } from '../../../../nodecg-speedcontrol/src/types/schemas';
  import { RunData } from '../../../../nodecg-speedcontrol/src/types';
  import BreakSong from './components/Song.vue';
  import BreakNextRuns from './components/NextRuns.vue';
  import clone from 'clone';

  @Component({
    components: {
      BreakSong,
      BreakNextRuns,
    },
  })
  export default class extends Vue {
    @Getter readonly allRuns!: RunData[];
    @Getter readonly activeRun!: RunDataActiveRun;
    @Getter readonly currentSong!: Song;
    @Getter readonly currentEvent!: string;

    nextRuns: RunData[] | null = null;

    mounted() {
      this.nextRuns = this.getNext3Runs;
    }

    @Watch('activeRun')
    updateNextRuns(): void {
      this.nextRuns = this.getNext3Runs;
    }

    get getNext3Runs(): RunData[] {
      const runIndex = this.findRunIndex;
      return clone(this.allRuns).slice(runIndex).slice(0, 5);
    }

    get findRunIndex() {
      if (!this.activeRun) {
        return 0;
      }
      return clone(this.allRuns).findIndex(
        (run) => run.id === this.activeRun.id
      );
    }
  }
</script>

<style>
  @import url('../css/styles.css');
  @import url('../css/themes.css');

  #ClassicLogo {
    position: absolute;
    width: 35%;
    right: 120px;
    top: 160px;
  }

  #GSPSLogo {
    margin-top: 45px;
    width: 11%;
    position: absolute;
    bottom: 2px;
    left: 20px;
    align-self: flex-start;
  }

  #bottom {
    width: 100%;
    position: absolute;
    bottom: 2px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  #names {
    width: 89%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  #song {
    width: 100%;
    white-space: nowrap;
    overflow: visible;
    margin-right: 40px;
  }

  #total {
    position: absolute;
    height: 116px;
    right: 200px;
    top: 35px;
    font-size: 116px;
    text-shadow: 2px 2px 8px #000000;
  }

  #next-runs {
    position: absolute;
    width: 960px;
    height: 470px;
    left: 20.5px;
    top: 50px;
  }

  #ticker {
    position: absolute;
    width: 900px;
    height: 400px;
    left: 20.5px;
    top: 552px;
  }

  #sponsors {
    position: absolute;
    bottom: 300px;
    right: 25px;
    width: 800px;
    height: 400px;
  }
</style>
