<template>
  <v-app>
    <v-container fluid>
      <div id="host-container">
        <div>
          <host-panel-countdown
            class="panel"
            :hostCountdownReplicant="hostCountdownReplicant"
          />
        </div>

        <div class="break"></div>

        <div id="left" class="column">
          <reader-panel-bids class="panel" :bids="allBids" />
        </div>
        <div id="right" class="column">
          <reader-panel-total class="panel" :total="total" />
          <reader-panel-milestones
            class="panel"
            :milestones="milestones"
            :total="total"
          />
        </div>
      </div>
    </v-container>
  </v-app>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import type { Bids, Total } from '@gsps-layouts/types/schemas';
  import type { Countdown } from '@gsps-layouts/types/schemas/countdown';
  import { Milestones } from '@gsps-layouts/types';
  import { Getter } from 'vuex-class';
  import ReaderPanelTotal from './components/Total.vue';
  import ReaderPanelBids from './components/Bids.vue';
  import ReaderPanelMilestones from './components/Milestones.vue';
  import HostPanelCountdown from './components/Countdown.vue';

  @Component({
    components: {
      ReaderPanelTotal,
      ReaderPanelBids,
      ReaderPanelMilestones,
      HostPanelCountdown,
    },
  })
  export default class extends Vue {
    @Getter readonly allBids!: Bids[];
    @Getter readonly total!: Total;
    @Getter readonly milestones!: Milestones;
    @Getter readonly hostCountdownReplicant!: Countdown;
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

  .break {
    flex-basis: 100%;
    height: 0;
  }
</style>
