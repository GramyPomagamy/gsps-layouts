<template>
  <div id="container">
    <img id="Background" src="../img/layouts/3x2_1.png" />

    <div id="bottomLeft">
      <div v-if="activeRun" id="runners">
        <template v-if="activeRun.teams" v-for="team in activeRun.teams">
          <template v-for="player in team.players">
            <player
              :key="player.id"
              class="Player"
              :cycle="nameCycle"
              :player="player"
            />
          </template>
        </template>
        <commentator-list
          :commentators="commentators"
          v-if="numRunners < 3 && commentators.amount > 0"
          id="commentators"
        />
        <reader-name
          :reader="reader"
          v-if="numRunners < 4 && reader"
          id="reader"
        />
      </div>
      <run-info
        id="RunInfo"
        v-if="activeRun"
        :run="activeRun"
        :maxTitleSize="30"
      />
      <timer-view id="timer" />
      <sponsors-view id="sponsors" :sponsors="sponsors" />
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import type { RunDataActiveRun } from 'nodecg/bundles/nodecg-speedcontrol/src/types/schemas';
  import type {
    NameCycle,
    Commentators,
    Reader,
  } from '@gsps-layouts/types/schemas';
  import type { Asset } from '@gsps-layouts/types';
  import { Getter } from 'vuex-class';
  import TimerView from '../_misc/components/Timer.vue';
  import RunInfo from '../_misc/components/RunInfo.vue';
  import Player from '../_misc/components/Player.vue';
  import CommentatorList from '../_misc/components/Commentator.vue';
  import ReaderName from '../_misc/components/Reader.vue';
  import SponsorsView from '../_misc/components/Sponsors.vue';

  @Component({
    components: {
      TimerView,
      RunInfo,
      Player,
      CommentatorList,
      ReaderName,
      SponsorsView,
    },
  })
  export default class extends Vue {
    @Getter readonly activeRun!: RunDataActiveRun;
    @Getter readonly nameCycle!: NameCycle;
    @Getter readonly commentators!: Commentators;
    @Getter readonly reader!: Reader;
    @Getter readonly sponsors!: Asset[];
    data() {
      return {
        numRunners: 0,
      };
    }

    mounted() {
      this.activeRun!.teams.forEach((team: any) => {
        this.$data.numRunners += team.players.length;
      });

      this.$watch(
        function () {
          return this.activeRun;
        },
        function () {
          this.$data.numRunners = 0;
          this.activeRun!.teams.forEach((team: any) => {
            this.$data.numRunners += team.players.length;
          });
        }
      );
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

  #timer {
    position: relative;
    left: -13.2px;
    top: -28px;
    height: 78px;
    width: 392px;
    font-size: 90px;
    margin-left: 11px;
    margin-bottom: 0px;
  }

  #bottomLeft {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 420px;
    width: 392px;
    height: 167px;
  }

  html {
    display: block;
    width: 1920px;
    height: 1014px;
  }

  #RunInfo {
    position: relative;
    top: 0px;
    left: 5px;
    width: 386px;
    height: 160px;
  }

  #runners {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    margin-left: -11px;
  }

  .Player {
    position: relative;
    top: -19px;
    margin-bottom: 0px;
    width: 392px;
  }

  #commentators {
    position: relative;
    top: -19px;
    margin-bottom: 0px;
    width: 392px;
  }

  #reader {
    position: relative;
    top: -19px;
    margin-bottom: 0px;
    width: 413px;
  }

  #sponsors {
    position: absolute;
    bottom: -422px;
    left: 10px;
    width: 370px;
    height: 278px;
    /*         		background-color: aqua; */
  }
</style>
