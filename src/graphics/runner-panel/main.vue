<template>
  <div
    id="container"
    ref="container"
    @click="enableFullscreen"
    :style="{
      backgroundColor: backgroundColor,
    }"
  >
    <div id="run-container">
      <timer-view id="timer" />
    </div>
    <div
      id="donations-container"
      :style="{
        width: '100%',
        marginTop: '10px',
        fontSize: '28px',
        lineHeight: '30px',
        paddingBottom: '1px',
      }"
    >
      <p v-if="readerAlert">Czytający chce coś powiedzieć</p>
      <p>Donacje oczekujące na przeczytanie: {{ donationsToRead.length }}</p>
      <p>Największa donacja: {{ topDonationAmount }}</p>
      <br />
      <p>
        Obecny czytający: <b>{{ reader }}</b>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Ref } from 'vue-property-decorator';
  import type { RunDataActiveRun, Timer } from 'speedcontrol/src/types/schemas';
  import type { DonationsToRead, Reader } from '@gsps-layouts/types/schemas';
  import { Getter } from 'vuex-class';
  import TimerView from '../_misc/components/Timer.vue';
  import clone from 'clone';

  @Component({
    components: {
      TimerView,
    },
  })
  export default class extends Vue {
    @Ref('container') containerEl!: HTMLElement;
    @Getter readonly activeRun!: RunDataActiveRun;
    @Getter readonly timer!: Timer;
    @Getter readonly donationsToRead!: DonationsToRead;
    @Getter readonly reader!: Reader;

    readerAlert: boolean = false;

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

    enableFullscreen() {
      this.containerEl!.requestFullscreen();
    }

    mounted() {
      nodecg.listenFor('toggleAlert', () => {
        this.readerAlert = !this.readerAlert;
      });
    }

    get backgroundColor() {
      if (this.readerAlert) {
        return '#FFC300';
      } else if (this.donationsToRead.length > 0) {
        return '#357C3C';
      } else {
        return 'black';
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
    font-size: 56px;
  }

  html {
    background-color: black;
  }
</style>
