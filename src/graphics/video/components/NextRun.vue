<template>
  <div id="next-run-container">
    <span v-if="activeRun.game">
      <b>{{ activeRun.game }}</b>
    </span>
    <span>
      <template v-if="activeRun.category">{{ activeRun.category }} /</template>
      <template v-if="activeRun.estimate"
        >EST: {{ activeRun.estimate }} /</template
      >
      <template v-if="activeRun.system">{{ activeRun.system }} /</template>
      <template v-if="activeRun.teams.length > 0">{{
        formatPlayers(activeRun)
      }}</template>
    </span>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import { Getter } from 'vuex-class';
  import type { RunDataActiveRun } from 'speedcontrol/src/types/schemas';

  @Component
  export default class VideoNextRun extends Vue {
    @Getter readonly activeRun!: RunDataActiveRun;

    formatPlayers(run: RunDataActiveRun): string {
      return (
        run.teams
          .map(
            (team) =>
              team.name || team.players.map((player) => player.name).join(', ')
          )
          .join(' vs. ') || 'Bez gracza'
      );
    }
  }
</script>

<style scoped>
  #next-run-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: white;
    font-size: 30px;
    text-shadow: black 2px 2px 8px;
  }
</style>
