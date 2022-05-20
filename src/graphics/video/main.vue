<template>
  <div id="container">
    <img
      id="Background"
      :src="
        require(`../img/layouts/${currentEvent.toLowerCase() || 'default'}/video_bg.png`)
      "
    />
    <video id="player" ref="VideoPlayer">
      <source ref="PlayerSource" />
    </video>

    <div id="nextRunInfo" v-if="activeRun">
      <div id="nextRunLabel"><b>NADCHODZĄCY RUN</b></div>
      <video-next-run />
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Watch, Ref } from 'vue-property-decorator';
  import type { RunDataActiveRun } from 'nodecg/bundles/nodecg-speedcontrol/src/types/schemas';
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
    @Getter readonly videos!: Asset[];
    @Getter readonly obsData!: ObsData;
    @Getter readonly currentEvent!: string;
    @Ref('VideoPlayer') player!: HTMLVideoElement;
    @Ref('PlayerSource') playerSrc!: HTMLSourceElement;

    config = (nodecg.bundleConfig as Configschema).obs;

    sceneName: string = this.config.scenes.video;

    video!: Asset;

    @Watch('obsData')
    onOBSDataChanged(newVal: ObsData) {
      this.$nextTick(() => {
        if (newVal.scene === this.sceneName) {
          this.playNextVideo();
        }
      });
    }

    async playNextVideo(): Promise<void> {
      let video;
      video =
          this.videos[
            Math.floor(Math.random() * this.videos.length)
          ];
      if (video) {
        this.video = video;
        this.playerSrc.src = video.url;
        this.playerSrc.type = `video/${video.ext
          .toLowerCase()
          .replace('.', '')}`;
        this.player.volume = 0.5;
        this.player.load();
        this.player.play();
      } else {
        console.error(
          'Coś się popsuło i nie było mnie słychać, więc spróbuję jeszcze raz...'
        );
        this.playNextVideo();
      }
    }

    videoEnded(): void {
        nodecg.sendMessage('videoPlayerFinished');
    }

    mounted() {
      this.player.addEventListener('ended', this.videoEnded);
    }
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
