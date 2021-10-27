<template>
    <v-app>
        <v-text-field
            v-model="readerName"
            id="readerField"
            label="Obecny czytający"
            filled
        ></v-text-field>
        <v-btn
            v-on:click="
                () => {
                    updateReader()
                }
            "
            >Aktualizuj czytającego</v-btn
        >
    </v-app>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator'
    import type { Reader } from '@gsps-layouts/types/schemas'
    import { Getter } from 'vuex-class'
    import { storeModule } from './store'

    @Component
    export default class extends Vue {
        @Getter readonly reader!: Reader

        readerName: string = ''

        mounted() {
            this.readerName = this.reader
        }

        updateReader(): void {
            storeModule.updateReader(this.readerName)
        }
    }
</script>

<style>
    body {
        text-align: center;
    }
</style>
