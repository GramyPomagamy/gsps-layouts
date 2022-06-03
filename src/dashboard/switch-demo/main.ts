/* eslint no-new: off, @typescript-eslint/explicit-function-return-type: off */

import vuetify from '@gsps-layouts/_misc/vuetify';
import Vue from 'vue';
import App from './main.vue';

new Vue({
  vuetify,
  el: '#App',
  render: (h) => h(App),
});
