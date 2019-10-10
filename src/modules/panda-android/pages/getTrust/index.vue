<template>
    <div class="view get-trust-page">
        <div class="c-layer">
            <div class="pull-down-bg" :style='{height: activeHeight}'></div>
        </div>

        <c-header ref="transparentHeader" class="header transparent c-border-b" :style="`background: rgba(255, 255, 255, ${headerRgba}); color: black;`" title="信用生活" :show="true">
            <span slot="right" v-sina-ads='stat.recommend.message.mess' @click="$root.openUrl(messageUrl);redIcon=false;" class="posi-r">
                    <mt-button><img class="c-icon icon_a" src="~@/assets/images/my/home/an_ao@2x.png"/></mt-button>
            </span>
        </c-header>

        <div class="c-view-content">
            <!-- <div id="blockHeaderContent" class="block-header" ref="transparentBlock"></div> -->

            <!-- 发现 -->
            <div class="m-discover">
                <p class="title">发现</p>
                <div class="c-flex-row">
                    <div class="c-flex-item" @click="handleBannerIconClick(1)">
                        <img src="../../assets/images/tab1.png"/>
                    </div>
                    <div class="c-flex-item" @click="handleBannerIconClick(2)">
                        <img src="../../assets/images/tab2.png"/>
                    </div>
                    <div class="c-flex-item" @click="handleBannerIconClick(3)">
                        <img src="../../assets/images/tab3.png"/>
                    </div>
                    <div class="c-flex-item" @click="handleBannerIconClick(4)">
                        <img src="../../assets/images/tab4.png"/>
                    </div>
                </div>
                <div class="c-flex-row">
                    <div class="c-flex-item">息费透明</div>
                    <div class="c-flex-item">还款灵活</div>
                    <div class="c-flex-item">安全保障</div>
                    <div class="c-flex-item">专业快捷</div>
                </div>
            </div>

            <div class="m-banner c-flex-row">
                <div class="c-flex-item" @click="handleBannerClick()">
                    <img src="../../assets/images/getTrust-banner.png"/>
                </div>
            </div>

            <!-- 借款攻略 -->
            <div class="m-strategy">
                <p class="title">借款攻略</p>
                <div class="c-flex-row">
                    <div class="c-flex-item">
                        <div @click="handleRecordClick(1)" class="strategy-card card-1">
                            <p>还款方式有哪些？</p>
                        </div>
                    </div>
                    <div class="c-flex-item">
                        <div @click="handleRecordClick(2)" class="strategy-card card-2">
                            <p>你真的懂“征信”吗？</p>
                        </div>
                    </div>
                </div>
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
        name: "nopass",
        data() {
            return {
                activeHeight: '40vh',
                headerRgba: 1,

            };
        },
        computed: {

        },
        methods: {
            handleRecordClick(id) {
                console.log('id', id)
                this.$root.nextTitle = '借款攻略';
                this.$router.push({
                    name: 'getTrust/detail' + id,
                    params: {
                        id: id
                    }
                })
            },
            handleBannerClick() {
                this.$root.nextTitle = '借钱就找熊猫钱包';
                this.$router.push({
                    name: 'getTrust/detail0',
                    params: {

                    }
                })
            },
            handleBannerIconClick(id) {
                console.log('id', id)
                this.$root.nextTitle = '熊猫钱包';
                this.$router.push({
                    name: 'getTrust/desc',
                    params: {
                        id: id
                    }
                })
            },
        },
        created() {

        },
        mounted () {
            this.$root.loadingClose();
        },
        onRefresh(tag, data) {
            if (tag == "refresh") {

            }
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

    .get-trust-page {
        .c-view-content {
            box-sizing: border-box;

            .title {
                font-size: 18px;
                color: #353241;
            }

            .m-discover {
                padding: 16px;
                .title {
                    margin-bottom: 16px;
                }

                .c-flex-item {
                    font-size: 12px;
                    color: #333333;

                    img {
                        width: 44px;
                        height: 44px;
                    }
                }
            }

            .m-banner {
                height: 89px;
                width: 100%;
                margin: 24px auto;
                padding: 0 16px;

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 6px;
                }
            }

            .m-strategy {
                color: #FFFFFF;
                .title {
                    padding: 0 16px;
                }

                .strategy-card {
                    border-radius: 6px;
                    height: 100px;
                    margin-top: 11px;
                    text-align: left;
                    font-size: 14px;

                    p {
                        margin-left: 20px;
                        padding-top: 16px;
                    }
                }
                .card-1 {
                    background: url('../../assets/images/card_1@2x.png') no-repeat;
                    background-size: cover;
                    margin-left: 6px;
                }

                .card-2 {
                    background: url('../../assets/images/card_2@2x.png') no-repeat;
                    background-size: cover;
                    margin-right: 6px;
                }
            }
        }
    }
</style>
