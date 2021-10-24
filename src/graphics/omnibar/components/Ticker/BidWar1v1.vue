<template>
    <div id="War1v1">
        <div id="ProgressBars">
            <div
                :style="{
                    width: `calc(${choice1.percentage}% - 4px)`,
                    height: '100%',
                    'background-color': '#3A008B',
                    display: 'inline-block',
                    'border-right': '2px solid white',
                    'border-left': '2px solid white',
                }"
            ></div>
            <div
                :style="{
                    width: `calc(${choice2.percentage}% - 4px)`,
                    height: '100%',
                    'background-color': '#ffbd16',
                    float: 'right',
                    display: 'inline-block',
                    'border-left': '2px solid white',
                    'border-right': '2px solid white',
                }"
            ></div>
        </div>

        <div id="Text">
            <div :style="{ width: '50%', height: '100%' }">
                <p
                    :style="{
                        'margin-left': '12px',
                        'margin-top': '4px',
                        'font-size': '22px',
                    }"
                >
                    <b>Nadchodząca licytacja:</b>
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
            </div>

            <div :style="{ width: '50%', height: '100%', float: 'right' }">
                <p
                    :style="{
                        'text-align': 'right',
                        'margin-left': 'auto',
                        'font-size': '22px',
                        'margin-top': '4.2px',
                        'margin-right': '12px',
                    }"
                >
                    <b>1.</b> {{ bid.options[0].name }} -
                    <b>{{ choice1.total }} PLN </b>
                </p>
                <p
                    :style="{
                        'text-align': 'right',
                        'margin-left': 'auto',
                        'font-size': '20px',
                        'margin-top': '-26px',
                        'margin-right': '12px',
                    }"
                >
                    <b>2.</b> {{ bid.options[1].name }} -
                    <b>{{ choice2.total }} PLN </b>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    import gsap from 'gsap'
    const bids = nodecg.Replicant('currentBids')

    export default {
        name: 'TickerBidWar1v1',
        data() {
            return {
                bid: {},
                choice1: {
                    name: '',
                    total: 0,
                    percentage: 0,
                },
                choice2: {
                    name: '',
                    total: 0,
                    percentage: 0,
                },
            }
        },
        methods: {
            getBid() {
                const wars = bids.value
                    .filter((bid) => bid.type === 'choice-binary')
                    .slice(0, 3)
                return wars[Math.floor(Math.random() * wars.length)]
            },
        },
        mounted() {
            this.bid = this.getBid()
            console.log('BidWar1v1: mounted')

            const animate = () => {
                gsap.to(this.choice1, {
                    duration: 3,
                    total: this.bid.options[0].rawTotal,
                    roundProps: 'total',
                    ease: 'power3',
                })
                gsap.to(this.choice1, {
                    duration: 3,
                    percentage:
                        (this.bid.options[0].rawTotal / this.bid.rawTotal) *
                        100,
                    ease: 'power3',
                })
                gsap.to(this.choice2, {
                    duration: 3,
                    total: this.bid.options[1].rawTotal,
                    roundProps: 'total',
                    ease: 'power3',
                })
                gsap.to(this.choice2, {
                    duration: 3,
                    percentage:
                        (this.bid.options[1].rawTotal / this.bid.rawTotal) *
                        100,
                    ease: 'power3',
                })
            }

            setTimeout(() => animate(), 1.5 * 1000)

            setTimeout(() => {
                this.$emit('end')
                console.log('BidWar1v1: ended')
            }, 10 * 1000)
        },
    }
</script>

<style scoped>
    #War1v1 {
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

    #ProgressBars {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }
</style>
