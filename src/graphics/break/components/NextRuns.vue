<template>
    <div id="next-runs">
        <p id="runs-title">NADCHODZĄCE RUNY</p>
        <transition name="fade" mode="out-in">
            <div id="runs" :key="runs">
                <div>
                    <div
                        v-if="runs[0]"
                        :style="{
                            marginBottom: '30px',
                        }"
                    >
                        <div
                            class="name layout layout-horizontal layout-center"
                        >
                            <p class="name-text">{{ runs[0].game }}</p>
                        </div>
                        <div class="info">
                            <p class="info-category">
                                {{ runs[0].category || 'Any%' }}
                            </p>
                        </div>
                        <div class="info">
                            <p class="info-runner">
                                {{ formatPlayers(runs[0]) }}
                            </p>
                        </div>
                    </div>
                    <div
                        v-if="runs[1]"
                        :style="{
                            marginBottom: '30px',
                        }"
                    >
                        <div
                            class="name layout layout-horizontal layout-center"
                        >
                            <p class="name-text">{{ runs[1].game }}</p>
                        </div>
                        <div class="info">
                            <p class="info-category">
                                {{ runs[1].category || 'Any%' }}
                            </p>
                        </div>
                        <div class="info">
                            <p class="info-runner">
                                {{ formatPlayers(runs[1]) }}
                            </p>
                        </div>
                    </div>
                    <div v-if="runs[2]">
                        <div
                            class="name layout layout-horizontal layout-center"
                        >
                            <p class="name-text">{{ runs[2].game }}</p>
                        </div>
                        <div class="info">
                            <p class="info-category">
                                {{ runs[2].category || 'Any%' }}
                            </p>
                        </div>
                        <div class="info">
                            <p class="info-runner">
                                {{ formatPlayers(runs[2]) }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import fitty from 'fitty'

    export default {
        name: 'BreakNextRuns',
        props: ['runs'],
        methods: {
            formatPlayers(run) {
                return (
                    run.teams
                        .map(
                            (team) =>
                                team.name ||
                                team.players
                                    .map((player) => player.name)
                                    .join(', ')
                        )
                        .join(' vs. ') || 'Bez gracza'
                )
            },
            fitText() {
                setTimeout(() => {
                    fitty('.name-text', {
                        minSize: 1,
                        maxSize: 40,
                    })
                }, 340)
            },
        },
        watch: {
            runs: {
                handler: function () {
                    this.fitText()
                },
                immediate: true,
                deep: true,
            },
        },
        mounted() {
            this.fitText()
        },
    }
</script>

<style scoped>
    #runs-title {
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

    #runs {
        position: absolute;
        top: 45px;
        width: 100%;
    }

    .run {
        display: flex;
        flex-direction: column;
    }

    .name {
        top: 0px;
        width: 100%;
        height: 30px;
        box-sizing: border-box;
        text-shadow: black 2px 2px 8px;
    }

    .name-text {
        font-size: 40px;
        color: #ffffff;
        margin-left: 27px;
        margin-right: auto;
        font-weight: 600;
    }

    .info {
        width: 100%;
        height: 27.6px;
        vertical-align: middle;
        text-shadow: black 2px 2px 8px;
    }

    .info-category {
        position: relative;
        line-height: normal;
        font-size: 28.8px;
        letter-spacing: -0.06em;
        color: #ffffff;
        padding: 0 28.8px;
        white-space: nowrap;
        margin-right: auto;
        margin-top: 10px;
    }

    .info-runner {
        position: relative;
        top: -18px;
        line-height: normal;
        font-size: 28.8px;
        letter-spacing: -0.05em;
        color: #ffffff;
        padding: 0 28.8px;
        white-space: nowrap;
        margin-right: auto;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.3s;
    }
    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }

    .layout {
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
    }

    .layout-horizontal {
        -ms-flex-direction: row;
        -webkit-flex-direction: row;
        flex-direction: row;
    }

    .layout-center {
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
    }
</style>
