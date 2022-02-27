<template>
  <v-app>
    <v-container fluid>
      <div id="host-container">
        <div id="left" class="column">
          <reader-panel-bids class="panel" :bids="allBids" />
        </div>
        <div id="middle" class="column">
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
  import { Milestones } from '@gsps-layouts/types';
  import { storeModule } from './store';
  import { Getter } from 'vuex-class';
  import ReaderPanelTotal from './components/Total.vue';
  import ReaderPanelBids from './components/Bids.vue';
  import ReaderPanelMilestones from './components/Milestones.vue';

  @Component({
    components: {
      ReaderPanelTotal,
      ReaderPanelBids,
      ReaderPanelMilestones,
    },
  })
  export default class extends Vue {
    @Getter readonly allBids!: Bids[];
    @Getter readonly total!: Total;
    @Getter readonly milestones!: Milestones;

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
