/* eslint no-new: off, @typescript-eslint/explicit-function-return-type: off */

import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import { setUpReplicants } from '@gsps-layouts/browser_shared/replicant_store'
import Vue from 'vue'
import App from './main.vue'
import store from './store'

setUpReplicants(store).then(() => {
    new Vue({
        store,
        el: '#App',
        render: (h) => h(App),
    })
})
