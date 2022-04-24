<template>
  <div
    :style="{
      display: 'flex',
      'flex-direction': 'row',
      color: 'white',
      'font-size': '20px',
      width: '100%',
    }"
  >
    <div
      :style="{
        'background-color': '#3A008B',
        width: '140px',
        'font-size': '18px',
      }"
    >
      <b>Czytający</b>
    </div>
    <div
      :style="{
        'background-color': 'rgb(0,0,0,0.6)',
        width: 'calc(100% - 140px)',
      }"
    >
      {{ reader }}
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import { Getter } from 'vuex-class';
  import type { Reader } from '@gsps-layouts/types/schemas';

  @Component
  export default class ReaderName extends Vue {
    @Getter readonly reader!: Reader;
  }
</script>
