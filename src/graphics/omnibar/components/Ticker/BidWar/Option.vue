<template>
  <div
    :style="{
      display: 'flex',
      flexDirection: 'row',
      height: '100%',
      margin: '0px 10px',
    }"
  >
    <p class="option-name label">{{ option.name }}</p>
    <p class="option-total label" :class="totalClass">
      {{ option.rawTotal }} PLN
    </p>
  </div>
</template>

<script>
  export default {
    name: 'BidWarOption',
    props: ['option', 'winning'],
    computed: {
      totalClass: function () {
        return {
          'option-total-winning': this.winning,
          'option-total-notwinning': !this.winning,
        };
      },
    },
  };
</script>

<style scoped>
  .label {
    height: 66px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0px 8px;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    min-width: 50px;
    text-align: center;
  }

  .option-name {
    background-color: rgb(0, 0, 0, 0.3);
    font-size: 18px;
  }

  .option-total-winning {
    background-color: white;
    color: black;
  }

  .option-total-notwinning {
    background-color: #3a008b;
  }

  .option-total {
    font-weight: 700;
    font-size: 22px;
  }
</style>
