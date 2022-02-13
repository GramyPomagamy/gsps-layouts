<template>
  <v-app>
    <v-btn @click="makeHighlight">Zrób highlight ręcznie</v-btn>
  </v-app>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';

  @Component
  export default class extends Vue {
    data() {
      return {
        amount: 0,
      };
    }

    makeHighlight(): void {
      nodecg.sendMessage('makeHighlight');
    }
  }
</script>

<style>
  body {
    text-align: center;
  }
</style>
