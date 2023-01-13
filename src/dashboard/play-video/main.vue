<template>
  <v-app>
    <v-row no-gutters>
      <v-btn
        :disabled="obsData.scene != sceneName"
        @click="playShortIntermissionVideo"
        class="mx-auto"
        ><v-icon left>mdi-play</v-icon>Krótki film na przerwie</v-btn
      >
      <v-btn
        :disabled="obsData.scene != sceneName"
        @click="playLongIntermissionVideo"
        class="mx-auto"
        ><v-icon left>mdi-play</v-icon>Długi (ok. 5min) film na przerwie</v-btn
      >
    </v-row>
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

    sceneName: string = this.config.scenes!.intermission;

    playShortIntermissionVideo() {
      nodecg.sendMessage('playIntermissionVideo', false);
    }

    playLongIntermissionVideo() {
      nodecg.sendMessage('playIntermissionVideo', true);
    }
  }
</script>

<style>
  body {
    text-align: center;
  }
</style>
