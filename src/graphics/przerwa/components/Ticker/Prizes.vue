<template>
  <div id="prizes">
    <div id="prize" v-if="prize" class="layout layout-horizontal">
      <div id="prize-image">
        <img
          :src="prize.image"
          v-if="prize.image"
          :style="{ maxWidth: '100%', maxHeight: '100%' }"
        />
      </div>
      <div id="prize-info">
        <p id="prize-name" :style="{ marginTop: '20px' }">
          <b>{{ prize.name }}</b>
        </p>
        <p
          v-if="prize.provided"
          :style="{ fontSize: '24px', marginTop: '20px' }"
        >
          Nagroda dostarczona przez: {{ prize.provided }}
        </p>
        <p
          v-if="prize.minimumBid"
          :style="{ fontSize: '24px', marginTop: '-15px' }"
        >
          Minimalna suma donacji: {{ formatAmount(prize.minimumBid) }} zł
        </p>
        <p v-if="etaUntil" :style="{ fontSize: '24px', marginTop: '-15px' }">
          Wpłać w ciągu {{ etaUntil }}, aby mieć szansę wygrać!
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  const prizes = nodecg.Replicant('prizes');
  import fitty from 'fitty';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import utc from 'dayjs/plugin/utc';
  import timezone from 'dayjs/plugin/timezone';
  import pl from 'dayjs/locale/pl';

  dayjs.extend(relativeTime);
  dayjs.extend(utc);
  dayjs.extend(timezone);

  export default {
    name: 'BreakPrizes',
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
        this.fitText();
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
          this.$emit('label', 'NAGRODY');
          return activePrizes[0];
        } else if (activePrizes.length > 1) {
          this.$emit('label', 'NAGRODY');
          const rand = Math.floor(Math.random() * activePrizes.length);
          return activePrizes[rand];
        } else {
          this.$emit('label', '');
          console.log('Prizes: unmounted');
          this.$emit('end');
        }
      },
      formatAmount(amount) {
        return `${amount.toFixed(2)}`;
      },
      fitText() {
        setTimeout(() => {
          fitty('#prize-name', {
            minSize: 1,
            maxSize: 40,
            multiLine: true,
          });
        }, 280);
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
  @import url('../../../css/styles.css');

  #prizes {
    color: white;
    width: 942px;
  }

  #prize {
    position: absolute;
    top: 45px;
    left: 30px;
    width: 100%;
  }

  #prize-image {
    width: 50%;
    height: 330px;
    margin-right: 10px;
  }

  #prize-info {
    position: relative;
    height: 122.4px;
    padding: 6px 0px;
    width: 955px;
    text-shadow: 2px 2px 8px #000000;
    text-align: left;
  }
</style>
