<template>
  <div id="Ticker">
    <transition name="fade" mode="out-in">
      <component
        :is="currentComponent.name"
        :key="timestamp"
        :data="currentComponent.data"
        @end="showNextMsg"
      />
    </transition>
  </div>
</template>

<script>
  import TickerGenericMessage from './Ticker/GenericMessage.vue';
  import TickerBidGoal from './Ticker/BidGoal.vue';
  import TickerBidWar from './Ticker/BidWar.vue';
  import TickerNextRuns from './Ticker/NextRuns.vue';
  import TickerMilestone from './Ticker/Milestone.vue';
  import TickerPrizes from './Ticker/Prizes.vue';
  const bids = nodecg.Replicant('currentBids');
  const runs = nodecg.Replicant('runDataArray', 'nodecg-speedcontrol');
  const activeRun = nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol');
  const milestones = nodecg.Replicant('milestones');
  const total = nodecg.Replicant('total');
  const prizes = nodecg.Replicant('prizes');

  export default {
    name: 'OmnibarTicker',
    data() {
      return {
        currentComponent: {
          name: '',
          data: {},
        },
        currentComponentIndex: 0,
        timestamp: Date.now(),
        messageTypes: [],
      };
    },
    mounted() {
      NodeCG.waitForReplicants(
        bids,
        runs,
        activeRun,
        milestones,
        total,
        prizes
      ).then(() => {
        this.messageTypes = [
          this.gspsPromo(),
          this.donationURL(),
          this.memePromo(),
          this.big20Promo(),
          this.shopURL(),
        ];

        this.currentComponent = this.messageTypes[0];
      });
    },
    methods: {
      showNextMsg() {
        console.log('SHOWING NEXT MESSAGE');
        this.currentComponentIndex += 1;
        if (this.currentComponentIndex >= this.messageTypes.length) {
          this.currentComponentIndex = 0;
        }
        this.currentComponent = this.messageTypes[this.currentComponentIndex];
        this.timestamp = Date.now();
      },

      memePromo() {
        return this.genericMsg(
          'Natalia, odpisz! Omnibar GSPSu to ostatnie miejsce gdzie mnie jeszcze nie zablokowałaś.'
        );
      },

      big20Promo() {
        return this.genericMsg(
          'Oglądacie zmagania polskich graczy w 15. edycji wyzwania Big 20.'
        );
      },

      donationURL() {
        return this.genericMsg(
          'Wesprzyj organizację przyszłych wydarzeń charytatywnych z serii GSPS na&nbsp;<b style="color: #ffbd16">gsps.pl/fundacja</b>!'
        );
      },

      shopURL() {
        return this.genericMsg(
          'Kup merch i wesprzyj organizację przyszłych wydarzeń charytatywnych z serii GSPS na&nbsp;<b style="color: #ffbd16">gsps.pl/sklep</b>!'
        )
      },

      gspsPromo() {
        return this.genericMsg(
          'Wydarzenia charytatywne GSPS zebrały przez 5 lat w sumie już&nbsp;<b style="color: #ffbd16">ponad 185 tys. złotych na cele charytatywne</b>!'
        )
      },

      genericMsg(string) {
        return {
          name: TickerGenericMessage,
          data: {
            msg: string,
          },
        };
      },

      bidGoal() {
        return {
          name: TickerBidGoal,
        };
      },

      bidWar() {
        return {
          name: TickerBidWar,
        };
      },

      nextRuns() {
        return {
          name: TickerNextRuns,
        };
      },

      milestone() {
        return {
          name: TickerMilestone,
        };
      },

      prizes() {
        return {
          name: TickerPrizes,
        };
      },
    },
  };
</script>

<style scoped>
  #Ticker {
    height: 100%;
    min-width: 0;
    flex: 1;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
