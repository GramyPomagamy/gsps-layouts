import {
  replicantModule,
  ReplicantModule,
  ReplicantTypes,
} from '@gsps-layouts/browser_shared/replicant_store';
import type { RunDataActiveRun, Timer } from 'speedcontrol/src/types/schemas';
import type {
  NameCycle,
  Commentators,
  Reader,
} from '@gsps-layouts/types/schemas';
import type { Asset, LogoCycle } from '@gsps-layouts/types';
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

  get activeRun(): RunDataActiveRun {
    return this.reps.activeRunReplicant;
  }

  get nameCycle(): NameCycle {
    return this.reps.nameCycleReplicant;
  }

  get commentators(): Commentators {
    return this.reps.commentatorsReplicant;
  }

  get reader(): Reader {
    return this.reps.readerReplicant;
  }

  get sponsors(): Asset[] {
    return this.reps.sponsors;
  }

  get timer(): Timer {
    return this.reps.timerReplicant;
  }
  get logoCycles(): LogoCycle[] {
    return this.reps.logoCycles;
  }
}

const store = new Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {},
  modules: { ReplicantModule, OurModule },
});
export default store;
export const storeModule = getModule(OurModule, store);
