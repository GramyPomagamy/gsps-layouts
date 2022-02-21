<template>
  <div
    style="border: 1px solid white"
    class="rounded pa-2 ma-1 darken-3"
    :class="bid.state === 'CLOSED' ? 'green' : 'grey'"
  >
    <v-row no-gutters>
      <v-col cols="12">
        <h2>{{ bid.game }} - {{ bid.name }}</h2>
        <h5>
          <i v-if="etaUntil"
            >Ten run odbędzie się planowo za ok. {{ etaUntil }}</i
          >
        </h5>
      </v-col>
      <div style="width: 100%">
        <template v-for="(option, index) in bid.options">
          <h3>{{ index + 1 }}. {{ option.name }} - {{ option.total }}</h3>
          <v-progress-linear :value="getProgress(option)" rounded height="10" />
        </template>
      </div>
    </v-row>
  </div>
</template>

<script>
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import utc from 'dayjs/plugin/utc';
  import timezone from 'dayjs/plugin/timezone';
  import pl from 'dayjs/locale/pl';

  dayjs.extend(relativeTime);
  dayjs.extend(utc);
  dayjs.extend(timezone);

  export default {
    name: 'ReaderPanelBidWar',
    props: ['bid'],
    methods: {
      getProgress(option) {
        return ((option.rawTotal / this.bid.rawTotal) * 100).toFixed(1);
      },
    },
    computed: {
      etaUntil() {
        return this.bid.endTime
          ? dayjs
              .unix(this.bid.endTime / 1000)
              .tz('Europe/Warsaw')
              .locale(pl)
              .fromNow(true)
          : undefined;
      },
    },
  };
</script>
