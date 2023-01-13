<template>
  <div id="container">
    <img id="Background" src="../img/layouts/video_bg-min.png" />
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
  import type { RunDataActiveRun } from 'speedcontrol/src/types/schemas';
  import type { Asset } from '@gsps-layouts/types';
  import type { ObsData, Configschema } from '@gsps-layouts/types/schemas';
  import { Getter } from 'vuex-class';
  import VideoNextRun from './components/NextRun.vue';

  type VideoTypes = 'charity' | 'sponsors';

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
    @Ref('VideoPlayer') player!: HTMLVideoElement;
    @Ref('PlayerSource') playerSrc!: HTMLSourceElement;

    config = (nodecg.bundleConfig as Configschema).obs;

    sceneName: string = this.config.scenes!.video;

    video!: Asset;
    videoType: VideoTypes = 'charity';

    @Watch('obsData')
    onOBSDataChanged(newVal: ObsData) {
      this.$nextTick(() => {
        if (newVal.scene === this.sceneName) {
          if (this.playLongVideo) {
            this.playNextLongVideo();
          } else {
            this.videoType = 'charity';
            this.playNextShortVideo('charity');
          }
        }
      });
    }

    async playNextLongVideo(): Promise<void> {
      let video =
        this.videosLong[Math.floor(Math.random() * this.videosLong.length)];
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
        this.playNextLongVideo();
      }
    }

    async playNextShortVideo(type: VideoTypes): Promise<void> {
      let video;
      if (type === 'charity') {
        video =
          this.videosCharity[
            Math.floor(Math.random() * this.videosCharity.length)
          ];
      } else {
        video =
          this.videosSponsors[
            Math.floor(Math.random() * this.videosSponsors.length)
          ];
      }
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
        this.playNextShortVideo(type);
      }
    }

    videoEnded(): void {
      if (this.videoType === 'charity' && !this.playLongVideo) {
        this.playNextShortVideo('sponsors');
        this.videoType = 'sponsors';
      } else {
        nodecg.sendMessage('videoPlayerFinished');
      }
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
