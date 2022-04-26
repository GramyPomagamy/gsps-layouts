<template>
  <div>
    <div class="nameplate">
      <transition name="fade">
        <span
          v-if="nameCycle === 0"
          :style="{
            position: 'absolute',
            left: '0',
            width: '100%',
          }"
        >
          <b>{{ player.name || '?' }}</b>
        </span>
      </transition>
      <transition name="fade">
        <span
          v-if="nameCycle === 1"
          :style="{
            marginTop: '0px',
            position: 'absolute',
            left: '0',
            width: '100%',
          }"
        >
          <i
            :style="{
              'font-size': '24px',
              float: 'left',
              marginTop: '5px',
              marginLeft: '10px',
            }"
            class="fab fa-twitch"
          ></i
          ><b>{{ player.social.twitch || '?' }}</b>
        </span>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { Getter } from 'vuex-class';
  import type { PlayerType } from '@gsps-layouts/types';
  import type { NameCycle } from '@gsps-layouts/types/schemas';

  @Component
  export default class Player extends Vue {
    @Getter readonly nameCycle!: NameCycle;
    @Prop() player!: PlayerType;
  }
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  .nameplate {
    background-color: #3a008b;
    color: white;
    height: 36px;
    font-size: 24px;
    width: 100%;
    display: flex;
    flex-direction: row;
  }
</style>
