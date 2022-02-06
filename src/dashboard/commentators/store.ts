import {
    replicantModule,
    ReplicantModule,
    ReplicantTypes,
} from '@gsps-layouts/browser_shared/replicant_store';
import { Commentators } from '@gsps-layouts/types/schemas';
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
    get commentatorsReplicant(): Commentators {
        return this.reps.commentatorsReplicant;
    }

    @Action({ rawError: true })
    updateCommentatorsReplicant(nicknames: string): void {
        let nameAmount: number = 0;
        if (nicknames.length > 0) {
            nameAmount = nicknames.split(',').length;
        }
        const val: Commentators = {
            amount: nameAmount,
            names: nicknames,
        };
        replicantModule.setReplicant<Commentators>({
            name: 'commentatorsReplicant',
            val,
        });
    }
}

const store = new Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {},
    modules: { ReplicantModule, OurModule },
});
export default store;
export const storeModule = getModule(OurModule, store);
