import {
  replicantModule,
  ReplicantModule,
  ReplicantTypes,
} from '@gsps-layouts/browser_shared/replicant_store';
import type {
  RunDataArray,
  Timer,
  RunDataActiveRunSurrounding,
} from 'nodecg/bundles/nodecg-speedcontrol/src/types/schemas';
import { ObsData } from '@gsps-layouts/types/schemas';
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

  // Helper getter to return a specific replicant.
  get obsData(): ObsData {
    return this.reps.obsData;
  }

  get timer(): Timer {
    return this.reps.timerReplicant;
  }

  get runData(): RunDataArray[] {
    return this.reps.runDataArray;
  }

  get runDataActiveSurrounding(): RunDataActiveRunSurrounding {
    return this.reps.runDataActiveSurrounding;
  }
}

const store = new Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {},
  modules: { ReplicantModule, OurModule },
});
export default store;
export const storeModule = getModule(OurModule, store);
