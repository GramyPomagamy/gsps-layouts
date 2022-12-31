<template>
  <div id="container">
    <img id="Background" src="../img/layouts/standard_2.png" />

    <div v-if="activeRun" id="runners">
      <div v-if="activeRun.teams[0]" id="team1">
        <template v-if="activeRun.teams[0].players.length">
          <player
            class="Player"
            :cycle="nameCycle"
            :player="getCurrentRelayRunner(activeRun.teams[0])"
          />
        </template>
        <transition name="fade">
          <finish-time
            v-if="
              timer.teamFinishTimes[activeRun.teams[0].id] &&
              timer.teamFinishTimes[activeRun.teams[0].id].state === 'completed'
            "
            :style="{ left: '655px', position: 'absolute' }"
            :side="'left'"
            :place="team1Placement"
            :time="timer.teamFinishTimes[activeRun.teams[0].id].time"
          />
        </transition>

        <commentator-list
          v-if="
            activeRun.teams[0].players.length < 2 && commentators.amount > 0
          "
          id="commentators"
        />
      </div>
      <div v-if="activeRun.teams[1]" id="team2">
        <template v-if="activeRun.teams[1].players.length">
          <player
            class="Player"
            :cycle="nameCycle"
            :player="getCurrentRelayRunner(activeRun.teams[1])"
          />
        </template>
        <transition name="fade">
          <finish-time
            v-if="
              timer.teamFinishTimes[activeRun.teams[1].id] &&
              timer.teamFinishTimes[activeRun.teams[1].id].state === 'completed'
            "
            :style="{ right: '824px', position: 'absolute' }"
            :side="'right'"
            :place="team2Placement"
            :time="timer.teamFinishTimes[activeRun.teams[1].id].time"
          />
        </transition>

        <reader-name
          v-if="activeRun.teams[1].players.length < 2 && reader"
          id="reader"
        />
      </div>
    </div>
    <run-info id="RunInfo" v-if="activeRun" :maxTitleSize="43" />
    <timer-view id="timer" />
    <sponsors id="sponsors" />
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import type { RunDataActiveRun, Timer } from 'speedcontrol/src/types/schemas';
  import type {
    NameCycle,
    Commentators,
    Reader,
  } from '@gsps-layouts/types/schemas';
  import type { Asset, LogoCycle } from '@gsps-layouts/types';
  import { Getter } from 'vuex-class';
  import TimerView from '../_misc/components/Timer.vue';
  import RunInfo from '../_misc/components/RunInfo.vue';
  import Player from '../_misc/components/Player.vue';
  import CommentatorList from '../_misc/components/Commentator.vue';
  import ReaderName from '../_misc/components/Reader.vue';
  import Sponsors from '../_misc/components/Sponsors.vue';
  import FinishTime from '../_misc/components/FinishTime.vue';

  @Component({
    components: {
      TimerView,
      RunInfo,
      Player,
      CommentatorList,
      ReaderName,
      Sponsors,
      FinishTime,
    },
  })
  export default class extends Vue {
    @Getter readonly activeRun!: RunDataActiveRun;
    @Getter readonly nameCycle!: NameCycle;
    @Getter readonly commentators!: Commentators;
    @Getter readonly reader!: Reader;
    @Getter readonly sponsors!: Asset[];
    @Getter readonly timer!: Timer;
    @Getter readonly logoCycles!: LogoCycle[];
    data() {
      return {
        numRunners: 0,
      };
    }

    get team1Placement() {
      let place = 1;
      if (this.placements.length > 0) {
        this.placements.forEach((placement) => {
          if (placement.object[0] === this.activeRun.teams[0].id) {
            place = placement.place;
          }
        });
      }
      return place;
    }

    get team2Placement() {
      let place = 1;
      if (this.placements.length > 0) {
        this.placements.forEach((placement) => {
          if (placement.object[0] === this.activeRun.teams[1].id) {
            place = placement.place;
          }
        });
      }
      return place;
    }

    get placements() {
      return Object.entries(this.timer.teamFinishTimes)
        .sort(([, a], [, b]) => a.milliseconds - b.milliseconds)
        .map((p, i) => ({ object: p, place: i + 1 }));
    }

    getCurrentRelayRunner(team: any) {
      let currentRelayRunner;

      team.players.forEach((player: any) => {
        if (player.id === team.relayPlayerID) {
          currentRelayRunner = player;
        }
      });
      return currentRelayRunner;
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
    left: 686.4px;
    bottom: 15px;
    height: 78px;
    width: 547.2px;
    font-size: 67.2px;
    z-index: 2;
    position: absolute;
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
    position: absolute;
    bottom: 35px;
    width: 634.8px;
    height: 160px;
  }

  #runners {
    top: 720px;
    width: 100%;
    font-size: 28.8px;
    left: -11px;
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .Player {
    position: relative;
    margin-bottom: 0px;
    width: 640px;
  }

  #team1 {
    right: 1280px;
    align-self: flex-start;
    display: flex;
    flex-direction: column;
  }

  #team2 {
    left: 1280px;
    align-self: flex-start;
    display: flex;
    flex-direction: column;
  }

  #commentators {
    position: relative;
    margin-bottom: 0px;
    width: 640px;
  }

  #reader {
    position: relative;
    margin-bottom: 0px;
    width: 640px;
  }

  #sponsors {
    position: absolute;
    bottom: 24px;
    right: 0px;
    width: 640px;
    height: 180px;
    /* 		background-color: aqua; */
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>
