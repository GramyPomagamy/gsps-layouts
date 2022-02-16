<template>
  <div id="War">
    <ticker-label :label="'LICYTACJE <br/> WYBORY'" />
    <transition name="fade" mode="out-in">
      <div id="bid" v-if="currentBid" :key="currentBid.public">
        <div id="bid-label">
          <p>
            {{ currentBid.game }} <br />
            {{ currentBid.name }}
          </p>
        </div>
        <div id="options">
          <template v-if="currentBid.options.length > 0">
            <bid-war-option
              v-for="(option, index) in currentBid.options"
              :option="option"
              :winning="index === 0"
              class="option"
              :style="{ opacity: 0 }"
              :id="`option${index + 1}`"
              :key="index"
            />
          </template>
          <template
            v-else-if="
              currentBid.allowUserOptions && !currentBid.options.length > 0
            "
          >
            <bid-war-option
              :option="placeholderOption"
              :winning="true"
              class="option"
              :style="{ opacity: 0 }"
              id="option1"
            />
          </template>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import gsap from 'gsap';
  import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
  import TickerLabel from './Label.vue';
  import BidWarOption from './BidWar/Option.vue';
  const bids = nodecg.Replicant('currentBids');
  gsap.registerPlugin(ScrollToPlugin);

  export default {
    name: 'TickerBidWar',
    components: {
      TickerLabel,
      BidWarOption,
    },
    data() {
      return {
        bids: {},
        currentBid: {},
        placeholderOption: {
          name: 'Wpłać jako pierwszy na tę licytację!',
          rawTotal: '',
        },
      };
    },
    methods: {
      getBids() {
        const wars = bids.value
          .filter((bid) => bid.type != 'challenge')
          .slice(0, 3);
        return wars;
      },
      nextBid() {
        if (!this.bids || this.bids <= 0) {
          return;
        }

        let currentIdx = this.bids.indexOf(this.currentBid);
        let nextIdx = currentIdx + 1;
        if (nextIdx >= this.bids.length) {
          this.$emit('end');
          console.log('BidWar: ended');
        }
        this.currentBid = this.bids[nextIdx];
        setTimeout(() => {
          this.animate();
        }, 1200);
      },
      animate() {
        const elements = document.querySelectorAll('.option');
        const arr = [].slice.call(elements);
        const tl = gsap.timeline({
          delay: 1,
          paused: true,
          onComplete: () => {
            setTimeout(() => {
              this.nextBid();
            }, 1000);
          },
        });
        arr.forEach((element) => {
          tl.to(element, {
            opacity: 1,
            translateX: '-5px',
            duration: 0.3,
          });
        });

        const loopLength = this.currentBid.options.length;
        const optionsBar = document.getElementById('options');

        let scrollCount = 0;
        for (let i = 1; i < loopLength; i += 1) {
          const el = document.getElementById(`option${i + 1}`);
          const endPos = optionsBar.scrollWidth - optionsBar.clientWidth;
          if (endPos > el.offsetLeft) scrollCount += 1;
        }

        // Timeline anim
        for (let i = 1; i < loopLength; i += 1) {
          const el = document.getElementById(`option${i + 1}`);
          const endPos = optionsBar.scrollWidth - optionsBar.clientWidth;
          tl.to(
            optionsBar,
            {
              scrollLeft: Math.min(el.offsetLeft + 15, endPos),
              duration: 5,
            },
            i > 1 ? `+=${Math.max(scrollCount + 1, 2)}` : undefined
          );
          if (endPos <= el.offsetLeft) break;
        }

        tl.play();
      },
      getRef(name) {
        const rep = this.$refs[name];
        return Array.isArray(rep) ? rep[0] : rep;
      },
    },
    mounted() {
      this.bids = this.getBids();
      console.log('BidWar: mounted');

      this.currentBid = this.bids[0];

      setTimeout(() => {
        this.animate();
      }, 1200);
    },
  };
</script>

<style scoped>
  #War {
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
    margin-right: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-align: center;
    flex-shrink: 0;
  }

  #options {
    display: flex;
    flex-direction: row;
    overflow: hidden;
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
