<template lang="html">
    <!-- 一键申请 -->
    <div class="multi-apply-wrap" v-if="data && data.length">
        <div class="multi-apply-img" @click="apply">
            <img src="../../images/rectangle.png">
        </div>
    </div>

</template>

<script>
    import helper from "@/utils/helper";

    export default {
        props: ["resdata"],
        data() {
            return {
                
            };
        },
        computed: {
            data() {
                return this.resdata.resecondproducts;
            },
            url() {
                return this.resdata.onekeyapplypage;
            },
            titleColor() {
                let { newcards, applyproducts } = this.resdata;
                return (!newcards || !newcards.length) &&
                (!applyproducts || !applyproducts.length)
                    ? "white"
                    : "";
            }
        },
        components: {
            
        },
        methods: {
            apply() {
                this.$root.openUrl(this.url, this.resdata);
            }
        },
        mounted() {
            if(this.resdata.resecondproducts){
                helper.set(
                    "productlist",
                    JSON.stringify(this.resdata.resecondproducts)
                );
            }
        },
        filters: {
            amount(value) {
                if (value < 10000) {
                    return value;
                } else {
                    value = (value / 10000).toFixed(1).replace(".0", "");
                    return value + "万";
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    .c-list-title {
        &.white {
            color: white;
        }
    }
    .multi-apply-wrap {
        padding: 10px 13px;
        overflow: hidden;
        background: white;

        .multi-apply-img {
            height: 110px;
            width: 100%;

            img {
                width: 100%;
                height: auto;
            }
        }
    }
    
</style>
