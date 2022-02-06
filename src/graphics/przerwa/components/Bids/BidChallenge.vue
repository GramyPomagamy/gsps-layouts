<template>
    <div id="bid" class="layout layout-horizontal">
        <div id="leftWrapper" class="layout layout-flex layout-horizontal">
            <div id="left" class="layout layout-horizontal">
                <div id="meter" class="layout-flex"></div>
                <div id="meter-line" class="layout-flex-none"></div>
                <p id="amount">{{ amount }}</p>
                <p id="percent" class="layout layout-center layout-horizontal">
                    {{ percent }}%
                </p>
            </div>
        </div>

        <div id="right" class="layout-flex-none">
            <div id="goal"></div>
        </div>

        <div id="fill"></div>
        <div id="bottomBorder"></div>
    </div>
</template>

<script>
    import gsap from 'gsap';

    export default {
        name: 'BidChallenge',
        props: ['bid'],
        mounted() {
            gsap.set('#meter', { scaleX: 0 });
            gsap.set('#meter-line', { scaleY: 0 });
            this.animate();
        },
        methods: {
            animate() {
                let meterPercent = this.bid.rawTotal / this.bid.rawGoal;
                meterPercent = Math.max(meterPercent, 0); // Clamp to min 0
                meterPercent = Math.min(meterPercent, 1); // Clamp to max 1
                if (Number.isNaN(meterPercent)) {
                    meterPercent = 0;
                }

                const tl = new gsap.timeline();
                const meterDuration = 2 * meterPercent;

                tl.set('#left', {
                    width: `${meterPercent * 100}%`,
                });

                tl.call(
                    () => {
                        document.getElementById('goal').innerHTML =
                            this.bid.rawGoal.toLocaleString('en-US', {
                                maximumFractionDigits: 0,
                                useGrouping: false,
                            }) + ' PLN';

                        if (
                            document.getElementById('meter').clientWidth <
                            document.getElementById('amount').clientWidth
                        ) {
                            gsap.set('#amount', {
                                right: '',
                                left: '100%',
                            });
                        }
                    },
                    null,
                    null,
                    '+=0.03'
                );

                tl.to('#meter-line', 0.324, {
                    scaleY: 1,
                    ease: 'Power2.easeInOut',
                });

                tl.addLabel('meter');

                tl.to(
                    '#meter',
                    meterDuration,
                    {
                        scaleX: 1,
                        ease: 'power4',
                    },
                    'meter'
                );

                tl.to(
                    this.$data,
                    {
                        duration: meterDuration,
                        amount: this.bid.rawTotal,
                        roundProps: 'amount',
                        ease: 'power4',
                    },
                    'meter'
                );

                tl.to(
                    this.$data,
                    {
                        duration: meterDuration,
                        percent: Math.floor(meterPercent * 100),
                        roundProps: 'percent',
                        ease: 'power4',
                    },
                    'meter'
                );

                tl.call(
                    () => {
                        setTimeout(() => {
                            this.$emit('end');
                        }, 5000);
                    },
                    null,
                    null
                );
            },
        },
        data() {
            return {
                amount: 0,
                percent: 0,
            };
        },
    };
</script>

<style scoped>
    @import url('../../../css/styles.css');
    #bid {
        height: 152px;
        color: white;
        will-change: opacity;
        width: 100%;
    }

    #left {
        position: relative;
        font-weight: 400;
    }

    #meter {
        background-color: #3a008b;
        transform-origin: left;
        will-change: transform;
    }

    #meter-line {
        height: 100%;
        width: 2px;
        background: white;
        will-change: transform;
    }

    #percent {
        position: absolute;
        top: 0;
        left: 100%;
        height: 100%;
        padding-left: 5px;
        font-size: 40px;
    }

    #amount {
        position: absolute;
        top: -24px;
        right: 0;
        padding: 5px 6px;
        font-size: 24px;
    }

    #right {
        border-left: 2px dashed white;
        width: 113px;
    }

    #goal {
        padding: 5px 6px;
        font-size: 24px;
    }

    #fill {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.2);
        pointer-events: none;
        z-index: -10;
    }

    #fill:before,
    #fill:after {
        display: block;
        content: '';
        width: 2px;
        height: calc(100% - 2px);
        position: absolute;
        top: 0;
        border-top: 1px solid white;
        border-bottom: 1px solid white;
        box-sizing: border-box;
    }
    #fill:before {
        left: 0;
    }
    #fill:after {
        right: 0;
    }

    #bottomBorder {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: rgba(255, 255, 255, 0.5);
        pointer-events: none;
    }
</style>
