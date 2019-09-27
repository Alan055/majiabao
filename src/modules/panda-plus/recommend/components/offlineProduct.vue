<template lang="html">
    <!-- 三级商户，线下大额贷款 -->
    <div class="model offline-wrap">
        <img v-if="data.entrancepic" :src="data.entrancepic" @click="$root.openUrl({url: data.nextpage.url, isFull: false}, resdata)" />
    </div>
</template>

<script>
    export default {
        props: ['resdata'],
        data() {
            return {}
        },
        computed: {
            data() {
                return this.resdata.thirdproducts;
            },
        }

    }
</script>

<style lang="scss" scoped>

    .offline-wrap {
        padding: 10px $gap;
        padding-bottom: 30px;
        background: white;
    }

    .model{
        img{
            width: 100%;
            display: block;
            margin: 0 auto;
        }
    }



</style>
