<template>
    <div id="total">
        <div id="totalAmount"></div>
        <div id="totalCurrency">PLN</div>
    </div>
</template>

<script lang="ts">
    import type { Total } from '../../../types/schemas';
    import gsap from 'gsap';
    import { Component, Vue } from 'vue-property-decorator';

    const totalRep = nodecg.Replicant<Total>('total');

    @Component
    export default class BreakTotal extends Vue {
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
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 100px;
    }

    #totalAmount {
        font-weight: bold;
    }

    #totalCurrency {
        font-size: 64px;
        margin-left: 20px;
    }
</style>
