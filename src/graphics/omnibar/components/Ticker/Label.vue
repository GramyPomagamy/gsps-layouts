<template>
    <div id="label">
        <div id="label-text">
            <span>{{ label }}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'TickerLabel',
        props: ['label'],
    }
</script>

<style scoped>
    #label {
        font-weight: 700;
        height: 66px;
        background-color: #3a008b;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 0;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        min-width: 110px;
    }

    #label-text {
        margin-top: 5px;
        padding-left: 10px;
        padding-right: 10px;
        height: 50%;
    }
</style>
