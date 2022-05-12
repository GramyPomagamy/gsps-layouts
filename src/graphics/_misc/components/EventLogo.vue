<template>
  <div v-if="currentEvent" id="current-event-logo">
    <transition name="fade" mode="out-in">
      <img class="img" :key="currentEvent" :src="require(`../../img/logos/${currentEvent.toLowerCase()}.png`)" />
    </transition>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import { Getter } from 'vuex-class';

  @Component
  export default class EventLogo extends Vue {
    @Getter readonly currentEvent!: string;
  }
</script>

<style scoped>
  #sponsors-div {
    width: 100%;
    height: 100%;
    object-fit: contain;
    vertical-align: middle;
  }

  .img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>
