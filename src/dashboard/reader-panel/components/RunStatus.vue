<template>
  <div
    class="grey darken-4 rounded-lg"
    :style="{ textAlign: 'center', width: '500px' }"
  >
    <div id="timer">
      <b>{{ timer.time }}</b>
    </div>
    <v-divider />
    <div v-if="run" id="run">
      <p :style="{ fontSize: '20px' }">
        <b>{{ run.game }}</b>
      </p>
      <p>{{ run.category }}</p>
      <v-divider />
      <div id="players" class="px-5 py-2">
        <div
          :style="{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }"
          v-for="team in run.teams"
          :key="team.id"
        >
          <p :style="{ float: 'left' }">{{ formatPlayers(team) }}</p>
          <p
            :style="{ float: 'right', textAlign: 'right' }"
            v-if="timer.teamFinishTimes[team.id]"
          >
            {{ timer.teamFinishTimes[team.id].time }}
          </p>
          <p v-else>W trakcie</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ReaderPanelRunStatus',
    props: ['run', 'timer'],
    methods: {
      formatPlayers(team) {
        return team.players.map((player) => player.name).join(', ');
      },
    },
  };
</script>

<style scoped>
  #timer {
    font-size: 36px;
  }

  #players {
    font-size: 20px;
  }
</style>
