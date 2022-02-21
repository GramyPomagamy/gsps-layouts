<template>
  <div id="Ticker">
    <p id="title" :key="timestamp">{{ label }}</p>
    <transition name="fade" mode="out-in">
      <component
        :is="currentComponent.name"
        :key="timestamp"
        :data="currentComponent.data"
        @label="setLabel"
        @end="showNextMsg"
      />
    </transition>
  </div>
</template>

<script>
  import BreakBids from './Ticker/Bids.vue';
  import BreakPrizes from './Ticker/Prizes.vue';
  const bids = nodecg.Replicant('currentBids');
  const prizes = nodecg.Replicant('prizes');

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
        label: '',
      };
    },
    mounted() {
      NodeCG.waitForReplicants(bids, prizes).then(() => {
        this.messageTypes = [this.bids(), this.prizes()];

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

      prizes() {
        return {
          name: BreakPrizes,
        };
      },

      setLabel(label) {
        this.label = label;
      }
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

  #title {
    position: absolute;
    margin: auto;
    font-size: 24px;
    height: 36px;
    font-weight: bold;
    color: white;
    width: 100%;
    text-align: left;
    margin-left: 30px;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
