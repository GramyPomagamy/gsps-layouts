<template>
  <div id="song">
    <p
      :style="{
        textAlign: 'right',
      }"
    >
      <b>OBECNA PIOSENKA</b>
    </p>

    <transition name="fade" mode="out-in">
      <div class="marquee" id="song-name" :key="currentSong">
        <p>{{ currentSong }}</p>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import { Getter } from 'vuex-class';
  import { Song } from '@gsps-layouts/types/schemas';

  @Component
  export default class BreakSong extends Vue {
    @Getter readonly currentSong!: Song;
  }
</script>

<style scoped>
  @import url('../../css/styles.css');

  #song {
    font-size: 26.4px;
    color: white;
    margin-left: 12px;
  }

  #song-name {
    margin-top: -30px;
    margin-bottom: 12px;
    text-shadow: black 2px 2px 8px;
    height: 44px;
  }
</style>
