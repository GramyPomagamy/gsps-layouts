import {
  replicantModule,
  ReplicantModule,
  ReplicantTypes,
} from '@gsps-layouts/browser_shared/replicant_store';
import { Bid, Prize } from '@gsps-layouts/types';
import type { Hosterka, Prizes, Bids } from '@gsps-layouts/types/schemas';
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

  get hosterka(): Hosterka {
    return this.reps.hosterkaRep;
  }

  get bids(): Bids[] {
    return this.reps.currentBids;
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
