<template>
  <div
    id="GenericMessage"
    class="Flex"
    :style="cssProps"
    v-html="normalisedData.msg"
  ></div>
</template>

<script>
  export default {
    name: 'TickerGenericMessage',
    props: {
      data: {
        type: Object,
        default() {
          return {
            msg: '',
            size: 28,
            time: 30,
          };
        },
      },
    },
    computed: {
      cssProps() {
        return {
          '--font-size': `${this.normalisedData.size}px`,
        };
      },
      normalisedData() {
        return {
          size: 30,
          time: 30,
          ...this.data,
        };
      },
    },
    mounted() {
      console.log('GenericMessage: mounted');
      setTimeout(() => {
        this.$emit('end');
        console.log('GenericMessage: ended');
      }, this.normalisedData.time * 1000);
    },
  };
</script>

<style scoped>
  #GenericMessage {
    height: 100%;
    font-size: var(--font-size);
    color: white;
    text-align: center;
    margin-bottom: -5px;
    text-shadow: 2px 2px 8px black;
  }
</style>
