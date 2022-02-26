<template>
  <div
    id="milestones"
    style="height: 617px; width: 500px; display: flex; flex-direction: column"
    class="grey darken-4 rounded-lg"
  >
    <h3
      style="width: 100%; text-align: center; position: sticky"
      class="grey darken-3 pa-1 rounded-tl-lg rounded-tr-lg"
    >
      CELE
    </h3>
    <div id="filter" class="mx-3">
      <v-text-field
        class="mt-6"
        dense
        outlined
        v-model="filter"
        placeholder="Filtruj..."
      ></v-text-field>
      <v-tooltip left
        ><template v-slot:activator="{ on, attrs }">
          <v-btn
            :disabled="updating"
            :loading="updating"
            fab
            v-bind="attrs"
            @click="update"
            v-on="on"
            class="mt-4 ml-2"
            ><v-icon>mdi-refresh</v-icon></v-btn
          >
        </template>
        <span>Odśwież listę celi ręcznie</span></v-tooltip
      >
    </div>
    <v-divider />
    <div class="pa-2" style="height: 100%; overflow: auto">
      <div id="open-milestones">
        <template v-for="milestone in milestones">
          <reader-panel-milestone
            v-if="
              milestone.name.toLowerCase().includes(filter) &&
              total.raw < milestone.amount
            "
            :milestone="milestone"
            :key="milestone.name"
            :met="total.raw >= milestone.amount"
            :total="total.raw"
          />
        </template>
      </div>
      <div id="closed-milestones">
        <template v-for="milestone in milestones">
          <reader-panel-milestone
            v-if="
              milestone.name.toLowerCase().includes(filter) &&
              total.raw >= milestone.amount
            "
            :milestone="milestone"
            :key="milestone.name"
            :met="total.raw >= milestone.amount"
            :total="total.raw"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import ReaderPanelMilestone from './Milestones/Milestone.vue';

  export default {
    name: 'ReaderPanelMilestones',
    props: ['milestones', 'total'],
    data() {
      return {
        filter: '',
        updating: false,
      };
    },
    components: {
      ReaderPanelMilestone,
    },
    methods: {
      update() {
        nodecg.sendMessage('updateMilestones');
      },
    },
    mounted() {
      nodecg.listenFor('milestones:updating', () => {
        clearInterval(this.refreshTimer);
        this.updating = true;
      });

      nodecg.listenFor('milestones:updated', () => {
        this.updating = false;
      });
    },
  };
</script>

<style scoped>
  #filter {
    display: flex;
  }

  #refreshCountdown {
    text-align: center;
    width: 100%;
  }
</style>
