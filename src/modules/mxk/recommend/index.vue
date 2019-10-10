<template lang="html">
    <div class="view" v-show="pageShow">
        <div class="c-layer">
            <div class="pull-down-bg" :style='{height: activeHeight}'></div>
        </div>

        <div class="c-layer">
            <c-header
                class="header transparent"
                :style="`background: rgba(39, 58, 102, ${headerRgba}); opacity: ${headerOpacity}`"
                :title="appName"
                :show="true"
            >
                <span slot="right" v-sina-ads='stat.recommend.message.mess' @click="$root.openUrl(messageUrl);redIcon=false;" class="posi-r">
                    <mt-button><img class="c-icon icon_a" src="~@/assets/images/my/home/an_ao@2x.png"/></mt-button>
                    <span v-if="redIconShow" :class="['red-icon', ['red-icon-one', 'red-icon-two', 'red-icon-three'][redIconCount.length - 1]]">{{redIconCount}}</span>
                </span>
            </c-header>
        </div>

        <!-- :enableRefresh="false" -->
        <scroller
            :on-refresh="refresh"
            :offset="100"
            :bounce="80"
            :maxScrollerHeight="160"
            :power="1.5"
            @refreshFinsh="refreshFinsh"
            @onScroll="onScroll"
            @onPulling="onPulling"
        >
            <div class="container">
                <div class="main" style="padding-top: 15px;">
                    <div class="block-header">
                        <c-header :transparent="true" :show="true" title=""></c-header>
                    </div>

                    <!-- 专属推荐（new卡） -->
                    <recommend class="section" :resdata="data"/>

                    <!-- 借还记录 -->
                    <record class="section transparent-gap" :resdata="data"/>

                    <!-- 获取更多额度 -->
                    <multi-apply class="section" :resdata="data"/>

                    <!-- 秒下款 -->
                    <secondRemittance v-if="data.mxkproducts" :resData="data.mxkproducts" />

                    <div class="section" v-if="data.rejectpage" v-sina-ads="stat.recommend.refuse.open">
                        <!-- <mt-cell title="拒件记录" is-link ></mt-cell> -->
                        <mt-cell title="拒件记录" is-link @click.native="$root.openUrl(data.rejectpage, data)"></mt-cell>
                    </div>
                    <!-- <other-recommend class="section" :resdata="data" /> -->
                </div>

                <!-- 商业化地址 -->
                <!-- http://192.168.22.131:8001/map2.html -->
                <credit-card class="section iframe-section"
                             :style="`height: ${creditCardHeight}`"
                             :iframeUrl="iframeUrl"
                />

                <!-- 线下三级商户 -->
                <offline-product class="section" :resdata="data"/>

                <!-- 右边悬浮动图 -->
                <div class="king-home-floatimg" v-if="floatimgurl" @click="$root.openUrl(floatimgJumplink)"
                     :style="`top: ${floatimgRightPx}`">
                    <img :src="floatimgurl">
                </div>
            </div>
        </scroller>
    </div>
</template>

<script>
    import recommend from "./components/recommend";
    import record from "./components/record";
    import multiApply from "./components/multiApply";
    import offlineProduct from "./components/offlineProduct";
    import otherRecommend from "./components/otherRecommend";
    import creditCard from "@/components/view/cMarket";
    import storage from "@/utils/storage";
    import ScrollControl from "@/utils/ScrollControl";
    import scroller from "@/components/view/scroller";
    import helper from "@/utils/helper";
    import util from "@/utils";
    import api from "@/services/api";
    import EventBus from "@/services/EventBus";
    import {Toast, Indicator} from "@/utils/helper";
    import MaxentSDK from "@/services/MaxentSDK";

    import AppBridge from "@/services/AppBridge.js";
    import secondRemittance from "./components/secondRemittance";


    // 资方特殊流程
    function resolveQueue(data) {
        if (!data) return;
        data.forEach(item => {
            // 玖富
            if (item.type == 1) {
                resolveMaxent(item);
            }
            // ...
        });
    }

    // 保存玖富tick
    function resolveMaxent(data) {
        let tick = util.getParams("fromUserId") + new Date().getTime();
        MaxentSDK.init(util.getParams("fromUserId"));
        MaxentSDK.active(tick).then(status => {
            if (!status) return;
            api.loan.jiufu.saveTicket({
                requestType: "1",
                productid: data.productid,
                type: "1",
                tick,
                fundproductid: util.getParams()["productid"] || "",
            });
        });
    }

    export default {
        data() {
            return {
                pageShow: false,
                data: {},
                messageUrl: process.env.path + "/pages/my/index.html#/message", //消息中心
                helpUrl: process.env.path + "/pages/my/index.html#/help", //帮助中心
                iframeUrl: "",
                redIconShow: false,
                redIconCount: '0',
                pullDown: true,
                headerOpacity: 1,
                headerRgba: 0,
                activeHeight: "68vh",
                creditCardHeight: 'auto', //商业地址高度
                floatimgurl: "", //悬浮图标地址
                floatimgRightPx: "0", //悬浮图标距离右边屏幕距离
                floatimgJumplink: "" //悬浮图标点击跳转地址
            };
        },
        components: {
            recommend,
            record,
            multiApply,
            offlineProduct,
            otherRecommend,
            creditCard,
            secondRemittance,
            scroller
        },
        methods: {
            //刷新
            async refresh(cb) {
                await this.fetchData();
                await this.getmarketinfo();
                await this.redData();
                console.log('数据刷新成功');
                setTimeout(() => {
                    this.headerOpacity = 1;
                    cb && cb()
                }, 1000)
            },
            //top 距离顶部的像素点
            onPulling(top) {
                if(top && top > 0){
                    this.headerOpacity = 1 - top/30;
                }
            },
            //滚动中
            onScroll(e) {
                let scrollTop = e.target.scrollTop;
                this.floatimgRightPx = scrollTop + 300 + "px";
                if (scrollTop <= 100) {
                    this.headerRgba = scrollTop / 100;
                } else {
                    this.headerRgba = 1;
                    this.headerOpacity = 1; //解决正在刷新时又上滑透明度不还原问题
                }
            },
            refreshFinsh() {
                setTimeout(() => {
                    this.headerOpacity = 1;
                }, 200)
            },
            postMessageHandle(value) {
                if(value && typeof value == 'number'){
                    this.$nextTick(() => {
                        this.creditCardHeight = value + 'px';
                    })
                }
            },
            redData() {
                //红点查询
                console.log("kashi");
                api.user.message
                    .redDot({
                        pageCode: 2001004, //活动消息
                        productId: 2001,
                        token: util.getParams("token") || storage.get("token") || ""
                    })
                    .then(res => {
                        if (!helper.isSuccess(res)) return;
                        if(res.data.messageCenterTotal && res.data.messageCenterTotal >0){
                            this.redIconShow = true;
                            if(res.data.messageCenterTotal > 99){
                                this.redIconCount = '99+'
                            }else{
                                this.redIconCount = String(res.data.messageCenterTotal)
                            }
                        }
                    });
            },
            // 刷新数据
            fetchData(tag) {
                if (tag) {
                    console.log(`return 伪协议 调用 `);
                    AppBridge.getHomeData({}, res => {
                        if (helper.isSuccess(res)) {
                            console.log("收到伪协议的数据了！");
                            this.data = res.data;
                            this.$nextTick(() => {
                                this.pageShow = true;
                            })
                            resolveQueue(this.data.productext);
                        }
                    });
                } else {
                    api.home
                        .getHomePage()
                        .then(res => {
                            if (helper.isSuccess(res)) {
                                this.data = res.data;
                                this.$nextTick(() => {
                                    this.pageShow = true;
                                })
                                resolveQueue(this.data.productext);
                            }
                        })
                        .finally(this.$root.loadingClose);
                }
            },
            getmarketinfo() {
                api.activity
                    .getAppMarketInfo({
                        pageid: "1001",
                        token: util.getParams("token") || storage.get("token") || ""
                    })
                    .then(res => {
                        if (res.code == 200) {
                            this.iframeUrl = res.data.jumplink;
                        }
                    });
            }
        },
        created() {
            this.fetchData();
            this.getmarketinfo();
            this.redData();
        },
        mounted() {
            EventBus.$on("postMessage", this.postMessageHandle);
        },
        onRefresh(tag, data) {
            if (tag == "home" || tag == "refresh") {
                // this.$root.loadingClosed && Indicator.open()
                this.fetchData(tag);
                this.redData();
                this.getmarketinfo();
            }
        }
    };
</script>

<style lang="scss" scoped>
    .view {
        transform: translateX(0);

        /deep/ .inner {
            top: 0rem !important;
            margin-top: -2rem;
        }
        /deep/ {
            .pull-refresh {
                background-color: transparent !important;
                height: 1.2rem !important;
                padding: 0 !important;
            }
        }

        /deep/ .multi-apply-wrap {
            button {
                background-color: #2967FF;
                background-image: none;
            }
        }
    }


    .container {
        z-index: 1;
        position: relative;
        background: #fff;
        background-image: url('../images/H5_bg@2x.png');
        background-repeat: no-repeat;
        background-size: 100% 246px;
    }

    .bg {
        height: 100vh;
        background: white;
        position: relative;
        z-index: -1;
        img {
            display: block;
            width: 100%;
            position: relative;
            z-index: -1;
        }
    }

    .pull-down-bg {
        background-image: linear-gradient(90deg, #273966 0%, #071f58 100%);
        position: relative;
        z-index: -1;
    }

    .header {
        position: relative;
        z-index: 1;
        // transition: background .3s;
        &.show {
            background: #514353 !important;
            color: white !important;
        }
    }

    .section + .section {
        border-top: 8px solid #f4f4f4;
    }

    .section.transparent-gap {
        border-color: transparent;
    }

    .posi-r {
        position: relative;
    }

    .red-icon {
        font-family: PingFangSC-Regular;
        font-size: 18px;
        color: #FFFFFF;
        position: absolute;
        display: inline-block;
        text-align: center;
        background-color: #e72427;
        transform: scale(0.5);
    }

    .red-icon-one {
        height: 24px;
        line-height: 24px;
        width: 24px;
        top: -11px;
        right: -12px;
        border-radius: 50%;
    }

    .red-icon-two {
        height: 24px;
        line-height: 24px;
        width: 36px;
        border-radius: 36px;
        top: -14px;
        right: -20px;
    }

    .red-icon-three {
        height: 24px;
        line-height: 24px;
        width: 40px;
        border-radius: 40px;
        top: -13px;
        right: -22px;
    }

    .iframe-section {
        border-top: 8px solid #f4f4f4;
    }

    .king-home-floatimg {
        position: fixed;
        top: 60%;
        right: 0;
        height: 67px;
        width: 67px;
        // transition: all .5s;

        img {
            width: 100%;
            height: auto;
        }
    }
</style>
