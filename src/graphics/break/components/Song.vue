<template>
    <div id="song">
        <p
            :style="{
                textAlign: 'right',
            }"
        >
            <b>OBECNA PIOSENKA</b>
        </p>

        <transition name="fade" mode="out-in">
            <div class="marquee" id="song-name">
                <p>Skillet - Awake and Alive</p>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'BreakSong',
        props: ['song'],
    }
</script>

<style scoped>
    @import url('../../css/styles.css');

    #song {
        font-size: 26.4px;
        color: white;
        margin-left: 12px;
    }

    #song-name {
        margin-top: -30px;
        margin-bottom: 12px;
        text-shadow: black 2px 2px 8px;
        height: 38px;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.3s;
    }
    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }
</style>
