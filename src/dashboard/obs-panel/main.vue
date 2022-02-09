<template>
    <v-app>
        <v-btn block :disabled="disableChange || !nextRun" @click="playNextRun">
            <span v-if="nextRun">
                <v-icon left>mdi-play</v-icon>{{ nextRunGameName }}
            </span>
            <span v-else-if="runDataArray.length"> Koniec runów </span>
            <span v-else> Brak dodanych runów </span>
        </v-btn>
        <v-alert
            v-if="disableChange"
            dense
            type="info"
            :style="{ 'margin-top': '5px' }"
        >
            Nie możesz zmienić gry w tym momencie.
        </v-alert>
    </v-app>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import type { ObsData } from '@gsps-layouts/types/schemas';
    import { Getter } from 'vuex-class';
    import type {
        Timer,
        RunDataActiveRunSurrounding,
    } from 'nodecg/bundles/nodecg-speedcontrol/src/types/schemas';
    import type { RunData } from 'nodecg/bundles/nodecg-speedcontrol/src/types';

    @Component
    export default class extends Vue {
        @Getter readonly obsData!: ObsData;
        @Getter readonly timer!: Timer;
        @Getter readonly runData!: RunData[];
        @Getter readonly runDataActiveSurrounding!: RunDataActiveRunSurrounding;

        get nextRun(): RunData | undefined {
            return this.runData.find(
                (run) => run.id === this.runDataActiveSurrounding.next
            );
        }
        get nextRunGameName(): string {
            if (this.nextRun && this.nextRun.game) {
                return `${this.nextRun.game.slice(0, 35)}${
                    this.nextRun.game.length > 35 ? '...' : ''
                }`;
            }
            return '(Run bez nazwy)';
        }
        get disableChange(): boolean {
            return ['running', 'paused'].includes(this.timer.state);
        }
        playNextRun(): void {
            if (this.nextRun) {
                nodecg
                    .sendMessage('switchToIntermission')
                    .then(() => {
                        // run change successful
                    })
                    .catch(() => {
                        // run change unsuccessful
                    });
            }
        }
    }
</script>

<style>
    body {
        text-align: center;
    }
</style>
