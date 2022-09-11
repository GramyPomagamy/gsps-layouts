<template>
  <div id="container">
    <img id="Background" src="../img/layouts/standard_1_nocam.png" />
    <div id="bottomLeft">
      <run-info id="RunInfo" v-if="activeRun" :maxTitleSize="30" />
      <timer-view id="timer" />
      <div v-if="activeRun" id="runners">
        <template v-if="activeRun.teams" v-for="(team, teamIndex) in activeRun.teams">
          <div>
            <template v-for="player in team.players">
              <player
                :key="player.id"
                class="Player"
                :cycle="nameCycle"
                :player="player"
              />
            </template>
            <finish-time
              v-if="
                timer.teamFinishTimes[team.id] &&
                timer.teamFinishTimes[team.id].state === 'completed'
              "
              :style="{ left: teamPositionLeft(teamIndex), top: teamPositionTop(teamIndex), position: 'relative', zIndex: 4 }"
              :side="'left'"
              :place="teamPlacement(teamIndex)"
              :time="timer.teamFinishTimes[team.id].time"
            />
          </div>
        </template>
        <commentator-list
          v-if="numRunners < 3 && commentators.amount > 0"
          id="commentators"
        />
        <reader-name v-if="numRunners < 4 && reader" id="reader" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import type {
    RunDataActiveRun,
    Timer,
  } from 'nodecg/bundles/nodecg-speedcontrol/src/types/schemas';
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
    @Getter readonly timer!: Timer;
    @Getter readonly reader!: Reader;
    @Getter readonly sponsors!: Asset[];
    @Getter readonly logoCycles!: LogoCycle[];
    data() {
      return {
        numRunners: 0,
      };
    }

    teamPlacement(teamIndex: number) {
      let place = 1;
      if (this.placements.length > 0) {
        this.placements.forEach((placement) => {
          if (placement.object[0] === this.activeRun.teams[teamIndex].id) {
            place = placement.place;
          }
        });
      }
      return place;
    }

    teamPositionLeft(teamIndex: number) {
      return ["92px", "92px", "92px"][teamIndex];
    }

    teamPositionTop(teamIndex: number) {
      return ["-129px", "-129px", "-129px"][teamIndex];
    }

    get placements() {
      return Object.entries(this.timer.teamFinishTimes)
        .sort(([, a], [, b]) => a.milliseconds - b.milliseconds)
        .map((p, i) => ({ object: p, place: i + 1 }));
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
    top: -180px;
    height: 35px;
    width: 556.8px;
    font-size: 90px;
    margin-left: 11px;
    margin-bottom: 0px;
  }

  #bottomLeft {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 93px;
    width: 578px;
    height: 430px;
  }

  html {
    display: block;
    width: 1920px;
    height: 1014px;
  }

  #RunInfo {
    position: relative;
    top: -80px;
    left: 5px;
    width: 551.8px;
    height: 160px;
  }

  #runners {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    padding-left: 11px;
    font-size: 28.8px;
  }

  .Player {
    position: relative;
    top: -91px;
    left: -11px;
    margin-bottom: 0px;
    width: 567px;
  }

  #commentators {
    position: relative;
    top: -91px;
    left: -11px;
    margin-bottom: 0px;
    width: 567px;
  }

  #reader {
    position: relative;
    top: -91px;
    left: -11px;
    margin-bottom: 0px;
    width: 567px;
  }

  #sponsors {
    position: absolute;
    top: 225px;
    left: 30px;
    width: 520px;
    height: 175px;
    /* 		background-color: aqua; */
  }
</style>
