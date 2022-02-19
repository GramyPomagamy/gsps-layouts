import {
  replicantModule,
  ReplicantModule,
  ReplicantTypes,
} from '@gsps-layouts/browser_shared/replicant_store';
import { Asset, LogoCycle } from '@gsps-layouts/types';
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
  get sponsors(): Asset[] {
    return this.reps.sponsors_break;
  }

  get logoCycles(): LogoCycle[] {
    return this.reps.logoCyclesBreak;
  }

  @Action({ rawError: true })
  updateCycles(val: LogoCycle[]): void {
    replicantModule.setReplicant<LogoCycle[]>({ name: 'logoCyclesBreak', val });
  }
}

const store = new Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {},
  modules: { ReplicantModule, OurModule },
});
export default store;
export const storeModule = getModule(OurModule, store);
