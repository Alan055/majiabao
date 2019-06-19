<template>
    <div class="view">
        <div class="c-layer">
            <div class="pull-down-bg" :style='{height: activeHeight}'></div>
        </div>

        <div class="c-layer header-layer">
            <c-header ref="transparentHeader" class="header transparent" :style="`background: rgba(81, 67, 83, ${headerRgba}); opacity: ${headerOpacity}`" title="猛下款" :show="true">
                <span slot="right" v-sina-ads='stat.recommend.message.mess' @click="$root.openUrl(messageUrl);redIcon=false;" class="posi-r">
                        <mt-button><img class="c-icon icon_a" src="~@/assets/images/my/home/an_ao@2x.png"/></mt-button>
                        <span v-if="redIconShow" :class="['red-icon', ['red-icon-one', 'red-icon-two', 'red-icon-three'][redIconCount.length - 1]]">{{redIconCount}}</span>
                </span>
            </c-header>
        </div>

        <div class="c-view-content">
            <div class="content-bg">
                <img src="~@/assets/images/mxk/no-pass-bg.png" alt="">
            </div>

            <div class="content-main">
                <img src="~@/assets/images/mxk/no-pass-icon.png" alt="">
                <p class="title">审批未通过</p>
                <p class="sub-title">很遗憾，目前暂无适合您的贷款产品</p>
            </div>

            <div class="content-bottom">
                <div class="list">
                    <img src="~@/assets/images/mxk/nopass-one.png" alt="">
                    <p class="title">额度更优</p>
                    <p class="sub-title">精准匹配 最高20万</p>
                </div>
                <div class="list">
                    <img src="~@/assets/images/mxk/nopass-two.png" alt="">
                    <p class="title">极速审核</p>
                    <p class="sub-title">线上申请 极速放款</p>
                </div>
                <div class="list">
                    <img src="~@/assets/images/mxk/nopass-three.png" alt="">
                    <p class="title">期限灵活</p>
                    <p class="sub-title">3-12月 自由选择择</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import api from "@/services/api";
    import util from "@/utils";

    export default {
        name: "nopass",
        data() {
            return {
                redIconShow: false,
                redIconCount: '0',
                pullDown: true,
                headerOpacity: 1,
                headerRgba: 0,
                activeHeight: "50vh",
            };
        },
        computed: {

        },
        methods: {

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
    .header-layer {
        position: relative;
        z-index: 1;
    }
    .content-bg {
        img {
            width: 100%;
        }
    }

    .content-main {
        background: #FFFFFF;
        box-shadow: 0 2px 10px 0 rgba(0,0,0,0.10);
        border-radius: 8px;
        width: 343px;
        height: 335px;
        position: absolute;
        left: 4.3%;
        top: 10%;
        text-align: center;

        img {
            margin-top: 60px;
            height: 128px;
        }
        .title {
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #999999;
            letter-spacing: 0;
            text-align: center;
            margin-top: 40px;
        }
        .sub-title {
            @extend .title;
            font-size: 14px;
            margin-top: 2px;
        }
    }

    .content-bottom {
        margin-top: 200px;
        display: flex;
        justify-content: center;

        .list {
            width: 33.333%;
            text-align: center;
            padding: 0 8px;

            img {
                height: 44px;

            }
            .title {
                font-family: PingFangTC-Medium;
                font-size: 16px;
                color: #333333;
                letter-spacing: 0;
                text-align: center;
            }

            .sub-title {
                font-family: PingFangTC-Regular;
                font-size: 12px;
                color: #333333;
                letter-spacing: 0;
                text-align: center;
            }
        }
    }

</style>
