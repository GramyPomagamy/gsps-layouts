<template>
  <div id="label" :event="currentEvent">
    <div id="label-text">
      <span v-html="label"></span>
    </div>
  </div>
</template>

<script>
  import gsap from 'gsap';

  const currentEvent = nodecg.Replicant('currentEvent');

  export default {
    name: 'TickerLabel',
    props: ['label'],
    data() {
      return {
        currentEvent: '',
      };
    },
    mounted() {
      currentEvent.on('change', (newVal) => {
        this.$data.currentEvent = newVal;
      });

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
  @import url('../../../css/themes.css');

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
