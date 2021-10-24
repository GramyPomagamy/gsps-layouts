<template>
    <div id="Ticker">
        <transition name="fade" mode="out-in">
            <component
                :is="currentComponent.name"
                :key="timestamp"
                :data="currentComponent.data"
                @end="showNextMsg"
            />
        </transition>
    </div>
</template>

<script>
    import TickerGenericMessage from './Ticker/GenericMessage.vue'
    import TickerBidGoal from './Ticker/BidGoal.vue'
    import TickerBidWar1v1 from './Ticker/BidWar1v1.vue'
    const bids = nodecg.Replicant('currentBids')

    export default {
        name: 'OmnibarTicker',
        data() {
            return {
                currentComponent: {
                    name: '',
                    data: {},
                },
                timestamp: Date.now(),
                messageTypes: [],
            }
        },
        mounted() {
            NodeCG.waitForReplicants(bids).then(() => {
                this.messageTypes = [
                    /*                 this.gspsPromo(),
                this.charityPromo(),
                this.donationURL(), */
                    this.bidGoal(),
                    this.bidGoal(),
                    this.bidWar1v1(),
                    this.bidWar1v1(),
                ]

                this.showNextMsg()
            })
        },
        methods: {
            showNextMsg() {
                console.log('SHOWING NEXT MESSAGE')
                this.currentComponent =
                    this.$data.messageTypes[
                        Math.floor(
                            Math.random() * this.$data.messageTypes.length
                        )
                    ]
                this.timestamp = Date.now()
            },

            gspsPromo() {
                return this.genericMsg(
                    'Oglądacie&nbsp;<b style="color: #ffbd16">Gramy Szybko, Pomagamy Skutecznie 2021</b>!'
                )
            },

            charityPromo() {
                return this.genericMsg(
                    '<b>Gramy Szybko, Pomagamy Skutecznie 2021</b>&nbsp;wspiera&nbsp;<b style="color: #ffbd16">Fundację ITAKA</b>!'
                )
            },

            donationURL() {
                return this.genericMsg(
                    'Wesprzyj na&nbsp;<b style="color: #ffbd16">gsps.pl/wesprzyj</b>!'
                )
            },

            genericMsg(string) {
                return {
                    name: TickerGenericMessage,
                    data: {
                        msg: string,
                    },
                }
            },

            bidGoal() {
                return {
                    name: TickerBidGoal,
                }
            },

            bidWar1v1() {
                return {
                    name: TickerBidWar1v1,
                }
            },
        },
    }
</script>

<style scoped>
    #Ticker {
        height: 100%;
        min-width: 0;
        flex: 1;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>
