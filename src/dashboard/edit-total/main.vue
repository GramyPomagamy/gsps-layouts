<template>
  <v-app>
    <v-text-field v-model="amount" label="Kwota" filled></v-text-field>
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

    updateTotal(amount: number): void {
      nodecg.sendMessage('setTotal', { type: 'cash', newValue: amount });
    }

    mounted() {
      document.addEventListener('dialog-confirmed', () => {
        this.updateTotal(this.$data.amount);
      });
    }
  }
</script>

<style>
  body {
    text-align: center;
  }
</style>
