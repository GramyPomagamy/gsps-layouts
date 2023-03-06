<template>
  <div id="goal-container">
    <h2>{{ bid.game }}</h2>
    <h3>{{ bid.description }}</h3>
    <div id="amounts">
      <p style="font-size: 20px">{{ bid.total }}/{{ bid.goal }}</p>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { Bid } from '@gsps-layouts/types';

  @Component
  export default class BidGoal extends Vue {
    @Prop() bid!: Bid;
  }
</script>

<style scoped>
  #goal-container {
    line-height: 8px;
    text-shadow: 2px 2px 2px black;
    height: 100%;
    margin-left: 10px;
    margin-right: 10px;
  }
</style>
