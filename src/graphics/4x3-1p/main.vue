<template>
  <div id="container">
    <img id="Background" src="../img/layouts/standard_1_bg.png">
    <run-info id="RunInfo" v-if="activeRunReplicant" :run="activeRunReplicant" :maxTitleSize="30"/>

    <div id="bottomLeft">
      <div v-if="activeRunReplicant" id="runners">
        <player class="Player" v-if="activeRunReplicant.teams[0].players[0]" :cycle="nameCycleReplicant" :player="activeRunReplicant.teams[0].players[0]"/>
        <player class="Player" v-if="activeRunReplicant.teams[0].players[1]" :cycle="nameCycleReplicant" :player="activeRunReplicant.teams[0].players[1]"/>
        <player class="Player" v-if="activeRunReplicant.teams[0].players[2]" :cycle="nameCycleReplicant" :player="activeRunReplicant.teams[0].players[2]"/>
        <player class="Player" v-if="activeRunReplicant.teams[0].players[3]" :cycle="nameCycleReplicant" :player="activeRunReplicant.teams[0].players[3]"/>
        <commentators :maxSize="20" v-if="activeRunReplicant.teams[0].players.length < 3" id="commentators" />
<!--         <reader v-if="activeRunReplicant.teams[0].players.length < 4" id="reader" /> -->
      </div>
      <timer id="timer"/>
    </div>

  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import type { RunDataActiveRun } from 'nodecg/bundles/nodecg-speedcontrol/src/types/schemas';
import type { NameCycle } from '@gsps-layouts/types/schemas';
import { Getter } from 'vuex-class';
import Timer from '../_misc/components/Timer.vue';
import RunInfo from '../_misc/components/RunInfo.vue';
import Player from '../_misc/components/Player.vue';
import Commentators from '../_misc/components/Commentator.vue';
import Reader from '../_misc/components/Reader.vue';

@Component({
  components: {
    Timer,
    RunInfo,
    Player,
    Commentators,
    Reader
  }
})
export default class extends Vue {
  @Getter readonly activeRunReplicant!: RunDataActiveRun; // from store.ts
  @Getter readonly nameCycleReplicant!: NameCycle;
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
		position: absolute;
		left: -13.2px;
	  top: 100px;
		height: 78px;
		width: 556.8px;
		font-size: 90px;
		margin-left: 11px;
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
    left: 5px;
		top: 630px;
		width: 551.8px;
		height: 160px;
  }

  #runners {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		position: relative;
		padding-left: 11px;
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
</style>
