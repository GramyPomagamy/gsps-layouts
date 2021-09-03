<template>
  <v-app>
    <v-text-field v-model="reader" label="Obecny czytający" filled></v-text-field>
    <v-btn v-on:click="() => {updateReader()}">Aktualizuj czytającego</v-btn>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import type { Reader } from '@gsps-layouts/types/schemas';
import { Getter } from 'vuex-class';
import { storeModule } from './store';

@Component
export default class extends Vue {
  @Getter readonly readerRep!: Reader;

  reader: any = this.readerRep;

  updateReader(): void {
    storeModule.updateReader(this.reader);
  }
}
</script>

<style>
  body {
    text-align: center;
  }
</style>
