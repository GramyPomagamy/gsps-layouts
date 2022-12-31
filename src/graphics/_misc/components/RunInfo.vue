<template>
  <div>
    <div
      id="GameName"
      :style="{ color: 'white', 'text-shadow': 'black 2px 2px 8px' }"
    >
      <b>{{ activeRun.game }}</b>
    </div>
    <br />
    <div
      id="GameInfo"
      :style="{
        color: 'white',
        'text-shadow': 'black 2px 2px 8px',
        'font-size': '16px',
      }"
    >
      {{ activeRun.category || '?' }} / {{ activeRun.system || '?' }} / EST:
      {{ activeRun.estimate || '?' }}
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
  import { Getter } from 'vuex-class';
  import fitty, { FittyInstance } from 'fitty';
  import type { RunDataActiveRun } from 'speedcontrol/src/types/schemas';

  @Component
  export default class RunInfo extends Vue {
    @Getter readonly activeRun!: RunDataActiveRun;
    @Prop(Number) maxTitleSize!: number;
    @Prop({ default: false }) wrap!: boolean;

    $_fittyGame: FittyInstance[] | undefined;
    $_fittyInfo: FittyInstance[] | undefined;

    fitText() {
      this.$_fittyGame = fitty('#GameName', {
        minSize: 1,
        maxSize: this.maxTitleSize,
        multiLine: this.wrap,
      });
      this.$_fittyInfo = fitty('#GameInfo', {
        minSize: 1,
        maxSize: 24,
      });
    }

    mounted() {
      setTimeout(() => {
        this.fitText();
      }, 200);
    }

    @Watch('activeRun')
    onRunChange() {
      setTimeout(() => {
        this.fitText();
      }, 200);
    }
  }
</script>
