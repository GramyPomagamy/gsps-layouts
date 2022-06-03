<template>
  <v-app>
    <v-btn @click="switchToDemoty">Zmień na śmieszne (czyli demoty)</v-btn>
  </v-app>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';

  @Component
  export default class extends Vue {

    switchToDemoty(): void {
      nodecg.sendMessage('switchToDemoty');
    }
  }
</script>

<style>
  body {
    text-align: center;
  }
</style>
