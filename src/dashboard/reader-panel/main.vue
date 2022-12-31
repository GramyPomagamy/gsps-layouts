<template>
  <v-app>
    <v-container fluid>
      <div id="host-container">
        <div id="left" class="column">
          <reader-panel-reader
            class="panel"
            :reader="reader"
            @update="updateReader"
          />
          <reader-panel-bids class="panel" :bids="allBids" />
        </div>
        <div id="middle" class="column">
          <reader-panel-total class="panel" :total="total" />
          <reader-panel-run-status
            class="panel"
            :timer="timer"
            :run="activeRun"
          />
          <reader-panel-milestones
            class="panel"
            :milestones="milestones"
            :total="total"
          />
        </div>
        <div id="right" class="column">
          <reader-panel-donations
            :donations="donationsToRead"
            :donationsToAccept="donationsToAccept"
            :bidsToAccept="bidsToAccept"
            class="panel"
          />
        </div>
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
    Reader,
  } from '@gsps-layouts/types/schemas';
  import type { RunDataActiveRun, Timer } from 'speedcontrol/src/types/schemas';
  import { Milestones } from '@gsps-layouts/types';
  import { storeModule } from './store';
  import { Getter } from 'vuex-class';
  import ReaderPanelTotal from './components/Total.vue';
  import ReaderPanelBids from './components/Bids.vue';
  import ReaderPanelReader from './components/Reader.vue';
  import ReaderPanelMilestones from './components/Milestones.vue';
  import ReaderPanelRunStatus from './components/RunStatus.vue';
  import ReaderPanelDonations from './components/Donations.vue';

  @Component({
    components: {
      ReaderPanelTotal,
      ReaderPanelBids,
      ReaderPanelReader,
      ReaderPanelMilestones,
      ReaderPanelRunStatus,
      ReaderPanelDonations,
    },
  })
  export default class extends Vue {
    @Getter readonly allBids!: Bids[];
    @Getter readonly total!: Total;
    @Getter readonly donationsToRead!: DonationsToRead;
    @Getter readonly reader!: Reader;
    @Getter readonly milestones!: Milestones;
    @Getter readonly timer!: Timer;
    @Getter readonly activeRun!: RunDataActiveRun;
    @Getter readonly donationsToAccept!: number;
    @Getter readonly bidsToAccept!: number;

    updateReader(name: string): void {
      storeModule.updateReader(name);
    }
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

  .column {
    flex-direction: column;
  }
</style>
