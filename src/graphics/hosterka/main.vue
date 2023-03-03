<template>
  <div id="host-container">
    <transition name="fade" mode="out-in">
      <div :style="{ width: '100%' }" v-if="hosterka && showNames">
        <host
          id="nickname1"
          v-if="hosterka.host1.length > 0"
          :host="hosterka.host1"
          :key="hosterka.host1"
        />

        <host
          id="nickname2"
          v-if="hosterka.host2.length > 0"
          :host="hosterka.host2"
          :key="hosterka.host2"
        />
      </div>
    </transition>
    <div id="prize-bid-panel-container">
      <transition name="fade" mode="out-in" appear>
        <bid-panel
          :bid="currentBid"
          v-if="showBids && !showPrizes && currentBid && bids.length > 0"
        />
        <prize-panel
          :prize="currentPrize"
          v-else-if="
            showPrizes && !showBids && currentPrize && prizes.length > 0
          "
        />
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import type { Hosterka, Bids, Prizes } from '@gsps-layouts/types/schemas';
  import type { Bid, Prize } from '@gsps-layouts/types';
  import { Getter } from 'vuex-class';
  import Host from './components/Host.vue';
  import BidPanel from './components/BidPanel.vue';
  import PrizePanel from './components/PrizePanel.vue';
  import clone from 'clone';

  @Component({
    components: {
      Host,
      BidPanel,
      PrizePanel,
    },
  })
  export default class extends Vue {
    @Getter readonly hosterka!: Hosterka;
    @Getter readonly prizes!: Prizes;
    @Getter readonly bids!: Bids;

    showNames: boolean = false;
    showBids: boolean = false;
    showPrizes: boolean = false;
    currentBid: Bid | null = null;
    currentBidIndex = 0;
    currentPrize: Prize | null = null;
    currentPrizeIndex = 0;
    currentPrizeTier = 0;

    getPrize(tier: number): Prize {
      const cloned = clone(this.prizes);
      const prizesInTier = cloned.filter((prize) => prize.minimumBid == tier);
      if (this.currentPrizeIndex + 1 > prizesInTier.length) {
        this.currentPrizeIndex = 0;
      }
      let selectedPrize = prizesInTier[this.currentPrizeIndex];
      return selectedPrize;
    }

    mounted(): void {
      nodecg.listenFor('showNames', () => {
        this.showNames = true;
      });

      nodecg.listenFor('hideNames', () => {
        this.showNames = false;
      });

      nodecg.listenFor('showNextBid', () => {
        console.log('Pokazuję następną licytację');
        if (this.bids.length > 0) {
          // If bid panel is disabled, enable it and set it to show first bid in the list
          if (!this.showBids) {
            this.showBids = true;
            this.currentBid = this.bids[0];
            this.currentBidIndex = 0;
            return;
          } else {
            this.currentBidIndex++;
            if (this.currentBidIndex + 1 > this.bids.length) {
              this.currentBidIndex = 0;
            }
            this.currentBid = this.bids[this.currentBidIndex];
          }
        }
      });

      nodecg.listenFor('hideBids', () => {
        this.showBids = false;
      });

      nodecg.listenFor('showNextPrize', (tier: number) => {
        console.log('Pokazuję następną nagrodę');
        if (this.prizes.length > 0) {
          // If prize panel is disabled, enable it and start from the beginning of current tier
          if (!this.showPrizes) {
            this.currentPrizeIndex = 0;
            this.currentPrizeTier = tier;
            this.currentPrize = this.getPrize(tier);
            this.showPrizes = true;
          } else {
            // If different tier, start from the beginning
            if (tier != this.currentPrizeTier) {
              this.currentPrizeTier = tier;
              this.currentPrizeIndex = 0;
            } else {
              this.currentPrizeIndex++;
              this.currentPrizeTier = tier;
            }

            this.showPrizes = true;
            this.currentPrize = this.getPrize(tier);
          }
        }
      });

      nodecg.listenFor('hidePrizes', () => {
        this.showPrizes = false;
      });
    }
  }
</script>

<style>
  @import url('../css/styles.css');

  #nickname1 {
    left: 240px;
    position: absolute;
    bottom: 200px;
  }

  #nickname2 {
    right: 240px;
    position: absolute;
    bottom: 200px;
  }

  #host-container {
    height: 100%;
  }

  #prize-bid-panel-container {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;
    margin-top: 814px;
    height: 200px;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>
