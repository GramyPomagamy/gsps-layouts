<template>
  <v-app>
    <v-text-field v-model="countdownText" :disabled="countdownRunningReplicant" label="Czas odliczania" filled></v-text-field>
    <v-row no-gutters>
      <v-col>
        <v-btn @click="startCountdown()" :disabled="countdownRunningReplicant || countdownText.length == 0">
          <v-icon left>mdi-play</v-icon>Rozpocznij</v-btn>
      </v-col>
      <v-col>
        <v-btn @click="stopCountdown()" :disabled="!countdownRunningReplicant">
          <v-icon left>mdi-stop</v-icon>Zatrzymaj</v-btn>
      </v-col>
    </v-row>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import type { Countdown } from '@gsps-layouts/types/schemas/countdown';
import type { CountdownRunning } from '@gsps-layouts/types/schemas/countdownRunning';
import { Getter } from 'vuex-class';

@Component
export default class extends Vue {
  data() {
    return {
      countdownText: "",
    }
  }
  @Getter readonly countdownReplicant!: Countdown;
  @Getter readonly countdownRunningReplicant!: CountdownRunning;

  startCountdown(): void {
    nodecg.sendMessage('startCountdown', this.$data.countdownText);
  }

  stopCountdown(): void {
    nodecg.sendMessage('stopCountdown');
  }

  mounted() {
    this.$data.countdownText = this.countdownReplicant.formatted;
  }

  @Watch('countdownReplicant')
  onCountdownChanged(value: Countdown) {
    this.$data.countdownText = value.formatted;
  }
}
</script>

<style>
  body {
    text-align: center;
  }
</style>
