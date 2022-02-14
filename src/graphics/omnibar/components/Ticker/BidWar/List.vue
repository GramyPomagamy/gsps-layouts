<template>
  <div id="container" class="layout-flex layout-horizontal layout-start">
    <div id="content" class="layout-horizontal layout-flex-none">
      <div id="contentSlot">
        <template v-if="options.length > 0">
          <bid-war-option
            v-for="(option, i) in options"
            :option="option"
            :winning="i === 0"
            :key="i"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import gsap from 'gsap';
  import BidWarOption from './Option.vue';

  const MIN_CONTENT_SCROLL_DISTANCE = 3;
  const CONTENT_SCROLL_TIME_PER_PIXEL = 0.002;
  const OCCLUDED_OPACITY = 0.25;
  export default {
    name: 'BidWarOptionList',
    props: ['options'],
    components: {
      BidWarOption,
    },
    methods: {
      getListItems() {
        return Array.from(document.getElementById('contentSlot').children);
      },
    },
  };
</script>

<style scoped>
  @import url('../../../../css/styles.css');
  #container {
    width: 100%;
    height: 100%;
    min-width: 1px;
  }

  #content {
    height: 100%;
  }
</style>
