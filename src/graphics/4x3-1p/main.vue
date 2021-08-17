<template>
  <div id="container">
    <img id="Background" src="../img/layouts/standard_1_bg.png">
    <div id="bottomLeft">
      <timer id="timer" />
    </div>

  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import type { Countdown } from '@gsps-layouts/types/schemas';
import { Getter } from 'vuex-class';
import Timer from '../_misc/components/Timer.vue';

@Component({
  components: {
    Timer
  }
})
export default class extends Vue {
  @Getter readonly countdownReplicant!: Countdown; // from store.ts
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
	  top: 90px;
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
		width: 568px;
		height: 430px;
	}

  html {
    display: block;
		width: 1920px;
		height: 1014px;
  }
</style>
