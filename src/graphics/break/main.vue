<template>
    <div id="break">
        <div id="bottom">
            <img id="Logo" src="./img/GSPS_logo.png" />
            <break-reader
                :style="{
                    position: 'absolute',
                    bottom: '2px',
                    left: '200px',
                    width: '295px',
                }"
                :reader="reader"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator'
    import type { Bids, Reader } from '@gsps-layouts/types/schemas'
    import { Getter } from 'vuex-class'
    import { RunDataArray } from '../../../../nodecg-speedcontrol/src/types/schemas'
    import BreakReader from './components/Reader.vue'

    @Component({
        components: {
            BreakReader,
        },
    })
    export default class extends Vue {
        @Getter readonly currentBids!: Bids[] // from store.ts
        @Getter readonly allRuns!: RunDataArray[]
        @Getter readonly reader!: Reader
    }
</script>

<style>
    @import url('../css/styles.css');

    html {
        width: 1920px;
        height: 1080px;
        background-color: #41228eda;
    }

    #Logo {
        margin-top: 45px;
        width: 11%;
        position: absolute;
        bottom: 2px;
        left: 0px;
    }

    #bottom {
        width: 100%;
    }
</style>
