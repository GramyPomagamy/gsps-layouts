<template>
  <v-app>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Plik</th>
            <th class="text-left">Długość cyklu</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sponsor in sponsors" :key="sponsor.name">
            <td>{{ sponsor.name }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-app>
</template>

<script lang="ts">
  import { Vue, Component, Watch } from 'vue-property-decorator';
  import type { Asset } from '@gsps-layouts/types';
  import { Getter } from 'vuex-class';
  import { storeModule } from './store';

  @Component
  export default class extends Vue {
    @Getter readonly sponsors!: Asset[];
  }
</script>

<style>
  body {
    text-align: center;
  }
</style>
