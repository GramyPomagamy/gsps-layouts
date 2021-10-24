<template>
    <div
        :style="{
            'background-color': '#3A008B',
            color: 'white',
            height: '36px',
            'font-size': '24px',
            width: '100%',
        }"
    >
        <transition name="fade">
            <span
                v-if="cycle === 0"
                :style="{
                    'margin-top': '-2px',
                    position: 'absolute',
                    left: '0',
                    width: '100%',
                }"
            >
                <b>{{ player.name || '?' }}</b>
            </span>
        </transition>
        <transition name="fade">
            <span
                v-if="cycle === 1"
                :style="{
                    'margin-top': '-2px',
                    position: 'absolute',
                    left: '0',
                    width: '100%',
                }"
            >
                <i
                    :style="{ 'font-size': '20px', 'margin-right': '8px' }"
                    class="fab fa-twitch"
                ></i
                ><b>{{ player.social.twitch || '?' }}</b>
            </span>
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'Player',
        props: ['player', 'cycle'],
    }
</script>

<style scoped>
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 1s;
    }
    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }
</style>
