<template>
  <div v-if="currentSponsor && currentSponsor.name" id="sponsors-div">
    <transition name="fade" mode="out-in">
      <img class="img" :key="currentSponsor.name" :src="currentSponsor.url" />
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'Sponsors',
    props: ['sponsors'],
    data() {
      return {
        currentSponsor: undefined,
      };
    },
    mounted() {
      if (this.sponsors.length > 0) {
        this.$data.currentSponsor = this.sponsors[0];
      }

      setInterval(this.nextSponsor, 5000);
    },
    methods: {
      nextSponsor() {
        if (!this.sponsors || this.sponsors.length <= 0) {
          return;
        }

        let currentIdx = this.sponsors.indexOf(this.$data.currentSponsor);
        let nextIdx = currentIdx + 1;
        if (nextIdx >= this.sponsors.length) {
          nextIdx = 0;
        }
        this.$data.currentSponsor = this.sponsors[nextIdx];
      },
    },
  };
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
