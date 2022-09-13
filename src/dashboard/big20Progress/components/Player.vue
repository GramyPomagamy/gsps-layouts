<template>
  <div>
    <b>{{ playerName }}</b>
    <v-btn @click="decrease">-</v-btn>
    <v-btn @click="increase">+</v-btn>
  </div>
</template>

<script>
  export default {
    name: 'Player',
    props: ['playerName', 'playerIndex'],

    data() {
      return {};
    },
    methods: {
      increase() {
        nodecg.sendMessage('increaseProgress', this.$props.playerIndex);
      },

      decrease() {
        nodecg.sendMessage('decreaseProgress', this.$props.playerIndex);
      },
    },
  };
</script>

<style scoped>
  body {
    text-align: center;
  }
</style>
