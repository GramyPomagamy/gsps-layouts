<template>
  <v-expansion-panel>
    <v-expansion-panel-header
      >{{ donation.name }} -
      {{ formatAmount(donation.amount) }} zł</v-expansion-panel-header
    >
    <v-expansion-panel-content>
      <div :style="{ width: '100%' }">
        <p><b>Wpłacający: </b>{{ donation.name }}</p>
        <p><b>Kwota: </b>{{ formatAmount(donation.amount) }} zł</p>
        <p><b>Wpłacono: </b>{{ formatDate(donation.timestamp) }}</p>
        <div>
          <p><b>Komentarz</b></p>
          <p>{{ donation.comment }}</p>
        </div>

        <p v-if="donation.bid && donation.bid.length"><b>Licytacje</b></p>
        <template
          v-if="donation.bid && donation.bid.length"
          v-for="bid in donation.bid"
        >
          <p :key="bid.id">{{ getBidName(bid.id) }} - {{ bid.amount }} zł</p>
        </template>
        <v-btn block color="primary" @click="setDonationAsRead"
          >Zaznacz donację jako przeczytaną</v-btn
        >
      </div>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
  const bids = nodecg.Replicant('allBids');

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
    name: 'ReaderPanelDonation',
    props: ['donation'],
    methods: {
      formatAmount(amount) {
        return amount.toFixed(2);
      },
      formatDate(date) {
        return dayjs
          .unix(date / 1000)
          .tz('Europe/Warsaw')
          .locale(pl)
          .format('LLL');
      },
      getBidName(id) {
        let bidName;
        Array.from(bids.value).forEach((bid) => {
          if (bid.id === id) {
            bidName = `${bid.game} - ${bid.name}`;
          }
        });

        if (bidName) {
          return bidName;
        } else {
          const bidWars = Array.from(bids.value).filter(
            (bid) => bid.type != 'challenge'
          );
          bidWars.forEach((bid) => {
            bid.options.forEach((option) => {
              if (option.id === id) {
                console.log(`found id ${id}`);
                bidName = `${bid.game} - ${bid.name} - ${option.name}`;
              }
            });
          });
          return bidName;
        }
      },
      setDonationAsRead() {
        nodecg.sendMessage('setDonationAsRead', this.donation.id);
      },
    },
  };
</script>
