<template>
  <div style="border: 1px solid white" class="rounded pa-2 ma-1 grey darken-3">
    <v-row no-gutters>
      <v-col cols="12">
        <h2>{{ bid.game }} - {{ bid.name }}</h2>
        <h5><i>Ten run odbędzie się planowo za ok. 2 godziny</i></h5>
      </v-col>
      <div>
        <template v-for="(option, index) in bid.options">
          <h3>{{ index + 1 }}. {{ option.name }} - {{ option.total }}</h3>
        </template>
      </div>
    </v-row>
  </div>
</template>

<script>
  export default {
    name: 'ReaderPanelBidWar',
    props: ['bid'],
  };
</script>
