<template>
    <div id="label">
        <div id="label-text">
            <span>{{ label }}</span>
        </div>
    </div>
</template>

<script>
    import gsap from 'gsap'

    export default {
        name: 'TickerLabel',
        props: ['label'],
        mounted() {
            const labelAnim = () => {
                gsap.fromTo(
                    '#label',
                    { clipPath: 'inset(0 100% 0 0)' },
                    { clipPath: 'inset(0 0% 0 0)', duration: 0.5 }
                )
            }
            labelAnim()
        },
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
