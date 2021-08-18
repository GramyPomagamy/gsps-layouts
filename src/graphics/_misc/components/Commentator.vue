<template>
    <div :style="{ 'display': 'flex', 'flex-direction': 'row', 'color': 'white', 'font-size': '20px', 'width': '100%' }">
        <div :style="{ 'background-color': '#3A008B', 'width': '140px', 'font-size': '18px' }"><b>Komentatorzy</b></div>
        <div id="commentatorNames" :style="{ 'background-color': 'rgb(0,0,0,0.6)', 'width': 'calc(100% - 140px)' }">PokerFacowaty, hoxi, Mr. Mary</div>
    </div>
</template>

<script>
import fitty from 'fitty';

export default {
    name: 'Commentators',
    props: ['maxSize'],
    data() {
        return {
            fittyInstance: undefined
        }
    },
    methods: {
        fit() {
            this.$data.fittyInstance = fitty('#commentatorNames', {
                minSize: 12,
                maxSize: this.maxSize
            })
        }
    },
    mounted() {
        setTimeout(() => {this.fit()}, 200);
    }
}
</script>