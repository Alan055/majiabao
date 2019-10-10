<template>
    <div class="view trust-desc-page">
        <div class="c-layer">
            <div class="pull-down-bg" :style='{height: activeHeight}'></div>
        </div>

        <div class="c-view-content">
            <div class="m-img-part m-img-part1" ref="module1" >
                <img src="../../assets/images/part_1.png">
            </div>
            <div class="m-img-part m-img-part2" ref="module2" >
                <img src="../../assets/images/part_2.png">
            </div>
            <div class="m-img-part m-img-part3" ref="module3" >
                <img src="../../assets/images/part_3.png">
            </div>
            <div class="m-img-part m-img-part4" ref="module4" >
                <img src="../../assets/images/part_4.png">
            </div>
            <div class="m-img-part m-img-part5" ref="module5" >
                <img src="../../assets/images/part_5.png">
            </div>
        </div>

    </div>
</template>

<script>
    import axios from 'axios'
    import api from "@/services/api";
    import util from "@/utils";
    import helper from "@/utils/helper";

    export default {
        name: "desc",
        data() {
            return {
                pageShow: false,
                activeHeight: '40vh',
                headerRgba: 1,

            };
        },
        computed: {

        },
        created() {

        },
        mounted () {
            this.$root.getRouteData().then(params => {
                this.$nextTick(() => {
                    setTimeout(() => {
                        console.log('params', params)
                        if(params.id){
                            this.$refs['module' + (params.id + 1)].scrollIntoView({
                                behavior: "smooth"
                            });
                        }
                    }, 400)
                })
            })
            this.$root.loadingClose();
        }
    };
</script>

<style lang="scss" scoped>
    .pull-down-bg {
        background-image: #fff;
        position: absolute;
        z-index: -1;
        width: 100%;
    }
    .block-header {
        display: block;
        background: transparent;
        height: 64px;
    }

    .trust-desc-page {
        .c-view-content {
            .m-img-part {
                img {
                    height: 100%;
                    width: 100%;
                }
            }
        }
    }
</style>
