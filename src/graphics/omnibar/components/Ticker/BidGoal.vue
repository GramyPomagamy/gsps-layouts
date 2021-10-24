<template>
    <div id="Goal">
        <div
            :style="{
                width: `calc(${bidInfo.progress}% - 4px)`,
                'max-width': 'calc(100% - 4px)',
                height: '100%',
                'background-color': '#3A008B',
                position: 'absolute',
                left: 0,
                top: 0,
                'border-right': '2px solid white',
                'border-left': '2px solid white',
            }"
        ></div>
        <div id="Text">
            <p
                :style="{
                    'margin-left': '12px',
                    'margin-top': '4px',
                    'font-size': '22px',
                }"
            >
                <b>Nadchodzący cel:</b>
            </p>
            <p
                :style="{
                    position: 'absolute',
                    'font-size': '20px',
                    left: '12px',
                    top: '9px',
                }"
            >
                {{ bid.game }} - {{ bid.name }}
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
                (<span id="progress">{{
                    Math.round(this.bidInfo.progress)
                }}</span
                >%)
            </p>
        </div>
    </div>
</template>

<script>
    import gsap from 'gsap'
    const bids = nodecg.Replicant('currentBids')

    export default {
        name: 'TickerBidGoal',
        data() {
            return {
                bid: {},
                bidInfo: {
                    total: 0,
                    progress: 0,
                },
            }
        },
        methods: {
            getBid() {
                const challenges = bids.value
                    .filter((bid) => bid.type === 'challenge')
                    .slice(0, 3)
                return challenges[Math.floor(Math.random() * challenges.length)]
            },
        },
        mounted() {
            this.bid = this.getBid()
            console.log('BidGoal: mounted')

            const animate = () => {
                gsap.to(this.bidInfo, {
                    duration: 4,
                    total: this.bid.rawTotal,
                    roundProps: 'total',
                    ease: 'power3',
                })
                gsap.to(this.bidInfo, {
                    duration: 4,
                    progress: (this.bid.rawTotal / this.bid.rawGoal) * 100,
                    ease: 'power3',
                })
            }

            setTimeout(() => animate(), 1.5 * 1000)

            setTimeout(() => {
                this.$emit('end')
                console.log('BidGoal: ended')
            }, 10 * 1000)
        },
    }
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
        background-color: rgb(0, 0, 0, 0.2);
        width: 100%;
        height: 100%;
        display: flex;
        z-index: 10;
    }
</style>
