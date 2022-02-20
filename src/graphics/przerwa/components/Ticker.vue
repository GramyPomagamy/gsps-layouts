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
  import BreakBids from './Ticker/Bids.vue';
  const bids = nodecg.Replicant('currentBids');

  export default {
    name: 'BreakTicker',
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
      NodeCG.waitForReplicants(bids).then(() => {
        this.messageTypes = [this.bids()];

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

      bids() {
        return {
          name: BreakBids,
        };
      },
    },
  };
</script>

<style scoped>
  #Ticker {
    height: 100%;
    min-width: 0;
    color: white;
    width: 942px;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
