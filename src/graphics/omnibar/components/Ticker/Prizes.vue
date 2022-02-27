<template>
  <div id="prizes">
    <ticker-label :label="'DOSTĘPNE <br/> NAGRODY'" />
    <div id="prize" v-if="prize">
      <p :style="{ fontSize: '20px' }">
        <b>{{ prize.name }}</b>
      </p>
      <p v-if="prize.provided">
        Nagroda dostarczona przez: <b>{{ prize.provided }}</b
        ><template v-if="prize.minimumBid"
          >, minimalna wpłata:
          <b>{{ formatAmount(prize.minimumBid) }} zł</b></template
        >
        <template v-if="etaUntil">w ciągu {{ etaUntil }}</template>
      </p>
    </div>
  </div>
</template>

<script>
  import TickerLabel from './Label.vue';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import utc from 'dayjs/plugin/utc';
  import timezone from 'dayjs/plugin/timezone';
  import pl from 'dayjs/locale/pl';

  dayjs.extend(relativeTime);
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const prizes = nodecg.Replicant('prizes');

  export default {
    name: 'TickerPrizes',
    components: {
      TickerLabel,
    },
    data() {
      return {
        prize: {},
      };
    },
    mounted() {
      console.log('Prizes: mounted');
      if (!prizes.value || prizes.value.length <= 0) {
        console.log('Prizes: unmounted');
        this.$emit('end');
      } else {
        this.prize = this.getPrize();
        setTimeout(() => {
          this.$emit('end');
          console.log('Prizes: unmounted');
        }, 5 * 1000);
      }
    },
    methods: {
      getPrize() {
        const activePrizes = prizes.value.filter(
          (prize) =>
            !!prize.startTime &&
            !!prize.endTime &&
            Date.now() > prize.startTime &&
            Date.now() < prize.endTime
        );
        if (activePrizes.length === 1) {
          return activePrizes[0];
        } else if (activePrizes.length > 1) {
          const rand = Math.floor(Math.random() * activePrizes.length);
          return activePrizes[rand];
        } else {
          console.log('Prizes: unmounted');
          this.$emit('end');
        }
      },
      formatAmount(amount) {
        return `${amount.toFixed(2)}`;
      },
    },
    computed: {
      etaUntil() {
        return this.prize.endTime
          ? dayjs
              .unix(this.prize.endTime / 1000)
              .tz('Europe/Warsaw')
              .locale(pl)
              .fromNow(true)
          : undefined;
      },
    },
  };
</script>

<style scoped>
  #prizes {
    display: flex;
    flex-direction: row;
    color: white;
    height: 100%;
    white-space: nowrap;
    overflow: hidden;
  }

  #prize {
    flex-direction: column;
    margin-left: 10px;
    height: 66px;
    line-height: 5px;
  }
</style>
