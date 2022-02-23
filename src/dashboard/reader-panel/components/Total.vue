<template>
  <div
    class="grey darken-4 rounded-lg"
    :style="{ textAlign: 'center' }"
  >
    <b :style="{ fontSize: '48px' }">{{ total.formatted }}</b>
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
