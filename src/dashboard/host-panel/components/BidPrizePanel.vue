<template>
  <div
    id="bid-prize-panel"
    style="height: 100px; width: 500px"
    class="grey darken-4 rounded-lg"
  >
    <h3
      style="width: 100%; text-align: center; position: sticky"
      class="grey darken-3 pa-1 rounded-tl-lg rounded-tr-lg"
    >
      OBECNIE POKAZYWANA NAGRODA/LICYTACJA
    </h3>
    <div id="data" class="mx-3 d-flex align-center justify-center">
      <b :style="{ fontSize: '20px' }">
        <template v-if="item.total">
          {{ item.game }} - {{ item.description }}
        </template>
        <template v-else>
          {{ item.name }}
        </template>
      </b>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';

  @Component
  export default class ReaderBidPrizePanel extends Vue {
    @Prop() item!: any;
  }
</script>
