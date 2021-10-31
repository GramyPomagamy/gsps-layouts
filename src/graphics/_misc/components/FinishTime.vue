<template>
    <span>
        <template v-if="side === 'right'">
            <div class="finish">
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
                    ><b>{{ time }}</b></span
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
                    {{ place }}
                </span>
            </div>
        </template>
        <template v-else-if="side === 'left'">
            <div class="finish">
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
                    ><b>{{ time }}</b></span
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
                    {{ place }}
                </span>
            </div>
        </template>
    </span>
</template>

<script>
    export default {
        name: 'FinishTime',
        props: ['time', 'place', 'side'],
    }
</script>

<style scoped>
    .finish {
        width: 180px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        display: inline;
        position: absolute;
        height: 36px;
        top: 2px;
    }
</style>
