<template>
  <div style="border: 1px solid white" class="rounded pa-2 ma-1 grey darken-3">
    <v-row no-gutters>
      <v-col cols="12">
        <h2>{{ bid.game }} - {{ bid.name }}</h2>
        <h5><i>Ten run odbędzie się planowo za ok. 2 godziny</i></h5>
      </v-col>
      <v-progress-linear :value="progress" :color="amountLeft <= 0 ? 'green' : 'cyan'" rounded height="19">
        <template>
          <strong
            >{{ bid.total }} / {{ bid.goal }} <template v-if="amountLeft > 0"> (Pozostało
            {{ amountLeft }} zł)</template></strong
          >
        </template>
      </v-progress-linear>
    </v-row>
  </div>
</template>

<script>
  export default {
    name: 'ReaderPanelBidsGoal',
    props: ['bid'],
    computed: {
      progress: {
        get() {
          return ((this.bid.rawTotal / this.bid.rawGoal) * 100).toFixed(1);
        },
      },
      amountLeft: {
        get() {
          return this.bid.rawGoal - this.bid.rawTotal;
        },
      },
    },
  };
</script>
