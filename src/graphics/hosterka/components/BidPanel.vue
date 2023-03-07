<template>
  <transition name="fade" mode="out-in" appear>
    <div id="container">
      <div id="title" style="width: 100%; background-color: #3a008b">
        <h2>Dostępne licytacje</h2>
      </div>
      <transition name="fade" mode="out-in" appear>
        <div id="bid" :key="bid.id">
          <bid-goal v-if="bid.type === 'challenge'" :bid="bid" />
          <bid-war v-else :bid="bid" />
        </div>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { Bid } from '@gsps-layouts/types';
  import BidGoal from './BidPanel/BidGoal.vue';
  import BidWar from './BidPanel/BidWar.vue';

  @Component({
    components: {
      BidGoal,
      BidWar,
    },
  })
  export default class BidPanel extends Vue {
    @Prop() bid!: Bid;
  }
</script>

<style scoped>
  #container {
    background-color: rgba(0, 0, 0, 0.9);
    max-width: 100%;
    min-width: 20%;
    display: flex;
    flex-direction: column;
    text-align: center;
    color: white;
    line-height: 4px;
    max-height: 230px;
    border: 3px solid #3a008b;
    transition: width 0.5s;
    white-space: nowrap;
    overflow: hidden;
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
