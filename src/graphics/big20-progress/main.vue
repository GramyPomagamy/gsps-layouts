<template>
  <div id="container">
    <p v-for="(game, gameIndex) in big20Progress.games" class="game-line">
      {{ game }} <span v-for="(player, playerIndex) in big20Progress.players"><span v-if="player.position == gameIndex" :style="{color: player.color}" class="ball">⬤</span></span>
    </p>

  </div>
</template>

<script lang="ts">
  import { Vue, Component, Ref } from 'vue-property-decorator';
  import type { Big20Progress } from '@gsps-layouts/types';
  import { Getter } from 'vuex-class';

  @Component
  export default class extends Vue {
    @Getter readonly big20Progress!: Big20Progress;

    mounted() {
      nodecg.listenFor('big20PositionChanged', () => {
        // TODO render new list
      });
    }
  }
</script>

<style>
  @import url('../css/styles.css');

  #container {
    font-family: "comic mono";
    font-size: 32px;
    text-align: left;
    width: 100%;
    height: 100%;
    text-shadow: black 2px 2px 8px;
    color: white;
    position: absolute;
    top: 0;
    left: 0;
  }

  .game-line {
    margin: 0px;
    line-height: 35px;
    letter-spacing: 0px;
  }

  .ball {
    margin-left: -12px;
  }
</style>
