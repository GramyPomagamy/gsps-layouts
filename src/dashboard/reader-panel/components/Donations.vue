<template>
  <div
    id="donations"
    style="height: 959px; width: 550px; display: flex; flex-direction: column"
    class="grey darken-4 rounded-lg"
  >
    <h3
      style="width: 100%; text-align: center; position: sticky"
      class="grey darken-3 pa-1 rounded-tl-lg rounded-tr-lg"
    >
      DONACJE DO PRZECZYTANIA
    </h3>
    <div id="refreshCountdown">
      <v-progress-linear
        :indeterminate="updating"
        :value="((timeLeft / 10) * 100).toFixed(1)"
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
        v-model="filter"
        placeholder="Filtruj..."
        clearable
      ></v-text-field>
      <v-tooltip left
        ><template v-slot:activator="{ on, attrs }">
          <v-btn
            :disabled="updating"
            :loading="updating"
            fab
            v-bind="attrs"
            @click="updateDonations"
            v-on="on"
            class="mt-4 ml-2"
            ><v-icon>mdi-refresh</v-icon></v-btn
          >
        </template>
        <span>Odśwież donacje ręcznie</span></v-tooltip
      >
    </div>
    <v-divider />
    <div class="pa-2">
      Donacje do zaakceptowania: <b>{{ donationsToAccept }}</b>
    </div>
    <div class="pa-2">
      Bidy do zaakceptowania: <b>{{ bidsToAccept }}</b>
    </div>
    <v-divider />
    <div class="pa-2" style="height: 100%; overflow: auto">
      <v-expansion-panels accordion v-if="donations && donations.length">
        <reader-panel-donation
          v-for="donation in donations"
          v-if="donation.name.toLowerCase().includes(filter)"
          :donation="donation"
          :key="donation.id"
        />
      </v-expansion-panels>
      <p :style="{ width: '100%', textAlign: 'center' }" v-else>
        Brak donacji do przeczytania
      </p>
    </div>
  </div>
</template>

<script>
  import ReaderPanelDonation from './Donations/Donation.vue';
  export default {
    name: 'ReaderPanelDonations',
    props: ['donations', 'donationsToAccept', 'bidsToAccept'],
    components: {
      ReaderPanelDonation,
    },
    data() {
      return {
        filter: '',
        updating: false,
        refreshTimer: undefined,
        timeLeft: 10,
      };
    },
    methods: {
      updateDonations() {
        nodecg.sendMessage('updateDonations');
      },
      startRefreshCountdown() {
        clearInterval(this.refreshTimer);
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
      nodecg.listenFor('donationsToRead:updating', () => {
        clearInterval(this.refreshTimer);
        this.updating = true;
      });

      nodecg.listenFor('donationsToRead:updated', () => {
        this.timeLeft = 10;
        this.startRefreshCountdown();
        this.updating = false;
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
