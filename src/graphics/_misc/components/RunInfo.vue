<template>
  <div>
    <div
      id="GameName"
      :style="{ color: 'white', 'text-shadow': 'black 2px 2px 8px' }"
    >
      <b>{{ run.game }}</b>
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
      {{ run.category || '?' }} / {{ run.system || '?' }} / EST:
      {{ run.estimate || '?' }}
    </div>
  </div>
</template>

<script>
  import fitty from 'fitty';

  export default {
    name: 'RunInfo',
    props: ['run', 'maxTitleSize', 'wrap'],
    data() {
      return {
        $_fittyGame: undefined,
        $_fittyInfo: undefined,
      };
    },
    watch: {
      run: {
        handler: function () {
          fitty.fitAll();
        },
        immediate: true,
        deep: true,
      },
    },
    methods: {
      fitText() {
        this.$data.$_fittyGame = fitty('#GameName', {
          minSize: 1,
          maxSize: this.maxTitleSize,
          multiLine: this.wrap || false,
        });
        this.$data.$_fittyInfo = fitty('#GameInfo', {
          minSize: 1,
          maxSize: 24,
        });
      },
    },
    mounted() {
      setTimeout(() => {
        this.fitText();
      }, 200);
    },
  };
</script>
