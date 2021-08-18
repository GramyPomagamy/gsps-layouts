import { replicantModule, ReplicantModule, ReplicantTypes } from '@gsps-layouts/browser_shared/replicant_store';
import { AutoUpdateTotal, Total } from '@gsps-layouts/types/schemas';
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
  get totalReplicant(): Total {
    return this.reps.totalReplicant;
  }

  get autoUpdateTotalReplicant(): AutoUpdateTotal {
    return this.reps.autoUpdateTotalReplicant;
  }

  @Action({rawError: true})
  updateAutoUpdateReplicant(setting: boolean): void {
    const val: boolean = setting; 
    replicantModule.setReplicant<AutoUpdateTotal>({ name: 'autoUpdateTotalReplicant', val })
  }
}

const store = new Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {},
  modules: { ReplicantModule, OurModule },
});
export default store;
export const storeModule = getModule(OurModule, store);
