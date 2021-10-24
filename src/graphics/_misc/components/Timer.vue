<template>
    <b
        id="timer"
        :style="{ color: '#a5a3a3', 'text-shadow': 'black 2px 2px 8px' }"
        >{{ timer.time }}</b
    >
</template>

<script>
    const timer = nodecg.Replicant('timer', 'nodecg-speedcontrol')
    const timerColors = {
        running: 'white',
        finished: '#ffbd16',
        stopped: '#a5a3a3',
        paused: '#a5a3a3',
    }
    import gsap from 'gsap'

    export default {
        name: 'Timer',
        data() {
            return {
                timer: [],
            }
        },
        mounted() {
            timer.on('change', (newVal) => {
                this.timer = newVal
                gsap.to(document.getElementById('timer'), {
                    duration: 1,
                    color: timerColors[newVal.state],
                })
            })
        },
    }
</script>
