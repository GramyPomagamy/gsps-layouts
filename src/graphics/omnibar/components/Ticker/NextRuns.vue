<template>
  <div id="nextRuns">
    <ticker-label :label="'NASTĘPNIE'" />
    <div
      class="run"
      :class="{ 'next-run': nextRuns[0].id === run.id }"
      v-for="run in nextRuns"
      :key="run.id"
    >
      <span style="font-weight: 700"
        >{{ run.game }}
        <template v-if="run.category && run.category.length"
          >({{ run.category }})</template
        ></span
      >
      <br />
      <span>{{ formatPlayers(run) }}</span>
    </div>
  </div>
</template>

<script>
import TickerLabel from './Label.vue';
import gsap from 'gsap';
import clone from 'clone';

const runDataActiveRun = nodecg.Replicant(
  'runDataActiveRun',
  'nodecg-speedcontrol'
);
const runDataArray = nodecg.Replicant('runDataArray', 'nodecg-speedcontrol');
const obsData = nodecg.Replicant('obsData');
const config = nodecg.bundleConfig.obs;

export default {
  name: 'TickerNextRuns',
  components: {
    TickerLabel,
  },
  data() {
    return {
      nextRuns: [],
    };
  },
  mounted() {
    console.log('NextRuns: mounted');
    this.nextRuns = this.getNextRuns();
    if (this.nextRuns.length) {
      const animateRuns = () => {
        const elements = document.querySelectorAll('.run');
        const arr = [].slice.call(elements);
        const tl = gsap.timeline({ delay: 1 });
        arr.forEach((element) => {
          tl.to(element, {
            opacity: 1,
            translateX: '-5px',
            duration: 0.3,
          });
        });
        tl.play();
      };
      setTimeout(() => {
        animateRuns();
      }, 50);
      setTimeout(() => {
        this.$emit('end');
        console.log('NextRuns: ended');
      }, 10 * 1000);
    } else {
      this.$emit('end');
      console.log('NextRuns: ended');
    }
  },
  methods: {
    formatPlayers(run) {
      return (
        run.teams
          .map(
            (team) =>
              team.name || team.players.map((player) => player.name).join(', ')
          )
          .join(' vs. ') || 'Bez gracza'
      );
    },
    getNextRuns() {
      const runIndex = this.findRunIndex();
      if (obsData.value.scene) {
        if (obsData.value.scene === config.scenes.video) {
          return clone(runDataArray.value).slice(runIndex).slice(0, 4);
        } else {
          return clone(runDataArray.value)
            .slice(runIndex + 1)
            .slice(0, 4);
        }
      } else {
        return clone(runDataArray.value)
          .slice(runIndex + 1)
          .slice(0, 4);
      }
    },
    findRunIndex() {
      if (!runDataActiveRun.value) {
        return -1;
      }
      return clone(runDataArray.value).findIndex(
        (run) => run.id === runDataActiveRun.value.id
      );
    },
  },
};
</script>

<style scoped>
#nextRuns {
  display: flex;
  flex-direction: row;
  color: white;
  height: 100%;
  white-space: nowrap;
  overflow: hidden;
}

.run {
  border-top: 5px solid white;
  border-bottom: 5px solid white;
  margin-left: 10px;
  padding-top: 5px;
  padding-left: 5px;
  padding-right: 5px;
  flex-direction: column;
  height: 51px;
  opacity: 0;
}
.next-run {
  border-top: 5px solid #3a008b;
  border-bottom: 5px solid #3a008b;
}
</style>
