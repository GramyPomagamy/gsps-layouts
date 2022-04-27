<template>
  <div id="currentTimeDiv" :event="currentEvent">
    <span id="currentTime">{{ clock }}</span>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
    import { Getter } from 'vuex-class';

  @Component
  export default class OmnibarClock extends Vue {
    @Getter readonly currentEvent!: string;

    data() {
      return {
        clock: ""
      }
    }

    getClock(): void {
      var date_ob = new Date();
      // current hours
      let hours = ('0' + date_ob.getHours()).slice(-2);

      // current minutes
      let minutes = ('0' + date_ob.getMinutes()).slice(-2);

      this.$data.clock = hours + ':' + minutes;
    }

    mounted() {
      this.getClock();
      setInterval(() => {
        this.getClock();
      }, 5000)
    }
  }
</script>

<style scoped>


  #currentTime {
    display: block;
    font-weight: 600;
    margin-left: 14px;
    margin-right: 14px;
  }
</style>
