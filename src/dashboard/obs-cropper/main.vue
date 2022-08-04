<template>
  <v-app>
    <Cropper
      v-for="cropper in croppers"
      :key="cropper.cropperIndex"
      :cropper="cropper"
    />
  </v-app>
</template>

<script lang="ts">
  import { Vue, Component, Watch } from 'vue-property-decorator';
  import type { ObsData, WindowInfo } from '@gsps-layouts/types/schemas';
  import { Getter } from 'vuex-class';
  import Cropper from './components/Cropper.vue';
  @Component({
    components: {
      Cropper,
    },
  })
  export default class extends Vue {
    @Getter readonly obsData!: ObsData;

    data() {
      return {
        croppers: [],
      };
    }

    mounted() {
      this.initializeCroppers();

      nodecg.listenFor(
        'windowsRefreshed',
        (windowsInfo: { cropperIndex: number; windows: WindowInfo[] }) => {
          const cropperIndex = windowsInfo.cropperIndex;
          const windows = windowsInfo.windows;

          this.$data.croppers[cropperIndex].windows = windows;
        }
      );
    }

    initializeCroppers() {
      this.$data.croppers = [];

      this.obsData.croppers.forEach((cropper, cropperIndex) => {
        this.$data.croppers.push({
          index: cropperIndex,
          windows: [],
          name: cropper.name,
        });
      });
    }

    @Watch('obsData')
    onObsDataChange(newVal: ObsData) {
      this.initializeCroppers();
    }
  }
</script>

<style>
  body {
    text-align: center;
  }
</style>
