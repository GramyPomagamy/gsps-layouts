<template>
  <div>
    <h2>{{ bid.game }}</h2>
    <h3>{{ bid.description }}</h3>
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
