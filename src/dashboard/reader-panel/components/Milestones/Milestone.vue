<template>
  <div
    style="border: 1px solid white"
    class="rounded pa-2 ma-1 darken-3"
    :class="met ? 'green' : 'grey'"
  >
    <v-row no-gutters>
      <v-col cols="12">
        <h2>{{ milestone.name }}</h2>
      </v-col>
      <v-progress-linear :value="progress" rounded height="19">
        <template>
          <strong
            >{{ total }} zł / {{ milestone.amount }} zł
            <template v-if="!met">
              (Pozostało {{ amountLeft }} zł)</template
            ></strong
          >
        </template>
      </v-progress-linear>
    </v-row>
  </div>
</template>

<script>
  export default {
    name: 'ReaderPanelMilestone',
    props: ['milestone', 'met', 'total'],
    computed: {
      progress: {
        get() {
          return ((this.total / this.milestone.amount) * 100).toFixed(1);
        },
      },
      amountLeft: {
        get() {
          return (this.milestone.amount - this.total).toFixed(2);
        },
      },
    },
  };
</script>
