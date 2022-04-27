<template>
  <div id="currentTimeDiv" v-if="activeRun" :event="activeRun.customData.originalEvent">
    <span id="currentTime">{{ clock }}</span>
  </div>
    <div id="currentTimeDiv" v-else>
    <span id="currentTime">{{ clock }}</span>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
    import { Getter } from 'vuex-class';
  import type { RunDataActiveRun } from 'nodecg/bundles/nodecg-speedcontrol/src/types/schemas';

  @Component
  export default class OmnibarClock extends Vue {
    @Getter readonly activeRun!: RunDataActiveRun;

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
            if (this.activeRun) {
        if (this.activeRun.customData.originalEvent) {
          require(`../../css/themes/${this.activeRun.customData.originalEvent.toLowerCase()}.css`);
        } else {
          require(`../../css/themes/default.css`);
        }
      } else {
        require(`../../css/themes/default.css`);
      }
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
