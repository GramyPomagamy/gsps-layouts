<template>
  <div id="MilestoneElement">
    <ticker-label :label="'POSTĘP <br/> CELU'" />
    <transition name="fade" mode="out-in">
      <div id="milestone" v-if="milestone" :key="milestone.name">
        <div id="milestone-label">
          <p>
            {{ milestone.name }}
            <template v-if="milestoneInfo.total >= milestone.amount">
              <br />
              <span :style="{ color: 'green' }">ZDOBYTO!</span>
            </template>
          </p>
        </div>
        <div id="progress-bar">
          <div
            :style="{ backgroundColor: 'background-color: rgb(0, 0, 0, 0.5);' }"
          ></div>
          <div
            :style="{
              width: `${milestoneInfo.progress}%`,
              'max-width': '100%',
              'background-color': '#3A008B',
              height: '100%',
            }"
          ></div>
        </div>
        <div id="total-label">
          <span>{{ milestoneInfo.total }} </span> /
          <span> {{ milestone.amount }} PLN</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import gsap from 'gsap';
  import TickerLabel from './Label.vue';
  const milestones = nodecg.Replicant('milestones');
  const total = nodecg.Replicant('total');

  export default {
    name: 'TickerMilestone',
    components: {
      TickerLabel,
    },
    data() {
      return {
        milestone: {},
        milestoneInfo: {
          total: 0,
          progress: 0,
        },
      };
    },
    methods: {
      animate() {
        gsap.to(this.milestoneInfo, {
          duration: 4,
          total: total.value.raw,
          roundProps: 'total',
          ease: 'power3',
        });
        gsap.to(this.milestoneInfo, {
          duration: 4,
          progress: (total.value.raw / this.milestone.amount) * 100,
          ease: 'power3',
          onComplete: () => {
            setTimeout(() => {
              this.$emit('end');
              console.log('Milestone: ended');
            }, 5000);
          },
        });
      },
      getCurrentMilestone() {
        let milestone = null;
        for (let i = 0; i < milestones.value.length; i++) {
          if (total.value.raw <= milestones.value[i].amount) {
            milestone = milestones.value[i];
            break;
          }
        }

        return milestone;
      },
    },
    mounted() {
      console.log('Milestone: mounted');
      this.milestone = this.getCurrentMilestone();
      if (this.milestone) {
        setTimeout(() => {
          this.animate();
        }, 1.5 * 1000);
      } else {
        this.$emit('end');
        console.log('Milestone: ended');
      }
    },
  };
</script>

<style scoped>
  #MilestoneElement {
    width: 100%;
    height: 100%;
    display: flex;
    color: white;
    flex-grow: 1;
  }

  #milestone-label {
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

  #milestone {
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
