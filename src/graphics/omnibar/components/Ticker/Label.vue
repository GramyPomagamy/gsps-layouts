<template>
  <div id="label" v-if="activeRun" :event="activeRun.customData.originalEvent">
    <div id="label-text">
      <span v-html="label"></span>
    </div>
  </div>
  <div id="label" v-else>
    <div id="label-text">
      <span v-html="label"></span>
    </div>
  </div>
</template>

<script>
  import gsap from 'gsap';

  const runDataActiveRun = nodecg.Replicant(
    'runDataActiveRun',
    'nodecg-speedcontrol'
  );

  export default {
    name: 'TickerLabel',
    props: ['label'],
    data() {
      return {
        activeRun: undefined,
      };
    },
    mounted() {
      runDataActiveRun.on('change', (newVal) => {
        this.$data.activeRun = newVal;
      })
      if (this.$data.activeRun) {
        if (this.$data.activeRun.customData.originalEvent) {
          require(`../../../css/themes/${this.$data.activeRun.customData.originalEvent.toLowerCase()}.css`);
        } else {
          require(`../../../css/themes/default.css`);
        }
      } else {
        require(`../../../css/themes/default.css`);
      }
      const labelAnim = () => {
        gsap.fromTo(
          '#label',
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', duration: 0.5 }
        );
      };
      labelAnim();
    },
  };
</script>

<style scoped>
  #label-text {
    padding: 0 15px;
    font-style: normal;
    font-weight: normal;
    line-height: 20px;
    font-size: 18px;
    text-align: center;
    color: white;
    text-transform: uppercase;
    white-space: pre-line;
    font-weight: bold;
  }
</style>
