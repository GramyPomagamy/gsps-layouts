<template>
  <v-app>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Plik</th>
            <th class="text-left">Długość cyklu (w sekundach)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sponsor in sponsors" :key="sponsor.name">
            <td>
              <a :href="sponsor.url">{{ sponsor.name }}</a>
            </td>
            <td>
              <br />
              {{ getCycle(sponsor.name) }}
              <br />
              <v-btn
                :disabled="currentlySelectedSponsor === sponsor.name"
                @click="setSelectedSponsor(sponsor.name)"
                >ZMIEŃ</v-btn
              >
              <br />
              <div v-if="currentlySelectedSponsor === sponsor.name">
                <br />
                <v-text-field filled dense v-model="cycleField" />
                <v-row justify="center">
                  <v-btn @click="updateCycle()">AKTUALIZUJ</v-btn>
                  <v-btn @click="cancelEdit()">ANULUJ</v-btn>
                </v-row>
              </div>
              <br />
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-app>
</template>

<script lang="ts">
  import { Vue, Component, Watch, Ref } from 'vue-property-decorator';
  import type { Asset, LogoCycle } from '@gsps-layouts/types';
  import { Getter } from 'vuex-class';
  import { storeModule } from './store';
  import clone from 'clone';

  @Component
  export default class extends Vue {
    @Getter readonly sponsors!: Asset[];
    @Getter readonly logoCycles!: LogoCycle[];
    data() {
      return {
        cycleField: '',
      };
    }

    currentlySelectedSponsor: string = '';

    setSelectedSponsor(sponsor: string): void {
      this.currentlySelectedSponsor = sponsor;
      this.$data.cycleField = '';
    }

    cancelEdit(): void {
      this.currentlySelectedSponsor = '';
      this.$data.cycleField = '';
    }

    updateCycle(): void {
      let currentCycles = clone(this.logoCycles);
      const sponsor = this.currentlySelectedSponsor;
      if (this.ifSponsorCycleExists(sponsor)) {
        let index: number = 0;

        for (let i = 0; i < currentCycles.length; i++) {
          if (currentCycles[i].name === sponsor) {
            index = i;
            break;
          }
        }

        currentCycles[index] = {
          name: sponsor,
          cycle: parseInt(this.$data.cycleField),
        };
      } else {
        if (currentCycles) {
          currentCycles.push({
            name: sponsor,
            cycle: parseInt(this.$data.cycleField),
          });
        } else {
          currentCycles = [
            {
              name: sponsor,
              cycle: parseInt(this.$data.cycleField),
            },
          ];
        }
      }
      storeModule.updateCycles(currentCycles);
    }

    ifSponsorCycleExists(sponsor: string): boolean {
      let currentCycles = clone(this.logoCycles);
      if (currentCycles) {
        let cycleExists: boolean = false;
        for (let i = 0; i < currentCycles.length; i++) {
          if (currentCycles[i].name === sponsor) {
            cycleExists = true;
            break;
          }
        }

        if (cycleExists) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }

    getCycle(sponsor: string): number {
      let currentCycles = clone(this.logoCycles);
      if (currentCycles) {
        let cycle: number = 10;
        for (let i = 0; i < currentCycles.length; i++) {
          if (currentCycles[i].name === sponsor) {
            cycle = currentCycles[i].cycle;
            break;
          }
        }
        return cycle;
      } else {
        return 10;
      }
    }
  }
</script>

<style>
  body {
    text-align: center;
  }
</style>
