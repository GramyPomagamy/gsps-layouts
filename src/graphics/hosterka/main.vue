<template>
  <transition name="fade" mode="out-in">
    <div :style="{ width: '100%' }" v-if="hosterka && showNames">
      <host
        id="nickname1"
        v-if="hosterka.host1.length > 0"
        :host="hosterka.host1"
        :key="hosterka.host1"
      />

      <host
        id="nickname2"
        v-if="hosterka.host2.length > 0"
        :host="hosterka.host2"
        :key="hosterka.host2"
      />
    </div>
  </transition>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import type { Hosterka } from '@gsps-layouts/types/schemas';
  import { Getter } from 'vuex-class';
  import Host from './components/Host.vue';

  @Component({
    components: {
      Host,
    },
  })
  export default class extends Vue {
    @Getter readonly hosterka!: Hosterka;

    showNames: boolean = false;

    mounted(): void {
      nodecg.listenFor('showNames', () => {
        this.showNames = true;
      });

      nodecg.listenFor('hideNames', () => {
        this.showNames = false;
      });
    }
  }
</script>

<style>
  @import url('../css/styles.css');

  #nickname1 {
    left: 240px;
    position: absolute;
    bottom: 150px;
  }

  #nickname2 {
    right: 240px;
    position: absolute;
    bottom: 150px;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
