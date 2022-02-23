<template>
  <v-app>
    <v-btn :disabled="obsData.scene != sceneName" @click="playIntermissionVideo"
      ><v-icon left>mdi-play</v-icon>Odtwórz film na przerwie</v-btn
    >
  </v-app>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import type { ObsData, Configschema } from '@gsps-layouts/types/schemas';
  import { Getter } from 'vuex-class';

  @Component
  export default class extends Vue {
    @Getter readonly obsData!: ObsData;

    config = (nodecg.bundleConfig as Configschema).obs;

    sceneName: string = this.config.scenes.intermission;

    playIntermissionVideo() {
      nodecg.sendMessage('playIntermissionVideo');
    }
  }
</script>

<style>
  body {
    text-align: center;
  }
</style>
