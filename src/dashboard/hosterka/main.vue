<template>
  <v-app>
    <v-row no-gutters>
      <v-text-field
        v-model="host1Name"
        id="host1Field"
        label="Nick 1"
        class="mr-5"
        filled
      ></v-text-field>
      <v-text-field
        v-model="host2Name"
        id="host2Field"
        label="Nick 2"
        class="ml-5"
        filled
      ></v-text-field>
    </v-row>

    <v-btn
      v-on:click="
        () => {
          updateHost();
        }
      "
      >Aktualizuj nicki na hosterce</v-btn
    >
    <br />
    <v-row no-gutters>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            :disabled="currentlyShowing"
            @click="showNames"
            >Pokaż nicki na streamie</v-btn
          >
        </template>
        <span>Pokazuje nicki na streamie przez 10 sekund</span>
      </v-tooltip>
      <v-btn class="ml-6" :disabled="!currentlyShowing" @click="hideNames"
        >Schowaj nicki na streamie</v-btn
      >
    </v-row>
  </v-app>
</template>

<script lang="ts">
  import { Vue, Component, Watch } from 'vue-property-decorator';
  import { Hosterka } from '@gsps-layouts/types/schemas';
  import { Getter } from 'vuex-class';
  import { storeModule } from './store';

  @Component
  export default class extends Vue {
    @Getter readonly hosterka!: Hosterka;

    host1Name: string = '';
    host2Name: string = '';
    currentlyShowing: boolean = false;
    nameTimeout!: NodeJS.Timeout;

    mounted() {
      if (this.hosterka.host1) {
        this.host1Name = this.hosterka.host1;
      }
      if (this.hosterka.host2) {
        this.host2Name = this.hosterka.host2;
      }
    }

    updateHost(): void {
      storeModule.updateHost({
        host1: this.host1Name,
        host2: this.host2Name,
      });
    }

    showNames(): void {
      nodecg.sendMessage('showNames');
      this.currentlyShowing = true;
      this.nameTimeout = setTimeout(this.hideNames, 10 * 1000);
    }

    hideNames(): void {
      clearTimeout(this.nameTimeout);
      nodecg.sendMessage('hideNames');
      this.currentlyShowing = false;
    }

    @Watch('reader')
    onReaderChange(newVal: Hosterka) {
      if (newVal.host1) {
        this.host1Name = newVal.host1;
      }
      if (newVal.host2) {
        this.host2Name = newVal.host2;
      }
    }
  }
</script>

<style>
  body {
    text-align: center;
  }
</style>
