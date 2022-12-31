import {
  replicantModule,
  ReplicantModule,
  ReplicantTypes,
} from '@gsps-layouts/browser_shared/replicant_store';
import {
  Bids,
  DonationsToRead,
  Total,
  Reader,
} from '@gsps-layouts/types/schemas';
import type { RunDataActiveRun, Timer } from 'speedcontrol/src/types/schemas';
import { Milestones } from '@gsps-layouts/types';
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
  get allBids(): Bids[] {
    return this.reps.allBids;
  }

  get donationsToRead(): DonationsToRead {
    return this.reps.donationsToRead;
  }

  get total(): Total {
    return this.reps.totalReplicant;
  }

  get reader(): Reader {
    return this.reps.readerReplicant;
  }

  get milestones(): Milestones {
    return this.reps.milestonesReplicant;
  }

  get timer(): Timer {
    return this.reps.timerReplicant;
  }

  get activeRun(): RunDataActiveRun {
    return this.reps.activeRunReplicant;
  }

  get donationsToAccept(): number {
    return this.reps.donationsToAccept;
  }

  get bidsToAccept(): number {
    return this.reps.bidsToAccept;
  }

  @Action({ rawError: true })
  updateReader(val: string): void {
    replicantModule.setReplicant<Reader>({ name: 'readerReplicant', val });
  }
}

const store = new Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {},
  modules: { ReplicantModule, OurModule },
});
export default store;
export const storeModule = getModule(OurModule, store);
