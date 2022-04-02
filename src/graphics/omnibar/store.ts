import {
  replicantModule,
  ReplicantModule,
  ReplicantTypes,
} from '@gsps-layouts/browser_shared/replicant_store';
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
}

const store = new Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {},
  modules: { ReplicantModule, OurModule },
});
export default store;
export const storeModule = getModule(OurModule, store);
