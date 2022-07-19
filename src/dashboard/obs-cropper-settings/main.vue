<template>
  <v-app>
    <v-btn class="margin-bottom: 10px" @click="addCropper">Dodaj</v-btn>
    <CropperSettings
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
  import CropperSettings from './components/CropperSettings.vue';
  @Component({
    components: {
      CropperSettings,
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
    }

    initializeCroppers() {
      this.$data.croppers = [];

      this.obsData.croppers.forEach((cropper, cropperIndex) => {
        this.$data.croppers.push({
          index: cropperIndex,
          cropper: cropper,
        });
      });
    }

    @Watch('obsData')
    onObsDataChange(newVal: ObsData) {
      this.initializeCroppers();
    }

    addCropper() {
      nodecg.sendMessage('addCropper');
    }
  }
</script>

<style>
  body {
    text-align: center;
  }
</style>
