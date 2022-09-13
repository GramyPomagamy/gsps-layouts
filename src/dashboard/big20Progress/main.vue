<template>
  <v-app>
    <Player
      v-for="(player, playerIndex) in players"
      :playerName="player"
      :playerIndex="playerIndex"
    />
  </v-app>
</template>

<script lang="ts">
  import { Vue, Component, Watch } from 'vue-property-decorator';
  import type { Big20Progress } from '@gsps-layouts/types';
  import { Getter } from 'vuex-class';
  import Player from './components/Player.vue';
  @Component({
    components: {
      Player,
    },
  })
  export default class extends Vue {
    @Getter readonly big20Progress!: Big20Progress;

    data() {
      return {
        players: [],
      };
    }

    mounted() {
      this.$data.players = [];

      this.big20Progress.players.forEach(player => {
        this.$data.players.push(player.name);
      });
    }
  }
</script>

<style>
  body {
    text-align: center;
  }
</style>
