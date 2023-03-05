import {
  replicantModule,
  ReplicantModule,
  ReplicantTypes,
} from '@gsps-layouts/browser_shared/replicant_store';
import { Bids, Total, Countdown, Prizes } from '@gsps-layouts/types/schemas';
import { Milestones, Prize, Bid } from '@gsps-layouts/types';
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

  get total(): Total {
    return this.reps.totalReplicant;
  }

  get milestones(): Milestones {
    return this.reps.milestonesReplicant;
  }

  get hostCountdownReplicant(): Countdown {
    return this.reps.hostCountdownReplicant;
  }

  get prizes(): Prizes {
    return this.reps.prizes;
  }

  get currentBid(): Bid | null {
    return this.reps.currentlyShownBid;
  }

  get currentBidIndex(): number {
    return this.reps.currentlyShownBidIndex;
  }

  get currentPrize(): Prize | null {
    return this.reps.currentlyShownPrize;
  }

  get currentPrizeIndex(): number {
    return this.reps.currentlyShownPrizeIndex;
  }

  get showPrizePanel(): boolean {
    return this.reps.showPrizePanel;
  }

  get showBidsPanel(): boolean {
    return this.reps.showBidsPanel;
  }
}

const store = new Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {},
  modules: { ReplicantModule, OurModule },
});
export default store;
export const storeModule = getModule(OurModule, store);
