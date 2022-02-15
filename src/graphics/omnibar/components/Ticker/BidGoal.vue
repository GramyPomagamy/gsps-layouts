<template>
  <div id="Goal">
    <ticker-label :label="'LICYTACJE <br/> CELE'" />
    <transition name="fade" mode="out-in">
      <div id="bid" v-if="currentBid" :key="currentBid.public">
        <div id="bid-label">
          <p>
            {{ currentBid.game }} <br />
            {{ currentBid.name }}
          </p>
        </div>
        <div id="progress-bar">
          <div
            :style="{ backgroundColor: 'background-color: rgb(0, 0, 0, 0.5);' }"
          ></div>
          <div
            :style="{
              width: `${bidInfo.progress}%`,
              'max-width': '100%',
              'background-color': '#3A008B',
              height: '100%',
            }"
          ></div>
        </div>
        <div id="total-label">
          <span>{{ bidInfo.total }} </span> /
          <span> {{ currentBid.rawGoal }} PLN</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import gsap from 'gsap';
  import TickerLabel from './Label.vue';
  const bids = nodecg.Replicant('currentBids');

  export default {
    name: 'TickerBidGoal',
    components: {
      TickerLabel,
    },
    data() {
      return {
        bids: {},
        currentBid: {},
        bidInfo: {
          total: 0,
          progress: 0,
        },
      };
    },
    methods: {
      getBids() {
        const challenges = bids.value
          .filter((bid) => bid.type === 'challenge')
          .slice(0, 3);
        return challenges;
      },
      nextBid() {
        if (!this.bids || this.bids <= 0) {
          return;
        }

        let currentIdx = this.bids.indexOf(this.currentBid);
        let nextIdx = currentIdx + 1;
        if (nextIdx >= this.bids.length) {
          this.$emit('end');
          console.log('BidGoal: ended');
        }
        this.currentBid = this.bids[nextIdx];
        this.bidInfo = {
          total: 0,
          progress: 0,
        };
        setTimeout(() => {
          this.animate();
        }, 1.5 * 1000);
      },
      animate() {
        gsap.to(this.bidInfo, {
          duration: 4,
          total: this.currentBid.rawTotal,
          roundProps: 'total',
          ease: 'power3',
        });
        gsap.to(this.bidInfo, {
          duration: 4,
          progress: (this.currentBid.rawTotal / this.currentBid.rawGoal) * 100,
          ease: 'power3',
          onComplete: () => {
            setTimeout(() => {
              this.nextBid();
            }, 3000);
          },
        });
      },
    },
    mounted() {
      this.bids = this.getBids();
      console.log('BidGoal: mounted');

      this.currentBid = this.bids[0];

      setTimeout(() => this.animate(), 1.5 * 1000);
    },
  };
</script>

<style scoped>
  #Goal {
    width: 100%;
    height: 100%;
    display: flex;
    color: white;
    flex-grow: 1;
  }

  #bid-label {
    font-weight: 700;
    height: 66px;
    background-color: rgb(0, 0, 0, 0.5);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0px 10px;
    white-space: nowrap;
    overflow: hidden;
    text-align: center;
    flex-shrink: 0;
  }

  #total-label {
    font-weight: 700;
    height: 66px;
    background-color: rgb(0, 0, 0, 0.5);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0px 10px;
    white-space: nowrap;
    overflow: hidden;
    text-align: center;
    flex-shrink: 0;
    font-size: 24px;
  }

  #progress-bar {
    height: 66px;
    overflow: hidden;
    width: 100%;
  }

  #bid {
    width: 100%;
    display: flex;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
