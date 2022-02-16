<template>
  <div :style="{ height: '200px', textAlign: 'center' }">
    <v-card>
      <v-card-title>
        <b :style="{ fontSize: '48px' }">{{ total.formatted }}</b>
      </v-card-title>
    </v-card>
  </div>
</template>

<script>
  export default {
    name: 'ReaderPanelTotal',
    props: ['total'],
  };
</script>

<style scoped>
  body {
    text-align: center;
  }
</style>
