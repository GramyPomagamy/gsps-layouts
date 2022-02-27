<template>
  <div id="bid">
    <template v-if="bid.options.length > 0">
      <div
        class="option"
        :id="`option-${index}`"
        v-for="(option, index) in options"
        :key="option.name"
      >
        <div class="option-info">
          <span class="option-name">
            {{ option.name }}
          </span>
          <span class="option-amount">
            <b :id="`amount-${index}`">{{ amounts[index].total }}</b>
            PLN
          </span>
        </div>

        <div
          class="option-progress"
          :id="`progress-${index}`"
          :style="{ backgroundColor: getColor(index) }"
        ></div>
      </div>
      <h1 id="more" v-if="bid.options.length > 5">...i inne!</h1>
    </template>
    <template v-else>
      <div id="option-info">
        <span :style="{ fontSize: '32px', textShadow: '2px 2px 2px black' }"
          >Zasugeruj opcję jako pierwszy!</span
        >
      </div>
    </template>
  </div>
</template>

<script>
  import gsap from 'gsap';

  const colors = [
    'rgba(0, 255, 255, 0.5)',
    'rgba(3, 164, 255, 0.5)',
    'rgba(3, 43, 255, 0.5)',
    'rgba(174, 3, 255, 0.5)',
    'rgba(255, 3, 137, 0.5)',
  ];

  export default {
    name: 'BidChoiceMany',
    props: ['bid'],
    methods: {
      getColor(index) {
        return colors[index];
      },
      animate() {
        const tl = gsap.timeline();
        tl.addLabel('animation', '+=1');
        if (this.bid.options.length > 0) {
          for (let i = 0; i < this.bid.options.length; i++) {
            tl.fromTo(
              `#progress-${i}`,
              {
                width: '0%',
              },
              {
                width:
                  (this.bid.options[i].rawTotal / this.bid.rawTotal) * 100 +
                  '%',
                duration: 1,
                ease: 'power4',
              },
              'animation'
            );

            tl.to(
              this.$data.amounts[i],
              {
                duration: 1,
                total: this.bid.options[i].rawTotal,
                roundProps: 'total',
                ease: 'power4',
              },
              'animation'
            );

            tl.call(
              () => {
                setTimeout(() => {
                  this.$emit('end');
                }, 5000);
              },
              null,
              null
            );
          }
        } else {
          tl.call(
            () => {
              setTimeout(() => {
                this.$emit('end');
              }, 5000);
            },
            null,
            null
          );
        }
      },
    },
    computed: {
      remaining() {
        return this.bid.options.length - 5;
      },
      options() {
        return Array.from(this.bid.options).slice(0, 5);
      },
    },
    data() {
      return {
        amounts: [
          { total: 0 },
          { total: 0 },
          { total: 0 },
          { total: 0 },
          { total: 0 },
        ],
      };
    },
    mounted() {
      this.animate();
    },
  };
</script>

<style scoped>
  @import url('../../../../css/styles.css');

  .option-name {
    margin-left: 5px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: block;
    max-width: calc(100% - 100px);
  }

  .option-amount {
    margin-right: 5px;
  }

  .option-info {
    display: flex;
    justify-content: space-between;
    text-shadow: 2px 2px 2px black;
  }

  #bid {
    width: 100%;
    margin-top: -35px;
  }

  #more {
    width: 100%;
    text-align: center;
  }

  .option {
    background-color: rgb(0, 0, 0, 0.2);
    width: 100%;
    margin-bottom: 10px;
    height: 29px;
    border-bottom: 2px solid rgb(255, 255, 255, 0.5);
    font-size: 20px;
  }

  .option-progress {
    height: 100%;
    margin-top: -27px;
  }
</style>
