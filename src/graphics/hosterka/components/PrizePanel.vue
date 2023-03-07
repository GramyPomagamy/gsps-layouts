<template>
  <transition name="fade" mode="out-in" appear>
    <div id="container">
      <div id="title" style="width: 100%; background-color: #3a008b">
        <h2>Dostępne nagrody</h2>
      </div>
      <transition name="fade" mode="out-in" appear>
        <div id="prize" :key="prize.id">
          <h2>{{ prize.name }}</h2>
          <div id="details">
            <p v-if="prize.provided">
              Nagroda dostarczona przez: {{ prize.provided }}
            </p>
            <p v-if="prize.minimumBid">
              Minimalna kwota do wpłacenia: {{ prize.minimumBid }}zł
            </p>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { Prize } from '@gsps-layouts/types';

  @Component
  export default class PrizePanel extends Vue {
    @Prop() prize!: Prize;
  }
</script>

<style scoped>
  #container {
    background-color: rgba(0, 0, 0, 0.9);
    max-width: 100%;
    min-width: 20%;
    display: flex;
    flex-direction: column;
    text-align: center;
    color: white;
    line-height: 4px;
    max-height: 230px;
    border: 3px solid #3a008b;
    transition: width 0.5s;
    white-space: nowrap;
    overflow: hidden;
    height: 300px;
  }

  #prize {
    margin-top: 18px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 8px;
    text-shadow: 2px 2px 2px black;
  }

  #details {
    font-size: 20px;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>
