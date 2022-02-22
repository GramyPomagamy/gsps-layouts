<template>
  <div
    id="container"
    :style="{ backgroundColor: donationsToRead.length ? 'green' : 'red' }"
  >
    <div id="run-container">
      <p v-if="activeRun" :style="{ fontSize: '24px' }">
        {{ activeRun.game }} -
        <template v-if="activeRun.category">{{ activeRun.category }}</template>
      </p>
      <timer-view id="timer" />
    </div>
    <div
      id="donations-container"
      :style="{
        width: '100%',
        marginTop: '10px',
        fontSize: '20px',
        lineHeight: '15px',
        paddingBottom: '1px',
      }"
    >
      <p>Donacje oczekujące na przeczytanie: {{ donationsToRead.length }}</p>
      <p>Największa donacja: {{ topDonationAmount }}</p>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import type {
    RunDataActiveRun,
    Timer,
  } from 'nodecg/bundles/nodecg-speedcontrol/src/types/schemas';
  import type { DonationsToRead } from '@gsps-layouts/types/schemas';
  import { Getter } from 'vuex-class';
  import TimerView from '../_misc/components/Timer.vue';
  import clone from 'clone';

  @Component({
    components: {
      TimerView,
    },
  })
  export default class extends Vue {
    @Getter readonly activeRun!: RunDataActiveRun;
    @Getter readonly timer!: Timer;
    @Getter readonly donationsToRead!: DonationsToRead;

    get topDonationAmount() {
      if (this.donationsToRead.length) {
        const sorted = clone(this.donationsToRead).sort((a, b) => {
          return b.amount - a.amount;
        });
        return `${sorted[0].amount.toFixed(2)} zł`;
      } else {
        return '0.00 zł';
      }
    }
  }
</script>

<style>
  @import url('../css/styles.css');

  #container {
    text-align: center;
    width: 100%;
    height: 100%;
    text-shadow: black 2px 2px 8px;
    color: white;
    position: absolute;
    top: 0;
    left: 0;
  }

  #Background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: -1;
  }

  #timer {
    font-size: 48px;
  }

  #run-container {
    line-height: 25px;
  }

  html {
    background-color: black;
  }
</style>
