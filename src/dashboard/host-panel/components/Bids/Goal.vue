<template>
  <div
    style="border: 1px solid white"
    class="rounded pa-2 ma-1 darken-3"
    :class="bid.state === 'CLOSED' ? 'green' : 'grey'"
  >
    <v-row no-gutters>
      <v-col cols="12">
        <h2 :style="{ overflowWrap: 'break-word' }">
          {{ bid.game }} - {{ bid.name }}
        </h2>
        <h5>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <i v-if="etaUntil" v-bind="attrs" v-on="on"
                >Ten run odbędzie się planowo za ok. {{ etaUntil }}</i
              >
            </template>
            <span>{{ formattedDate }}</span>
          </v-tooltip>
        </h5>
        <h5 v-if="bid.longDescription">{{ bid.longDescription }}</h5>
      </v-col>
      <v-progress-linear :value="progress" rounded height="19">
        <template>
          <strong
            >{{ bid.total }} / {{ bid.goal }}
            <template v-if="bid.state != 'CLOSED'">
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
  import localizedFormat from 'dayjs/plugin/localizedFormat';
  import utc from 'dayjs/plugin/utc';
  import timezone from 'dayjs/plugin/timezone';
  import pl from 'dayjs/locale/pl';

  dayjs.extend(relativeTime);
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(localizedFormat);

  export default {
    name: 'ReaderPanelBidGoal',
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
        return this.bid.runStartTime
          ? dayjs
              .unix(this.bid.runStartTime / 1000)
              .tz('Europe/Warsaw')
              .locale(pl)
              .fromNow(true)
          : undefined;
      },
      formattedDate() {
        return dayjs
          .unix(this.bid.runStartTime / 1000)
          .tz('Europe/Warsaw')
          .locale(pl)
          .format('LLL');
      },
    },
  };
</script>
