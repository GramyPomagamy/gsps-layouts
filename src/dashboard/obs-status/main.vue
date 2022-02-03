<template>
    <v-app>
        <div id="connected">
            <h2>
                <span v-if="!obsData.connected" style="color: red">NIE </span
                ><span
                    :style="
                        obsData.connected
                            ? { color: 'green' }
                            : { color: 'red' }
                    "
                    >POŁĄCZONO</span
                >
                z OBSem
            </h2>
        </div>
        <div id="stream-record" v-if="obsData.connected">
            <h2>
                <span>Stream: </span
                ><span v-if="!obsData.streaming" style="color: red">NIE </span
                ><span
                    :style="
                        obsData.streaming
                            ? { color: 'green' }
                            : { color: 'red' }
                    "
                    >WŁĄCZONY</span
                >
            </h2>
            <h2>
                <span>Nagrywanie: </span
                ><span v-if="!obsData.recording" style="color: red">NIE </span
                ><span
                    :style="
                        obsData.recording
                            ? { color: 'green' }
                            : { color: 'red' }
                    "
                    >WŁĄCZONE</span
                >
            </h2>
        </div>
    </v-app>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator'
    import type { ObsData } from '@gsps-layouts/types/schemas'
    import { Getter } from 'vuex-class'

    @Component
    export default class extends Vue {
        @Getter readonly obsData!: ObsData
    }
</script>

<style>
    body {
        text-align: center;
    }
</style>
