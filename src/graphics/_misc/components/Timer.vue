<template>
  <b
    id="timer"
    ref="timer"
    :style="{ color: '#a5a3a3', 'text-shadow': 'black 2px 2px 8px' }"
    >{{ timer.time }}</b
  >
</template>

<script lang="ts">
  import { Vue, Component, Watch, Ref } from 'vue-property-decorator';
  import { Getter } from 'vuex-class';
  import type { Timer } from 'nodecg/bundles/nodecg-speedcontrol/src/types/schemas';
  import gsap from 'gsap';
  const timerColors = {
    running: 'white',
    finished: '#ffbd16',
    stopped: '#a5a3a3',
    paused: '#a5a3a3',
  };

  @Component
  export default class TimerView extends Vue {
    @Getter readonly timer!: Timer;
    @Ref('timer') timerEl!: HTMLElement;

    @Watch('timer')
    onTimerChange(newVal: Timer): void {
      gsap.to(this.timerEl, {
        duration: 1,
        color: timerColors[newVal.state],
      });
    }

    mounted() {
      gsap.to(this.timerEl, {
        duration: 0.1,
        color: timerColors[this.timer.state],
      });
    }
  }
</script>
