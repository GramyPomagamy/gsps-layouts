import {
    replicantModule,
    ReplicantModule,
    ReplicantTypes,
} from '@gsps-layouts/browser_shared/replicant_store';
import { Countdown, Song } from '@gsps-layouts/types/schemas';
import clone from 'clone';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { Action, getModule, Module, VuexModule } from 'vuex-module-decorators';

Vue.use(Vuex);

@Module({ name: 'OurModule' })
class OurModule extends VuexModule {
    // Helper getter to return all replicants.
    get reps(): ReplicantTypes {
        return this.context.rootState.ReplicantModule.reps;
    }

    get countdown(): Countdown {
        return this.reps.countdownReplicant;
    }

    get currentSong(): Song {
        return this.reps.currentSong;
    }
}

const store = new Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {},
    modules: { ReplicantModule, OurModule },
});
export default store;
export const storeModule = getModule(OurModule, store);
