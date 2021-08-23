<template>
    <div :style="{ 'display': 'flex', 'flex-direction': 'row', 'color': 'white', 'font-size': '20px', 'width': '100%' }">
        <div :style="{ 'background-color': '#3A008B', 'width': '140px', 'font-size': '18px' }">
            <b>
                <template v-if="commentators.amount === 1">Komentator</template>
                <template v-else>Komentatorzy</template>
            </b>
        </div>
        <div id="commentatorNames" :style="{ 'background-color': 'rgb(0,0,0,0.6)', 'width': 'calc(100% - 140px)' }">{{ commentators.names }}</div>
    </div>
</template>

<script>
import fitty from 'fitty';

export default {
    name: 'CommentatorList',
    props: ['commentators'],
    data() {
        return {
            fittyInstance: undefined
        }
    },
    methods: {
        fit() {
            this.$data.fittyInstance = fitty('#commentatorNames', {
                minSize: 1,
                maxSize: 20
            })
        }
    },
    mounted() {
        setTimeout(() => {this.fit()}, 200);
    }
}
</script>