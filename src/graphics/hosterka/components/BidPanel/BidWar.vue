<template>
  <div id="war-container">
    <h2>{{ bid.game }}</h2>
    <h3>{{ bid.description }}</h3>
    <div id="options">
      <template v-if="bid.options.length > 0">
        <p class="option" v-for="(option, i) in bid.options" :key="option.id">
          {{ i + 1 }}. {{ option.name }} - {{ option.total }}
        </p>
      </template>
      <template v-else>
        <p>Zasugeruj opcję jako pierwszy!</p>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { Bid } from '@gsps-layouts/types';

  @Component
  export default class BidWar extends Vue {
    @Prop() bid!: Bid;
  }
</script>

<style scoped>
  #war-container {
    line-height: 8px;
    text-shadow: 2px 2px 2px black;
  }

  #options {
    margin-left: 10px;
    margin-right: 10px;
    display: grid;
    grid-template-columns: 1.5fr;
    grid-auto-columns: auto;
    grid-template-rows: 1fr 1fr;
    gap: 0px 20px;
    justify-items: center;
    align-items: center;
    grid-auto-flow: column;
  }
</style>
