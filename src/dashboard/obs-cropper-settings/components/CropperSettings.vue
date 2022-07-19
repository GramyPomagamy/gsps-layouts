<template>
  <div>
    <v-divider style="margin-bottom: 10px; margin-top: 10px" />
    <v-text-field
      v-model="cropper.cropper.name"
      id="cropperName"
      label="Nazwa"
      filled
    ></v-text-field>
    <v-text-field
      v-model="cropper.cropper.sceneName"
      id="cropperSceneName"
      label="Scena"
      filled
    ></v-text-field>
    <v-text-field
      v-model="cropper.cropper.sourceName"
      id="cropperSourceName"
      label="Źródło"
      filled
    ></v-text-field>
    <v-text-field
      v-model="cropper.cropper.url"
      id="cropperUrl"
      label="URL"
      filled
    ></v-text-field>
    <div>
      <v-btn @click="save">Zapisz</v-btn>
      <v-btn @click="remove">Usuń</v-btn>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CropperSettings',
    props: ['cropper'],
    methods: {
      save() {
        nodecg.sendMessage('modifyCropper', {
          cropperIndex: this.$props.cropper.index,
          newCropper: this.$props.cropper.cropper,
        });
      },
      remove() {
        nodecg.sendMessage('removeCropper', this.$props.cropper.index);
      },
    },
  };
</script>

<style scoped>
  body {
    text-align: center;
  }
</style>
