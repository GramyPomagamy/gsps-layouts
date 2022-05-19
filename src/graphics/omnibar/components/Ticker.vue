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
  import TickerNextRuns from './Ticker/NextRuns.vue';
  const runs = nodecg.Replicant('runDataArray', 'nodecg-speedcontrol');
  const activeRun = nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol');

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
      NodeCG.waitForReplicants(runs, activeRun).then(() => {
        this.messageTypes = [
          /*           this.gspsPromo(),
          this.charityPromo(),
          this.donationURL(), */
          this.nextRuns(),
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

      gspsPromo() {
        return this.genericMsg(
          'Oglądacie&nbsp;<b style="color: #ffbd16">Gramy Szybko, Pomagamy Skutecznie Dzieciom 2022</b>!'
        );
      },

      charityPromo() {
        return this.genericMsg(
          '<b>GSPS Dzieciom 2022</b>&nbsp;wspiera&nbsp;<b style="color: #ffbd16">Fundację Na Ratunek Dzieciom z Chorobą Nowotworową</b>!'
        );
      },

      donationURL() {
        return this.genericMsg(
          'Wesprzyj na&nbsp;<b style="color: #ffbd16">gsps.pl/wesprzyj</b>!'
        );
      },

      genericMsg(string) {
        return {
          name: TickerGenericMessage,
          data: {
            msg: string,
          },
        };
      },

      nextRuns() {
        return {
          name: TickerNextRuns,
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
