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
        'background-color': 'black',
        width: '140px',
        'font-size': '18px',
      }"
    >
      <b>
        <template v-if="commentators.amount === 1">Komentator</template>
        <template v-else>Komentatorzy</template>
      </b>
    </div>
    <div
      id="commentatorNames"
      :style="{
        'background-color': 'rgb(0,0,0,0.6)',
        width: 'calc(100% - 140px)',
      }"
    >
      {{ commentators.names }}
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Watch } from 'vue-property-decorator';
  import { Getter } from 'vuex-class';
  import type { Commentators } from '@gsps-layouts/types/schemas';
  import fitty, { FittyInstance } from 'fitty';

  @Component
  export default class CommentatorList extends Vue {
    @Getter readonly commentators!: Commentators;

    fittyInstance: FittyInstance[] | undefined;

    mounted() {
      this.fittyInstance = fitty('#commentatorNames', {
        minSize: 1,
        maxSize: 20,
      });
    }

    @Watch('commentators')
    onCommentatorsChange() {
      this.fittyInstance = fitty('#commentatorNames', {
        minSize: 1,
        maxSize: 20,
      });
    }
  }
</script>
