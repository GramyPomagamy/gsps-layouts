<template>
    <div id="total">
        <span id="totalAmount"></span>
        <div id="totalCurrency" style="font-size: 60%">PLN</div>
    </div>
</template>

<script lang="ts">
    import type { Total } from '../../../types/schemas';
    import gsap from 'gsap';
    import { Component, Vue } from 'vue-property-decorator';

    const totalRep = nodecg.Replicant<Total>('total');

    @Component
    export default class OmnibarTotal extends Vue {
        data() {
            return {
                total: { raw: 0 },
            };
        }

        mounted() {
            const updateHandler = () => {
                document.getElementById('totalAmount')!.innerHTML =
                    this.$data.total.raw.toLocaleString('en-US', {
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                    });
            };
            totalRep.on('change', (newVal) => {
                gsap.to(this.$data.total, {
                    duration: 3,
                    raw: newVal.raw,
                    roundProps: 'raw',
                    onUpdate: updateHandler,
                    ease: 'power4',
                });
            });
        }
    }
</script>

<style scoped>
    #total {
        color: white;
        background-color: #3a008b;
        font-size: 32px;
        position: relative;
        height: 100%;
        white-space: nowrap;
        padding-right: 9.6px;
        -ms-flex: none;
        -webkit-flex: none;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        display: flex;
        flex: none;
    }

    #totalAmount {
        display: block;
        font-weight: 600;
        margin-left: 6px;
        margin-right: 8px;
    }
</style>
