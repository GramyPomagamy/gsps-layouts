<template>
  <div>
    <div class="nameplate">
      <transition name="fade">
        <span
          v-if="cycle === 0"
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
          v-if="cycle === 1"
          :style="{
            marginTop: '0px',
            position: 'absolute',
            left: '0',
            width: '100%',
          }"
        >
          <i
            :style="{ 'font-size': '24px', float: 'left', marginTop: '5px', marginLeft: '10px' }"
            class="fab fa-twitch"
          ></i
          ><b>{{ player.social.twitch || '?' }}</b>
        </span>
      </transition>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Player',
    props: ['player', 'cycle'],
  };
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
