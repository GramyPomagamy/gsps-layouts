<template>
  <div
    class="grey darken-4 rounded-lg"
    :style="{ textAlign: 'center', width: '1200px' }"
  >
    <h3
      style="width: 100%; text-align: center; position: sticky"
      class="grey darken-3 pa-1 rounded-tl-lg rounded-tr-lg"
    >
      POZOSTAŁY CZAS
    </h3>
    <b
      ><span :style="countdownStyles">{{
        hostCountdownReplicant.formatted
      }}</span></b
    >
  </div>
</template>

<script>
  export default {
    name: 'HostPanelCountdown',
    props: ['hostCountdownReplicant'],
    computed: {
      countdownStyles() {
        const underLimitColor = '#357C3C';
        const warningColor = '#FFC300';
        const overLimitColor = '#FF5959';
        const warningSeconds = 30;
        const msInSecond = 1000;
        const baseFontSize = 48;
        const maxFontSize = 380;

        const secondsLeft = this.hostCountdownReplicant.raw / msInSecond;

        let fontSize = baseFontSize;
        let color = underLimitColor;
        if (secondsLeft <= 0) {
          color = overLimitColor;
          fontSize = Math.min(baseFontSize + -secondsLeft * 2, maxFontSize);
        } else if (secondsLeft <= warningSeconds) {
          color = warningColor;
        }

        return { color: color, fontSize: `${fontSize}px` };
      },
    },
  };
</script>

<style scoped>
  body {
    text-align: center;
  }
</style>
