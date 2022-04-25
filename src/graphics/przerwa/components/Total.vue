<template>
  <div id="total">
    <div id="totalAmount" ref="totalAmount"></div>
    <div id="totalCurrency">PLN</div>
  </div>
</template>

<script lang="ts">
  import type { Total } from '../../../types/schemas';
  import gsap from 'gsap';
  import { Component, Vue, Ref } from 'vue-property-decorator';

  const totalRep = nodecg.Replicant<Total>('total');

  @Component
  export default class BreakTotal extends Vue {
    @Ref('totalAmount') totalEl!: HTMLSpanElement;
    data() {
      return {
        total: { raw: 0 },
      };
    }

    mounted() {
      const updateHandler = () => {
        this.totalEl!.innerHTML =
          this.$data.total.raw.toLocaleString('en-US', {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          });
      };
      totalRep.on('change', (newVal) => {
        gsap.to(this.$data.total, {
          duration: 3,
          raw: newVal.raw,
          roundProps: 'raw',
          onUpdate: updateHandler,
          ease: 'power4',
        });
      });
    }
  }
</script>

<style scoped>
  #total {
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
  }

  #totalAmount {
    font-weight: bold;
  }

  #totalCurrency {
    font-size: 64px;
  }
</style>
