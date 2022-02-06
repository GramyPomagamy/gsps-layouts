<template>
    <div id="bids" class="layout layout-vertical">
        <p id="bids-title">LICYTACJE</p>
        <transition name="fade" mode="out-in">
            <div id="bid" :key="timestamp">
                <div id="bid-info">
                    <p id="bid-game">
                        <b>{{ currentComponent.bid.game }}</b>
                    </p>
                    <p id="bid-desc">{{ currentComponent.bid.description }}</p>
                </div>
                <div id="bid-component">
                    <component
                        :is="currentComponent.name"
                        :key="timestamp"
                        :bid="currentComponent.bid"
                        @end="showNextBid"
                    />
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
    @import url('../../css/styles.css');

    #bids {
        color: white;
        width: 942px;
    }

    #bids-title {
        position: absolute;
        margin: auto;
        font-size: 24px;
        height: 36px;
        font-weight: bold;
        color: white;
        width: 100%;
        text-align: left;
        margin-left: 30px;
    }

    #bid {
        position: absolute;
        top: 28px;
        left: 30px;
    }

    #bid-info {
        position: relative;
        height: 122.4px;
        padding: 6px 0px;
        margin-top: -12px;
        margin-bottom: 50px;
        text-align: left;
        width: 955px;
        text-shadow: 2px 2px 8px #000000;
        line-height: 10px;
    }

    #bid-game,
    #bid-desc {
        font-weight: 400;
        font-size: 32px;
        color: white;
    }

    #bid-component {
        position: absolute;
        top: 130px;
        left: -20px;
        width: 900px;
        height: calc(100% - 130px);
    }
</style>

<script>
    import BidChoiceBinary from './Bids/BidChoiceBinary.vue';
    import BidChoiceMany from './Bids/BidChoiceMany.vue';
    import BidChallenge from './Bids/BidChallenge.vue';

    export default {
        name: 'BreakBids',
        props: ['bids'],
        data() {
            return {
                currentComponent: {
                    name: '',
                    bid: {},
                },
                timestamp: 0,
            };
        },
        components: {
            BidChoiceBinary,
            BidChoiceMany,
            BidChallenge,
        },
        methods: {
            showNextBid() {
                if (!this.bids || this.bids.length <= 0) {
                    return;
                }

                let currentIdx = this.bids.indexOf(
                    this.$data.currentComponent.bid
                );
                let nextIdx = currentIdx + 1;
                if (nextIdx >= this.bids.length) {
                    nextIdx = 0;
                }

                switch (this.bids[nextIdx].type) {
                    case 'choice-binary':
                        this.$data.currentComponent.name = BidChoiceBinary;
                        break;
                    case 'choice-many':
                        this.$data.currentComponent.name = BidChoiceMany;
                        break;
                    case 'challenge':
                        this.$data.currentComponent.name = BidChallenge;
                        break;
                }

                this.$data.currentComponent.bid = this.bids[nextIdx];
                this.$data.timestamp = Date.now();
            },
        },
        mounted() {
            this.showNextBid();
        },
    };
</script>
