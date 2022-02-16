<template>
  <div>
    <div
      id="bids"
      style="height: 900px; width: 900px; display: flex; flex-direction: column"
      class="grey darken-4 rounded-lg"
    >
      <h3
        style="width: 100%; text-align: center; position: sticky"
        class="grey darken-3 pa-1 rounded-tl-lg rounded-tr-lg"
      >
        LICYTACJE
      </h3>
      <div id="filter" class="mx-3">
        <v-text-field
          v-model="bidfilter"
          placeholder="Filtruj..."
        ></v-text-field>
      </div>
      <v-divider />
      <div class="pa-2" style="height: 100%; overflow: auto">
        <template v-for="bid in bids">
          <reader-panel-bids-goal
            v-if="bid.type === 'challenge' && bidName(bid).includes(bidfilter)"
            :bid="bid"
            :key="bid.id"
          />
          <reader-panel-bid-war
            v-if="bid.type != 'challenge' && bidName(bid).includes(bidfilter)"
            :bid="bid"
            :key="bid.id"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import ReaderPanelBidsGoal from './Bids/Goal.vue';
  import ReaderPanelBidWar from './Bids/War.vue';

  export default {
    name: 'ReaderPanelBids',
    data() {
      return {
        bidfilter: '',
      };
    },
    components: {
      ReaderPanelBidsGoal,
      ReaderPanelBidWar,
    },
    props: ['bids'],
    methods: {
      bidName(bid) {
        return `${bid.game} - ${bid.name}`.toLowerCase();
      },
    },
  };
</script>
