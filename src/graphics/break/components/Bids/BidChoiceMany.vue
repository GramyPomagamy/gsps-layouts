<template>
    <div id="bid">
        <div class="option" v-for="option in bid.options" :key="option.name">
            {{ option.name }}
        </div>
    </div>
</template>

<script>
    export default {
        name: 'BidChoiceMany',
        props: ['bid'],
        mounted() {
            setTimeout(() => {
                this.$emit('end')
            }, 2000)
        },
    }
</script>
