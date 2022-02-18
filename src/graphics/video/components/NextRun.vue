<template>
  <div id="next-run-container">
    <span v-if="run.game">
      <b>{{ run.game }}</b>
    </span>
    <span>
      <template v-if="run.category">{{ run.category }} /</template>
      <template v-if="run.estimate">EST: {{ run.estimate }} /</template>
      <template v-if="run.system">{{ run.system }} /</template>
      <template v-if="run.teams.length > 0">{{ formatPlayers(run) }}</template>
    </span>
  </div>
</template>

<script>
  export default {
    name: 'VideoNextRun',
    props: ['run'],
    methods: {
      formatPlayers(run) {
        return (
          run.teams
            .map(
              (team) =>
                team.name ||
                team.players.map((player) => player.name).join(', ')
            )
            .join(' vs. ') || 'Bez gracza'
        );
      },
    },
  };
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
