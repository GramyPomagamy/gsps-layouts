<template>
  <div id="War">
    <ticker-label :label="'LICYTACJE <br/> WYBORY'" />
    <div id="label">
      <p>{{ bid.game }} <br/> {{ bid.name }}
    </div>
  </div>
</template>

<script>
  import gsap from 'gsap';
  const bids = nodecg.Replicant('currentBids');

  export default {
    name: 'TickerBidWar',
    data() {
      return {
        bid: {},
        choice1: {
          name: '',
          total: 0,
          percentage: 0,
        },
        choice2: {
          name: '',
          total: 0,
          percentage: 0,
        },
      };
    },
    methods: {
      getBid() {
        const wars = bids.value
          .slice(0, 3);
        return wars[Math.floor(Math.random() * wars.length)];
      },
    },
    mounted() {
      this.bid = this.getBid();
      console.log('BidWar: mounted');

/*       const animate = () => {
        gsap.to(this.choice1, {
          duration: 3,
          total: this.bid.options[0].rawTotal,
          roundProps: 'total',
          ease: 'power3',
        });
        gsap.to(this.choice1, {
          duration: 3,
          percentage: (this.bid.options[0].rawTotal / this.bid.rawTotal) * 100,
          ease: 'power3',
        });
        gsap.to(this.choice2, {
          duration: 3,
          total: this.bid.options[1].rawTotal,
          roundProps: 'total',
          ease: 'power3',
        });
        gsap.to(this.choice2, {
          duration: 3,
          percentage: (this.bid.options[1].rawTotal / this.bid.rawTotal) * 100,
          ease: 'power3',
        });
      };

      setTimeout(() => animate(), 1.5 * 1000);

      setTimeout(() => {
        this.$emit('end');
        console.log('BidWar1v1: ended');
      }, 10 * 1000); */
    },
  };
</script>

<style scoped>
  #War {
    width: 100%;
    height: 100%;
    display: flex;
    color: white;
  }

  #Text {
    text-shadow: 2px 2px 8px black;
    background-color: rgb(0, 0, 0, 0.2);
    width: 100%;
    height: 100%;
    display: flex;
    z-index: 10;
  }

  #ProgressBars {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  #label {
    font-weight: 700;
    height: 66px;
    background-color: #3a008b;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    min-width: 110px;
  }
</style>
