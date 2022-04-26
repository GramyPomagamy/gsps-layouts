<template>
  <v-app>
    <v-text-field
      v-model="countdownText"
      :disabled="hostCountdownRunningReplicant"
      label="Czas odliczania hostów"
      filled
    ></v-text-field>
    <v-row no-gutters>
      <v-col>
        <v-btn
          @click="startHostCountdown()"
          :disabled="hostCountdownRunningReplicant || countdownText.length == 0"
        >
          <v-icon left>mdi-play</v-icon>Rozpocznij</v-btn
        >
      </v-col>
      <v-col>
        <v-btn
          @click="stopHostCountdown()"
          :disabled="!hostCountdownRunningReplicant"
        >
          <v-icon left>mdi-stop</v-icon>Zatrzymaj</v-btn
        >
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
        countdownText: '3:00',
        enteredTime: '3:00',
      };
    }
    @Getter readonly hostCountdownReplicant!: Countdown;
    @Getter readonly hostCountdownRunningReplicant!: CountdownRunning;

    startHostCountdown(): void {
      this.$data.enteredTime = this.$data.countdownText;
      nodecg.sendMessage('startHostCountdown', this.$data.countdownText);
    }

    stopHostCountdown(): void {
      nodecg.sendMessage('stopHostCountdown');
      this.$data.countdownText = this.$data.enteredTime;
    }

    mounted() {
      this.$data.countdownText = this.hostCountdownReplicant.formatted;
    }

    @Watch('hostCountdownReplicant')
    onHostCountdownChanged(value: Countdown) {
      this.$data.countdownText = value.formatted;
    }
  }
</script>

<style>
  body {
    text-align: center;
  }
</style>
