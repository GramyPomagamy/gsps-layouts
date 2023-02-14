<template>
  <div class="grey darken-4 rounded-lg px-4 py-2" :style="{ fontSize: '24px' }">
    Obecny czytający:
    <template v-if="reader">
      <b>{{ reader }}</b></template
    >
    <div class="mt-5" :style="{ display: 'flex', flexDirection: 'row' }">
      <v-text-field v-model="readerField" dense outlined />
      <v-btn class="ml-3" @click="updateReader">Aktualizuj czytającego</v-btn>
    </div>
    <v-btn block @click="sendAlert" :style="alertButtonStyles"
      ><template v-if="!readerAlert"
        >Daj runnerowi znać, że chcesz coś powiedzieć</template
      ><template v-else>Usuń powiadomienie</template></v-btn
    >
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import { Getter } from 'vuex-class';
  import type { Reader } from '@gsps-layouts/types/schemas';

  @Component
  export default class ReaderPanelReader extends Vue {
    @Getter readonly reader!: Reader;
    @Getter readonly readerAlert!: boolean;

    readerField = '';

    updateReader() {
      this.$emit('update', this.readerField);
      this.readerField = '';
    }

    sendAlert() {
      nodecg.sendMessage('toggleAlert');
    }

    get alertButtonStyles() {
      if (this.readerAlert) {
        return { 'background-color': '#FFC300' };
      }
    }
  }
</script>
