<template>
  <v-app>
    <v-container fluid>
      <div id="host-container">
        <reader-panel-bids class="panel" :bids="allBids"/>
        <reader-panel-total class="panel" :total="total" />
      </div>
    </v-container>
  </v-app>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import type {
    Bids,
    DonationsToRead,
    Total,
  } from '@gsps-layouts/types/schemas';
  import { Getter } from 'vuex-class';
  import ReaderPanelTotal from './components/Total.vue';
  import ReaderPanelBids from './components/Bids.vue';

  @Component({
    components: {
      ReaderPanelTotal,
      ReaderPanelBids
    },
  })
  export default class extends Vue {
    @Getter readonly allBids!: Bids[];
    @Getter readonly total!: Total;
    @Getter readonly donationsToRead!: DonationsToRead;
  }
</script>

<style>
  #host-container {
    display: flex;
    flex-flow: row wrap;
    width: 100%;
    height: 100%;
    justify-content: center;
    padding: 5px;
  }

  .panel {
    margin: 5px;
  }
</style>
