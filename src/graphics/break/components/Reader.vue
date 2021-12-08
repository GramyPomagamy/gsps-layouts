<template>
    <div id="reader">
        <p id="reader-title"><b>OBECNY CZYTAJĄCY</b></p>
        <transition name="fade" mode="out-in">
            <p id="reader-name" :key="reader">{{ reader }}</p>
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'BreakReader',
        props: ['reader'],
    }
</script>

<style scoped>
    #reader {
        font-size: 26.4px;
        color: white;
        margin-left: 12px;
    }

    #reader-name {
        margin-top: -30px;
        text-shadow: black 2px 2px 8px;
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
