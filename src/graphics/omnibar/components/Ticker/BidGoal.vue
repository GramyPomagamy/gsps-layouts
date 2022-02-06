<template>
    <div id="Goal">
        <ticker-label :label="'LICYTACJE <br/> CELE'" />
        <div id="progress-bar">
            <div
                :style="{
                    width: `calc(${bidInfo.progress}% - 4px)`,
                    'max-width': 'calc(100% - 4px)',
                    'background-color': '#3A008B',
                    height: '90%',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                }"
            ></div>
        </div>

        <div id="Text">
            <p
                :style="{
                    'text-align': 'left',
                    'font-size': '16px',
                    'margin-top': '10px',
                    'margin-right': '12px',
                    'line-height': '20px',
                }"
            >
                <b
                    >{{ bid.game }} <br />
                    {{ bid.name }}</b
                >
            </p>
            <p
                :style="{
                    'text-align': 'right',
                    'margin-left': 'auto',
                    'font-size': '36px',
                    'margin-top': '4.2px',
                    'margin-right': '12px',
                }"
            >
                <b
                    ><span id="total">{{ bidInfo.total }}</span> /
                    {{ bid.rawGoal }} PLN</b
                >
            </p>
        </div>
    </div>
</template>

<script>
    import gsap from 'gsap';
    import TickerLabel from './Label.vue';
    const bids = nodecg.Replicant('currentBids');

    export default {
        name: 'TickerBidGoal',
        components: {
            TickerLabel,
        },
        data() {
            return {
                bid: {},
                bidInfo: {
                    total: 0,
                    progress: 0,
                },
            };
        },
        methods: {
            getBid() {
                const challenges = bids.value
                    .filter((bid) => bid.type === 'challenge')
                    .slice(0, 3);
                return challenges[
                    Math.floor(Math.random() * challenges.length)
                ];
            },
        },
        mounted() {
            this.bid = this.getBid();
            console.log('BidGoal: mounted');

            const animate = () => {
                gsap.to(this.bidInfo, {
                    duration: 4,
                    total: this.bid.rawTotal,
                    roundProps: 'total',
                    ease: 'power3',
                });
                gsap.to(this.bidInfo, {
                    duration: 4,
                    progress: (this.bid.rawTotal / this.bid.rawGoal) * 100,
                    ease: 'power3',
                });
            };

            setTimeout(() => animate(), 1.5 * 1000);

            setTimeout(() => {
                this.$emit('end');
                console.log('BidGoal: ended');
            }, 10 * 1000);
        },
    };
</script>

<style scoped>
    #Goal {
        width: 100%;
        height: 100%;
        display: flex;
        color: white;
    }

    #Text {
        text-shadow: 2px 2px 8px black;
        width: calc(100% - 200px);
        height: 100%;
        display: flex;
        z-index: 10;
        position: absolute;
        left: 158px;
        top: 2px;
        white-space: nowrap;
    }

    #progress-bar {
        width: calc(100% - 200px);
        height: 40px;
        position: absolute;
        left: 150px;
        top: 6px;
        padding: 5px;
        border: 2px solid white;
    }
</style>
