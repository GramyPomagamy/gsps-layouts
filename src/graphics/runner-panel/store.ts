import {
  replicantModule,
  ReplicantModule,
  ReplicantTypes,
} from '@gsps-layouts/browser_shared/replicant_store';
import type { RunDataActiveRun, Timer } from 'speedcontrol/src/types/schemas';
import type { DonationsToRead, Reader } from '@gsps-layouts/types/schemas';
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

  get timer(): Timer {
    return this.reps.timerReplicant;
  }

  get donationsToRead(): DonationsToRead {
    return this.reps.donationsToRead;
  }

  get reader(): Reader {
    return this.reps.readerReplicant;
  }
}

const store = new Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {},
  modules: { ReplicantModule, OurModule },
});
export default store;
export const storeModule = getModule(OurModule, store);
