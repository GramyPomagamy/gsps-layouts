import type {
    Total,
    AutoUpdateTotal,
    CountdownRunning,
    Countdown,
    NameCycle,
    Commentators,
    Reader,
    Bids,
    Song,
    ObsData,
} from '@gsps-layouts/types/schemas';
import type { Asset } from '@gsps-layouts/types';
import type {
    RunDataActiveRun,
    RunDataArray,
    Timer,
    RunDataActiveRunSurrounding,
} from 'nodecg/bundles/nodecg-speedcontrol/src/types/schemas';
import clone from 'clone';
import type { ReplicantBrowser } from 'nodecg/types/browser';
import Vue from 'vue';
import type { Store } from 'vuex';
import { namespace } from 'vuex-class';
import {
    getModule,
    Module,
    Mutation,
    VuexModule,
} from 'vuex-module-decorators';

// Declaring replicants.
export const reps: {
    activeRunReplicant: ReplicantBrowser<RunDataActiveRun>;
    totalReplicant: ReplicantBrowser<Total>;
    autoUpdateTotalReplicant: ReplicantBrowser<AutoUpdateTotal>;
    countdownReplicant: ReplicantBrowser<Countdown>;
    countdownRunningReplicant: ReplicantBrowser<CountdownRunning>;
    nameCycleReplicant: ReplicantBrowser<NameCycle>;
    commentatorsReplicant: ReplicantBrowser<Commentators>;
    readerReplicant: ReplicantBrowser<Reader>;
    timerReplicant: ReplicantBrowser<Timer>;
    sponsors: ReplicantBrowser<Asset[]>;
    sponsors_break: ReplicantBrowser<Asset[]>;
    currentBids: ReplicantBrowser<Bids[]>;
    allBids: ReplicantBrowser<Bids[]>;
    runDataArray: ReplicantBrowser<RunDataArray[]>;
    currentSong: ReplicantBrowser<Song>;
    obsData: ReplicantBrowser<ObsData>;
    runDataActiveSurrounding: ReplicantBrowser<RunDataActiveRunSurrounding>;
    [k: string]: ReplicantBrowser<unknown>;
} = {
    totalReplicant: nodecg.Replicant('total'),
    autoUpdateTotalReplicant: nodecg.Replicant('autoUpdateTotal'),
    countdownReplicant: nodecg.Replicant('countdown', { persistent: false }),
    countdownRunningReplicant: nodecg.Replicant('countdownRunning', {
        persistent: false,
    }),
    activeRunReplicant: nodecg.Replicant(
        'runDataActiveRun',
        'nodecg-speedcontrol'
    ),
    nameCycleReplicant: nodecg.Replicant('nameCycle'),
    commentatorsReplicant: nodecg.Replicant('commentators'),
    readerReplicant: nodecg.Replicant('reader'),
    timerReplicant: nodecg.Replicant('timer', 'nodecg-speedcontrol'),
    sponsors: nodecg.Replicant('assets:sponsors'),
    sponsors_break: nodecg.Replicant('assets:sponsors-break'),
    currentBids: nodecg.Replicant('currentBids'),
    allBids: nodecg.Replicant('allBids'),
    runDataArray: nodecg.Replicant('runDataArray', 'nodecg-speedcontrol'),
    currentSong: nodecg.Replicant('song'),
    obsData: nodecg.Replicant('obsData', { persistent: false }),
    runDataActiveSurrounding: nodecg.Replicant(
        'runDataActiveRunSurrounding',
        'nodecg-speedcontrol'
    ),
};

// All the replicant types.
export interface ReplicantTypes {
    totalReplicant: Total;
    autoUpdateTotalReplicant: AutoUpdateTotal;
    countdownReplicant: Countdown;
    countdownRunningReplicant: CountdownRunning;
    activeRunReplicant: RunDataActiveRun;
    nameCycleReplicant: NameCycle;
    commentatorsReplicant: Commentators;
    readerReplicant: Reader;
    timerReplicant: Timer;
    sponsors: Asset[];
    sponsors_break: Asset[];
    currentBids: Bids[];
    allBids: Bids[];
    runDataArray: RunDataArray[];
    currentSong: Song;
    obsData: ObsData;
    runDataActiveSurrounding: RunDataActiveRunSurrounding;
}

@Module({ name: 'ReplicantModule', namespaced: true })
export class ReplicantModule extends VuexModule {
    // Replicant values are stored here.
    reps: { [k: string]: unknown } = {};

    // This sets the state object above when a replicant sends an update.
    @Mutation
    setState({ name, val }: { name: string; val: unknown }): void {
        Vue.set(this.reps, name, clone(val));
    }

    // This is a generic mutation to update a named replicant.
    @Mutation
    setReplicant<K>({ name, val }: { name: string; val: K }): void {
        Vue.set(this.reps, name, clone(val)); // Also update local copy, although no schema validation!
        reps[name].value = clone(val);
    }
}

// eslint-disable-next-line import/no-mutable-exports
export let replicantModule!: ReplicantModule;
export const replicantNS = namespace('ReplicantModule');

export async function setUpReplicants(store: Store<unknown>): Promise<void> {
    // Listens for each declared replicants "change" event, and updates the state.
    Object.keys(reps).forEach((name) => {
        reps[name].on('change', (val) => {
            store.commit('ReplicantModule/setState', { name, val });
        });
    });
    // We should make sure the replicant are ready to be read, needs to be done in browser context.
    await NodeCG.waitForReplicants(
        ...Object.keys(reps).map((key) => reps[key])
    );
    replicantModule = getModule(ReplicantModule, store);
}
