<template>
  <div v-if="currentSponsor && currentSponsor.name" id="sponsors-div">
    <transition name="fade" mode="out-in">
      <img class="img" :key="currentSponsor.name" :src="currentSponsor.url" />
    </transition>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import { Getter } from 'vuex-class';
  import clone from 'clone';
  import type { Asset, LogoCycle } from '@gsps-layouts/types';

  @Component
  export default class Sponsors extends Vue {
    @Getter readonly sponsors!: Asset[];
    @Getter readonly logoCycles!: LogoCycle[];

    currentSponsor: Asset | undefined;
    sponsorTimeout: NodeJS.Timeout | undefined;

    data() {
      return {
        currentSponsor: undefined,
        sponsorTimeout: undefined,
      };
    }

    mounted() {
      if (this.sponsors.length > 0) {
        this.currentSponsor = this.sponsors[0];
      }

      this.sponsorTimeout = setTimeout(
        this.nextSponsor,
        this.getCycle(this.sponsors[0].name) * 1000
      );
    }

    nextSponsor() {
      if (!this.sponsors || this.sponsors.length <= 0) {
        return;
      }

      let currentIdx = this.sponsors.indexOf(this.currentSponsor!);
      let nextIdx = currentIdx + 1;
      if (nextIdx >= this.sponsors.length) {
        nextIdx = 0;
      }
      this.currentSponsor = this.sponsors[nextIdx];

      this.sponsorTimeout = setTimeout(
        this.nextSponsor,
        this.getCycle(this.sponsors[nextIdx].name) * 1000
      );
    }

    getCycle(sponsor: string): number {
      let currentCycles = clone(this.logoCycles);
      if (currentCycles) {
        let cycle = 10;
        for (let i = 0; i < currentCycles.length; i++) {
          if (currentCycles[i].name === sponsor) {
            cycle = currentCycles[i].cycle;
            break;
          }
        }
        return cycle;
      } else {
        return 10;
      }
    }
  }
</script>

<style scoped>
  #sponsors-div {
    width: 100%;
    height: 100%;
    object-fit: contain;
    vertical-align: middle;
  }

  .img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>
