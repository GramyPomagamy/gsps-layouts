<template>
    <v-app>
        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-card nodecg-dialog="edit-total" v-bind="attrs" v-on="on">
                    <v-card-subtitle id="amount">
                        <h1>{{ totalReplicant.formatted }}</h1>
                    </v-card-subtitle>
                </v-card>
            </template>
            <span>Naciśnij, aby edytować kwotę</span>
        </v-tooltip>
        <br />
        <v-btn
            v-on:click="
                () => {
                    updateTotal();
                }
            "
            >Zaktualizuj kwotę ręcznie</v-btn
        >
        <v-switch
            v-model="autoUpdateTotal"
            v-on:change="
                () => {
                    updateAutoUpdate();
                }
            "
            label="Aktualizuj kwotę automatycznie"
        ></v-switch>
    </v-app>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import type { AutoUpdateTotal, Total } from '@gsps-layouts/types/schemas';
    import { Getter } from 'vuex-class';
    import { storeModule } from './store';

    @Component
    export default class extends Vue {
        data() {
            return {
                autoUpdateTotal: false,
            };
        }
        @Getter readonly totalReplicant!: Total;
        @Getter readonly autoUpdateTotalReplicant!: AutoUpdateTotal;

        autoUpdateTotal = this.autoUpdateTotalReplicant;

        updateTotal(): void {
            nodecg.sendMessage('updateTotal');
        }

        updateAutoUpdate(): void {
            storeModule.updateAutoUpdateReplicant(this.autoUpdateTotal);
        }

        mounted() {
            this.$data.autoUpdateTotal = this.autoUpdateTotalReplicant;
        }
    }
</script>

<style>
    #amount {
        text-align: center;
        color: white;
    }

    body {
        text-align: center;
    }
</style>
