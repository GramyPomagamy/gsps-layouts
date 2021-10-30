<template>
    <div id="container">
        <img id="Background" src="../img/layouts/standard_2.png" />

        <div v-if="activeRun" id="runners">
            <div v-if="activeRun.teams[0]" id="team1">
                <template v-for="player in activeRun.teams[0].players">
                    <player
                        :key="player.id"
                        class="Player"
                        :cycle="nameCycle"
                        :player="player"
                    />
                </template>
                <transition name="fade">
                    <div
                        class="finish"
                        :style="{ left: '655px' }"
                        v-if="
                            timer.teamFinishTimes[activeRun.teams[0].id] &&
                            timer.teamFinishTimes[activeRun.teams[0].id]
                                .state === 'completed'
                        "
                    >
                        <div
                            id="placement-background"
                            :style="{
                                width: '20%',
                                position: 'absolute',
                                'background-color': '#ffbd16',
                                height: '100%',
                                left: '144px',
                            }"
                        ></div>
                        <span
                            :style="{
                                width: '80%',
                                float: 'left',
                                'margin-top': '-3px',
                                'z-index': '3',
                            }"
                            ><b>{{
                                timer.teamFinishTimes[activeRun.teams[0].id]
                                    .time
                            }}</b></span
                        >
                        <span
                            :style="{
                                width: '20%',
                                left: '144px',
                                height: '100%',
                                color: 'black',
                                'margin-top': '-4px',
                                'z-index': '3',
                                position: 'absolute',
                            }"
                        >
                            {{ team1Placement }}
                        </span>
                    </div>
                </transition>

                <commentator-list
                    :commentators="commentators"
                    v-if="
                        activeRun.teams[0].players.length < 2 &&
                        commentators.amount > 0
                    "
                    id="commentators"
                />
            </div>
            <div v-if="activeRun.teams[1]" id="team2">
                <template v-for="player in activeRun.teams[1].players">
                    <player
                        :key="player.id"
                        class="Player"
                        :cycle="nameCycle"
                        :player="player"
                    />
                </template>
                <transition name="fade">
                    <div
                        class="finish"
                        :style="{ right: '644px' }"
                        v-if="
                            timer.teamFinishTimes[activeRun.teams[1].id] &&
                            timer.teamFinishTimes[activeRun.teams[1].id]
                                .state === 'completed'
                        "
                    >
                        <div
                            id="placement-background"
                            :style="{
                                width: '20%',
                                position: 'absolute',
                                'background-color': '#ffbd16',
                                height: '100%',
                            }"
                        ></div>
                        <span
                            :style="{
                                width: '80%',
                                float: 'right',
                                'margin-top': '-3px',
                                'z-index': '3',
                            }"
                            ><b>{{
                                timer.teamFinishTimes[activeRun.teams[1].id]
                                    .time
                            }}</b></span
                        >
                        <span
                            :style="{
                                width: '20%',
                                right: '144px',
                                height: '100%',
                                color: 'black',
                                'margin-top': '-4px',
                                'z-index': '3',
                                position: 'absolute',
                            }"
                        >
                            {{ team2Placement }}
                        </span>
                    </div>
                </transition>

                <reader-name
                    :reader="reader"
                    v-if="activeRun.teams[1].players.length < 2 && reader"
                    id="reader"
                />
            </div>
        </div>
        <run-info
            id="RunInfo"
            v-if="activeRun"
            :run="activeRun"
            :maxTitleSize="43"
        />
        <timer-view id="timer" />
        <sponsors-view id="sponsors" :sponsors="sponsors" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator'
    import type {
        RunDataActiveRun,
        Timer,
    } from 'nodecg/bundles/nodecg-speedcontrol/src/types/schemas'
    import type {
        NameCycle,
        Commentators,
        Reader,
    } from '@gsps-layouts/types/schemas'
    import type { Asset } from '@gsps-layouts/types'
    import { Getter } from 'vuex-class'
    import TimerView from '../_misc/components/Timer.vue'
    import RunInfo from '../_misc/components/RunInfo.vue'
    import Player from '../_misc/components/Player.vue'
    import CommentatorList from '../_misc/components/Commentator.vue'
    import ReaderName from '../_misc/components/Reader.vue'
    import SponsorsView from '../_misc/components/Sponsors.vue'

    @Component({
        components: {
            TimerView,
            RunInfo,
            Player,
            CommentatorList,
            ReaderName,
            SponsorsView,
        },
    })
    export default class extends Vue {
        @Getter readonly activeRun!: RunDataActiveRun
        @Getter readonly nameCycle!: NameCycle
        @Getter readonly commentators!: Commentators
        @Getter readonly reader!: Reader
        @Getter readonly sponsors!: Asset[]
        @Getter readonly timer!: Timer
        data() {
            return {
                numRunners: 0,
            }
        }

        get team1Placement() {
            if (this.timer.teamFinishTimes[this.activeRun.teams[1].id]) {
                if (
                    this.timer.teamFinishTimes[this.activeRun.teams[0].id]
                        .milliseconds -
                        this.timer.teamFinishTimes[this.activeRun.teams[1].id]
                            .milliseconds <
                    0
                ) {
                    return 1
                } else {
                    return 2
                }
            } else {
                return 1
            }
        }

        get team2Placement() {
            if (this.timer.teamFinishTimes[this.activeRun.teams[0].id]) {
                if (
                    this.timer.teamFinishTimes[this.activeRun.teams[1].id]
                        .milliseconds -
                        this.timer.teamFinishTimes[this.activeRun.teams[0].id]
                            .milliseconds <
                    0
                ) {
                    return 1
                } else {
                    return 2
                }
            } else {
                return 1
            }
        }

        mounted() {
            this.activeRun!.teams.forEach((team: any) => {
                this.$data.numRunners += team.players.length
            })

            this.$watch(
                function () {
                    return this.activeRun
                },
                function () {
                    this.$data.numRunners = 0
                    this.activeRun!.teams.forEach((team: any) => {
                        this.$data.numRunners += team.players.length
                    })
                }
            )
        }
    }
</script>

<style>
    @import url('../css/styles.css');

    #container {
        text-align: center;
    }

    #Background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        z-index: -1;
    }

    #timer {
        left: 686.4px;
        bottom: 15px;
        height: 78px;
        width: 547.2px;
        font-size: 67.2px;
        z-index: 2;
        position: absolute;
    }

    #bottomLeft {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 583px;
        width: 578px;
        height: 430px;
    }

    html {
        display: block;
        width: 1920px;
        height: 1014px;
    }

    #RunInfo {
        position: absolute;
        bottom: 35px;
        width: 634.8px;
        height: 160px;
    }

    #runners {
        top: 720px;
        width: 100%;
        font-size: 28.8px;
        left: -11px;
        position: absolute;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .Player {
        position: relative;
        margin-bottom: 0px;
        width: 640px;
    }

    #team1 {
        right: 1280px;
        align-self: flex-start;
        display: flex;
        flex-direction: column;
    }

    #team2 {
        left: 1280px;
        align-self: flex-start;
        display: flex;
        flex-direction: column;
    }

    #commentators {
        position: relative;
        margin-bottom: 0px;
        width: 640px;
    }

    #reader {
        position: relative;
        margin-bottom: 0px;
        width: 640px;
    }

    #sponsors {
        position: absolute;
        bottom: 24px;
        right: 0px;
        width: 640px;
        height: 180px;
        /* 		background-color: aqua; */
    }

    .finish {
        width: 180px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        display: inline;
        position: absolute;
        height: 36px;
        top: 2px;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.2s;
    }
    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }
</style>
