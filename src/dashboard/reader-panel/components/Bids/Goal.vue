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
          <i v-if="etaUntil">Ten run odbędzie się za ok. {{ etaUntil }}</i>
        </h5>
      </v-col>
      <v-progress-linear :value="progress" rounded height="19">
        <template>
          <strong
            >{{ bid.total }} / {{ bid.goal }}
            <template v-if="!bid.state === 'CLOSED'">
              (Pozostało {{ amountLeft }} zł)</template
            ></strong
          >
        </template>
      </v-progress-linear>
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
