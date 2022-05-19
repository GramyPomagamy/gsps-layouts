<template>
  <div id="container">
    <img
      id="Background"
      :src="
        require(`../img/layouts/${
          currentEvent.toLowerCase() || 'default'
        }/widescreen_1.png`)
      "
    />

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
        v-if="numRunners < 3 && commentators.amount > 0"
        id="commentators"
      />
      <reader-name v-if="numRunners < 4 && reader" id="reader" />
    </div>
    <run-info id="RunInfo" v-if="activeRun" :maxTitleSize="36" />
    <timer-view id="timer" />
    <event-logo id="sponsors" />
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
  import { Getter } from 'vuex-class';
  import TimerView from '../_misc/components/Timer.vue';
  import RunInfo from '../_misc/components/RunInfo.vue';
  import Player from '../_misc/components/Player.vue';
  import CommentatorList from '../_misc/components/Commentator.vue';
  import ReaderName from '../_misc/components/Reader.vue';
  import EventLogo from '../_misc/components/EventLogo.vue';

  @Component({
    components: {
      TimerView,
      RunInfo,
      Player,
      CommentatorList,
      ReaderName,
      EventLogo,
    },
  })
  export default class extends Vue {
    @Getter readonly activeRun!: RunDataActiveRun;
    @Getter readonly nameCycle!: NameCycle;
    @Getter readonly commentators!: Commentators;
    @Getter readonly reader!: Reader;
    @Getter readonly currentEvent!: string;
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
  @import url('../css/themes.css');

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
    position: absolute;
    right: 56px;
    bottom: 16px;
    height: 153.6px;
    width: 576px;
    font-size: 92px;
  }

  #bottomLeft {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 583px;
    width: 578px;
    height: 430px;
  }

  html {
    display: block;
    width: 1920px;
    height: 1014px;
  }

  #RunInfo {
    left: 468px;
    bottom: -10px;
    width: 780px;
    height: 156px;
    position: absolute;
  }

  #runners {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    padding-left: 11px;
    width: 437px;
  }

  .Player {
    position: relative;
    left: -11px;
    top: 487px;
    margin-bottom: 0px;
    font-size: 28.8px;
    width: 437px;
  }

  #commentators {
    position: relative;
    top: 487px;
    margin-bottom: 0px;
    font-size: 20px;
    width: 437px;
    left: -11px;
  }

  #reader {
    position: relative;
    top: 487px;
    margin-bottom: 9px;
    font-size: 20px;
    width: 437px;
    left: -11px;
  }

  #sponsors {
    position: absolute;
    bottom: 30px;
    left: 25px;
    width: 400px;
    height: 341px;
    /* background-color: aqua; */
  }
</style>
