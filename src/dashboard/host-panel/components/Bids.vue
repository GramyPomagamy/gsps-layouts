<template>
  <div>
    <div
      id="bids"
      style="height: 600px; width: 600px; display: flex; flex-direction: column"
      class="grey darken-4 rounded-lg"
    >
      <h3
        style="width: 100%; text-align: center; position: sticky"
        class="grey darken-3 pa-1 rounded-tl-lg rounded-tr-lg"
      >
        LICYTACJE
      </h3>
      <div id="refreshCountdown">
        <v-progress-linear
          :indeterminate="updating"
          :value="((timeLeft / 20) * 100).toFixed(1)"
          height="12"
        />
        <div class="mt-3">
          <p v-if="!updating">
            Odświeżam za <b>{{ timeLeft }}</b> sekund...
          </p>
          <p v-else>Odświeżam...</p>
        </div>
      </div>
      <v-divider />
      <div id="filter" class="mx-3">
        <v-text-field
          class="mt-6"
          dense
          outlined
          v-model="bidfilter"
          placeholder="Filtruj..."
        ></v-text-field>
        <v-tooltip left
          ><template v-slot:activator="{ on, attrs }">
            <v-btn
              :disabled="updating"
              :loading="updating"
              fab
              v-bind="attrs"
              @click="updateBids"
              v-on="on"
              class="mt-4 ml-2"
              ><v-icon>mdi-refresh</v-icon></v-btn
            >
          </template>
          <span>Odśwież licytacje ręcznie</span></v-tooltip
        >
      </div>
      <v-divider />
      <div class="pa-2" style="height: 100%; overflow: auto">
        <div id="open-bids">
          <template v-for="bid in bids">
            <reader-panel-bid-goal
              v-if="
                bid.type === 'challenge' &&
                bidName(bid).includes(bidfilter) &&
                bid.state === 'OPENED'
              "
              :bid="bid"
              :key="timestamp + bid.id"
            />
            <reader-panel-bid-war
              v-if="
                bid.type != 'challenge' &&
                bidName(bid).includes(bidfilter) &&
                bid.state === 'OPENED'
              "
              :bid="bid"
              :key="timestamp + bid.id"
            />
          </template>
        </div>
        <div id="closed-bids">
          <template v-for="bid in bids">
            <reader-panel-bids-goal
              v-if="
                bid.type === 'challenge' &&
                bidName(bid).includes(bidfilter) &&
                bid.state === 'CLOSED'
              "
              :bid="bid"
              :key="timestamp + bid.id"
            />
            <reader-panel-bid-war
              v-if="
                bid.type != 'challenge' &&
                bidName(bid).includes(bidfilter) &&
                bid.state === 'CLOSED'
              "
              :bid="bid"
              :key="timestamp + bid.id"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ReaderPanelBidGoal from './Bids/Goal.vue';
  import ReaderPanelBidWar from './Bids/War.vue';

  export default {
    name: 'ReaderPanelBids',
    data() {
      return {
        bidfilter: '',
        updating: false,
        refreshTimer: undefined,
        timeLeft: 20,
        timestamp: Date.now(),
      };
    },
    components: {
      ReaderPanelBidGoal,
      ReaderPanelBidWar,
    },
    props: ['bids'],
    methods: {
      bidName(bid) {
        return `${bid.game} - ${bid.name}`.toLowerCase();
      },
      updateBids() {
        nodecg.sendMessage('updateBids');
      },
      startRefreshCountdown() {
        this.refreshTimer = setInterval(() => {
          if (this.timeLeft == 1) {
            clearInterval(this.refreshTimer);
            this.timeLeft = 0;
          }
          this.timeLeft -= 1;
        }, 1000);
      },
    },
    mounted() {
      nodecg.listenFor('bids:updating', () => {
        clearInterval(this.refreshTimer);
        this.updating = true;
      });

      nodecg.listenFor('bids:updated', () => {
        this.timeLeft = 20;
        this.startRefreshCountdown();
        this.updating = false;
        this.timestamp = Date.now();
      });

      this.startRefreshCountdown();
    },
  };
</script>

<style scoped>
  #filter {
    display: flex;
  }

  #refreshCountdown {
    text-align: center;
    width: 100%;
  }
</style>
