<template>
  <div
    :style="{
      display: 'flex',
      'flex-direction': 'row',
      color: 'white',
      'font-size': '20px',
      width: '100%',
    }"
  >
    <div
      :style="{
        'background-color': '#3A008B',
        width: '140px',
        'font-size': '18px',
      }"
    >
      <b>Czytający</b>
    </div>
    <div
      :style="{
        'background-color': 'rgb(0,0,0,0.6)',
        width: 'calc(100% - 140px)',
      }"
    >
      {{ reader }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ReaderName',
    props: ['reader'],
  };
</script>
