<template>
  <div id="label">
    <div id="label-text">
      <span v-html="label"></span>
    </div>
  </div>
</template>

<script>
  import gsap from 'gsap';

  export default {
    name: 'TickerLabel',
    props: ['label'],
    mounted() {
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
