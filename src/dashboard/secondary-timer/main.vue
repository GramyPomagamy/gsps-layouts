<template>
  <v-app>
    <v-container flud class="text-center">
      <v-switch
        v-model="timerEnabled"
        @change="
          () => {
            updateTimerEnabledState();
          }
        "
        label="Włącz dodatkowy timer"
      />
    </v-container>
    <v-container fluid class="text-center">
      <h1 style="font-size: 48px">{{ timer.time }}</h1>
    </v-container>
    <v-container
      fluid
      class="d-flex text-center"
      style="justify-content: space-between"
    >
      <v-btn width="45%" @click="startTimer" :disabled="phase === 'finished'">{{
        phase === 'running' ? 'Zakończ Timer' : 'Wystartuj Timer'
      }}</v-btn>
      <v-btn width="45%" @click="resetTimer" :disabled="phase === 'stopped'"
        >Zresetuj Timer</v-btn
      >
    </v-container>
  </v-app>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import type { SecondaryTimer } from '@gsps-layouts/types/schemas';
  import { Getter } from 'vuex-class';
  import { storeModule } from './store';

  @Component
  export default class extends Vue {
    @Getter readonly timer!: SecondaryTimer; // from store.ts

    timerEnabled = this.timer.enabled;

    get phase() {
      return this.timer.phase;
    }

    async startTimer(): Promise<void> {
      try {
        if (this.phase === 'stopped' || this.phase === 'paused') {
          await nodecg.sendMessage('secondaryTimerStart');
        } else if (this.phase === 'running') {
          await nodecg.sendMessage('secondaryTimerFinish');
        }
      } catch (err) {
        // catch
      }
    }

    async resetTimer(): Promise<void> {
      try {
        await nodecg.sendMessage('secondaryTimerReset', true);
      } catch (err) {
        // error
      }
    }
    updateTimerEnabledState() {
      storeModule.updateTimerEnabledState(this.timerEnabled);
    }

    mounted() {
      this.$data.timerEnabled = this.timer.enabled;
    }
  }
</script>
