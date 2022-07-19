<template>
  <div>
    <b>{{ cropper.name }}</b>
    <v-btn @click="resetCrop">Reset</v-btn>
    <v-btn @click="crop4By3">4:3</v-btn>
    <br />
    <v-autocomplete
      v-model="windowInfo"
      :items="cropper.windows"
      label="Wybierz okno"
      persistent-hint
      return-object
      single-line
      dense
      :filter="windowFilter"
      :menu-props="{ maxHeight: 120 }"
      @change="crop"
      @mousedown="refreshWindows"
      no-data-text="Ładowanie..."
    >
      <template slot="selection" slot-scope="data">
        {{ data.item.windowTitle }} - {{ data.item.processName }}
      </template>
      <template slot="item" slot-scope="data">
        <v-list-tile-content>
          {{ data.item.windowTitle }} - {{ data.item.processName }}
        </v-list-tile-content>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
  export default {
    name: 'Cropper',
    props: ['cropper'],

    data() {
      return {
        windowInfo: undefined,
      };
    },
    methods: {
      refreshWindows() {
        this.$data.windowInfo = undefined;
        this.$props.cropper.windows = [];
        nodecg.sendMessage('refreshWindows', this.$props.cropper.index);
      },

      crop() {
        const cropperIndex = this.$props.cropper.index;
        const windowInfo = this.$data.windowInfo;

        if (windowInfo) {
          const cropInfo = {
            cropperIndex,
            windowInfo,
          };

          nodecg.sendMessage('crop', cropInfo);
        }
      },

      resetCrop() {
        let cropperIndex = this.$props.cropper.index;

        nodecg.sendMessage('resetCrop', cropperIndex);
      },

      crop4By3() {
        let cropperIndex = this.$props.cropper.index;

        nodecg.sendMessage('crop4By3', cropperIndex);
      },

      windowFilter(item, queryText) {
        const windowTitle = item.windowTitle.toLowerCase();
        const processName = item.processName.toLowerCase();
        const searchText = queryText.toLowerCase();
        return (
          windowTitle.indexOf(searchText) > -1 ||
          processName.indexOf(searchText) > -1
        );
      },
    },
  };
</script>

<style scoped>
  body {
    text-align: center;
  }
</style>
