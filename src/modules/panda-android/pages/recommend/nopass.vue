<template lang="html">
    <div class="view">
        <div class="c-layer">
            <c-header ref="transparentHeader" class="header transparent" :title="appName2" :show="true">
            </c-header>
        </div>
        <div class="c-view-content">
            <div class="nopass-content">
                <div id="blockHeaderContent" class="block-header" ref="transparentBlock"></div>

                <div class="header-content">
                    <span class="center">
                        <img src="../../assets/images/loan-logo@2x.png"/>
                        <span class="header-desc">大额借款首选</span>
                    </span>
                    <span class="posi-r right" v-sina-ads='stat.recommend.message.mess'
                          @click="$root.openUrl(messageUrl);redIcon=false;">
                        <img class="c-icon icon_b" src="../../assets/images/message@2x.png"/>
                        <span v-if="redIconShow"
                              :class="['red-icon', ['red-icon-one', 'red-icon-two', 'red-icon-three'][redIconCount.length - 1]]">{{redIconCount}}</span>
                    </span>
                </div>
            </div>

            <div class="no-pass" v-if="homeData.withdrawProducts.length==0">
                抱歉，您当前暂没有匹配的商户~
            </div>

            <!-- 专属推荐（new卡） -->
            <newcards :resdata="homeData" v-if="homeData.newcards && isShowNewCards"/>

            <record class="section transparent-gap" :resdata="homeData"
                    v-if="homeData.withdrawProducts && homeData.withdrawProducts.length"/>

            <!-- 贷超 -->
            <credit-card class="section iframe-section" :style="`height: ${creditCardHeight};`"
                         v-if="iframeUrl && isShowIframeUrl == 1" :iframeUrl="iframeUrl"/>

            <offline-product class="section" v-if="homeData.thirdproducts" :resdata="homeData"/>

            <!-- 在线客服 -->
            <!--<div class="section kefu-content" v-if="homeData.apiFinish"-->
                 <!--@click="$root.openUrl({url: onlineServiceUrl, title: '在线客服'})">-->
                <!--<img src="../../assets/images/kefu-banner.png"/>-->
            <!--</div>-->
            <!--广告位-->
            <banner pageId="1001"></banner>

            <template v-if="!isInit">
                <!-- 判断是否超过1屏幕，如未超过添加class-->
                <watermark v-if="homeData.withdrawProducts.length==0" class="el-watermark-noScreen"/>
                <watermark v-else/>
            </template>

        </div>

        <rongze-dialog :visibility="homeData.xm_driverPopConfig != ''"
                       :data="homeData.xm_driverPopConfig"></rongze-dialog>

        <jitter v-if="jitterArgs.isShow" :start.sync="jitterArgs.isStart" @jitterClick="jitterClick"
                :icon="driver.xm_driverSuspensionWindowConfig.imgurl"/>


    </div>
</template>

<script>
    import newcards from "./components/newcards";
    import record from "./components/record";
    import broadcast from "./components/broadcast";
    import offlineProduct from "./components/offlineProduct";
    import multiApply from "./components/multiApply";
    import secondRemittance from "./components/secondRemittance";
    import creditCard from "@/components/view/cMarket";
    import storage from "@/utils/storage";
    import scroller from "@/components/view/scroller";
    import helper from "@/utils/helper";
    import util from "@/utils";
    import api from "@/services/api";
    import EventBus from "@/services/EventBus";
    import {Toast, Indicator} from "@/utils/helper";
    import watermark from "../../components/watermark";
    import MaxentSDK from "@/services/MaxentSDK";

    import jitter from "@/components/business/jitter";
    import {mapGetters, mapMutations, mapState} from "vuex";
    import rongzeDialog from "@/components/business/rongzeDialog";
    import AppBridge from "@/services/AppBridge.js";
    import banner from "@/components/business/recommendBanner";

    export default {
        data() {
            return {
                messageUrl: process.env.kingPath + "/pages/speed-panda/#/message", //消息中心
                repayUrl: process.env.kingPath + "/pages/speed-panda/#/recommend/repayList", //还款列表
                onlineServiceUrl: "",
                redIconShow: false,
                redIconCount: "0",
                pullDown: true,
                headerOpacity: 1,
                headerRgba: 1,
                activeHeight: "30vh",
                isInit: true,
                isShowIframeUrl: util.getParams("isShowIframeUrl") || 0,
                homeData: {
                    apiFinish: false,
                    applyproducts: [],
                    withdrawProducts: [],
                    repayProducts: [],
                    otherProducts: [],
                    welfareInfo: [],
                    newcards: "",
                    onekeyapplypage: {
                        url: ""
                    },

                    xm_driverPopConfig: '',

                    mxkproducts: "",
                    rejectpage: "", //拒件记录跳转地址
                    thirdproducts: "",
                    productext: [],
                    resecondproducts: []
                }, //首页数据汇总
                iframeUrl: "", //商业化地址
                creditCardHeight: "0", //商业地址高度

                //抖动小球参数
                jitterArgs: {
                    isShow: false,
                    isStart: false,
                },
                isShowNewCards: false,
                isInit: true,

            };
        },
        mixins: [require("../../mixins").default],
        components: {
            newcards,
            record,
            broadcast,
            offlineProduct,
            multiApply,
            creditCard,
            secondRemittance,
            scroller,
            watermark,

            rongzeDialog,
            jitter,
	        banner,

        },

        computed: {
            ...mapState([
                'driver'
            ]),
        },
        methods: {

            ...mapMutations(['setDriverConfig',]),

            //解析首页导流参数
            parseHomeDriver(res) {

                //new卡导流-联合登录
                if (res.data.xm_newcardsconfig) {
                    this.PubDriver('xm_newcardsconfig', res.data.xm_newcardsconfig)
                    this.isShowNewCards = true
                }else{
                    this.isShowNewCards = false
                }

                //弹窗导流-联合登录
                if (res.data.xm_driverPopConfig) {
                    this.PubDriver('xm_driverPopConfig', res.data.xm_driverPopConfig)
                }

                //小球导流-联合登录
                if (res.data.xm_driverSuspensionWindowConfig) {
                    this.jitterDriver(res.data.xm_driverSuspensionWindowConfig)
                } else {
                    this.jitterArgs.isShow = false
                }
            },

            //小球点击
            jitterClick() {
                this.sinaAds.click({currEvent: this.stat_diversion.diversion.jitter.click,}, () => {
                });

                console.log('jumpLink==>', this.driver.xm_driverSuspensionWindowConfig.url);

                //联合登录
                this.beforeDriver(this.driver.xm_driverSuspensionWindowConfig.unloginUrl)

                // "type": "1", //1 内联 2外联打开
                this.driver.xm_driverSuspensionWindowConfig.url && AppBridge.activityView({
                    type: "open",
                    url: this.driver.xm_driverSuspensionWindowConfig.url,
                    open_inner: this.driver.xm_driverSuspensionWindowConfig.type == 1,
                });
            },

            //小球导流-联合登录
            jitterDriver(params) {

                this.PubDriver('xm_driverSuspensionWindowConfig', params)
                this.jitterArgs = {
                    isShow: true,
                    isStart: true,
                }
                this.sinaAds.display({currEvent: this.stat_diversion.diversion.jitter.show,}, () => {
                });
                setInterval(() => this.jitterArgs.isStart = !this.jitterArgs.isStart, 5000)
            },

            //联合登录-公共处理【new卡、小球、】
            PubDriver(key, params) {
                if (params) {
                    this.setDriverConfig({
                        key,
                        data: params
                    })
                    return
                }
                this.PubDriver(key, {
                    imgurl: "",
                    unloginUrl: "",
                    type: "",
                    showmodel: "",
                    tipCount: 0,
                    url: ""
                })
            },

            init(tag) {
                try {
                    //this.initHomeData()
                    //this.getApplyList();
                    //this.getSecondProductList();
                    //this.getRejectApplyList();
                    //this.getMXKConfig();
                    this.fetchData(tag).then(res => {
                        this.queryHomePageWelfareInfo();
                    });

                    this.getmarketinfo();
                    //this.getEntranceConfig();
                    this.redData();
                } catch (error) {
                    this.loadingClose();
                }
            },
            //初始化首页数据
            initHomeData() {
                this.homeData = this.$options.data().homeData;
                console.log("重置了数据", this.homeData);
            },
            //关闭loading
            loadingClose() {
                this.$root.loadingClose();
            },
            //刷新
            refresh(cb) {
                //this.initHomeData();
                this.headerOpacity = 0;
                this.init();
                setTimeout(() => {
                    this.headerOpacity = 1;
                    cb && cb();
                }, 1000);
            },
            //top 距离顶部的像素点
            onPulling(top) {
                if (top && top > 20) {
                    this.headerOpacity = 0;
                }
            },
            //滚动中
            onScroll(e) {
                let scrollTop = e.target.scrollTop;
                if (scrollTop <= 100) {
                    this.headerRgba = scrollTop / 100;
                } else {
                    this.headerRgba = 1;
                    this.headerOpacity = 1; //解决正在刷新时又上滑透明度不还原问题
                }
            },
            //刷新完成
            refreshFinsh() {
                setTimeout(() => {
                    this.headerOpacity = 1;
                }, 200);
            },

            //获取借还款记录
            getApplyList() {
                return new Promise((resolve, reject) => {
                    api.home.getApplyList().then(res => {
                        if (helper.isSuccess(res)) {
                            this.homeData.applyproducts = res.data.applyproducts || [];
                            this.resolveQueue(res.data.productext);

                            resolve(res);
                        }
                    });
                });
            },
            //资方特殊流程
            resolveQueue(data) {
                if (!data) return;
                data.forEach(item => {
                    // 玖富
                    if (item.type == 1) {
                        this.resolveMaxent(item);
                    }
                    // ...
                });
            },
            // 保存玖富tick
            resolveMaxent(data) {
                let tick = util.getParams("fromUserId") + new Date().getTime();
                MaxentSDK.init(util.getParams("fromUserId"));
                MaxentSDK.active(tick).then(status => {
                    if (!status) return;
                    api.loan.jiufu.saveTicket({
                        requestType: "1",
                        productid: data.productid,
                        type: "1",
                        tick,
                        fundproductid: util.getParams()["productid"] || ""
                    });
                });
            },

            //获取二级商户
            getSecondProductList() {
                return new Promise((resolve, reject) => {
                    api.home.getSecondProductList().then(res => {
                        if (helper.isSuccess(res)) {
                            if (!res.data) return;
                            this.homeData.resecondproducts = res.data.resecondproducts || [];
                            this.homeData.newcards = res.data.newcards;
                            this.homeData.onekeyapplypage = res.data.onekeyapplypage;
                        }
                        resolve(res);
                    });
                });
            },
            //获取秒下款
            getMXKConfig() {
                return new Promise((resolve, reject) => {
                    api.home.getMXKConfig().then(res => {
                        if (helper.isSuccess(res)) {
                            if (res.data) {
                                this.homeData.mxkproducts = res.data.mxkproducts;
                            }
                        }
                        resolve(res);
                    });
                });
            },

            //接受iframe回调方法
            postMessageHandle(value) {
                if (value && typeof value == "number") {
                    this.$nextTick(() => {
                        setTimeout(() => {
                            this.creditCardHeight = value + "px";

                            this.loadingClose();
                        }, 1000);
                    });
                }
            },
            //获取贷超地址
            getmarketinfo() {
                return new Promise((resolve, reject) => {
                    api.activity
                        .getAppMarketInfo({
                            pageid: "1001",
                            token: util.getParams("token") || storage.get("token") || ""
                        })
                        .then(res => {
                            if (res.code == 200 && res.data) {
                                this.iframeUrl = res.data.jumplink;

                                setTimeout(() => {
                                    this.loadingClose();
                                }, 3000);
                            }
                            resolve(res);
                        });
                });
            },
            //拒件列表
            getRejectApplyList() {
                return new Promise((resolve, reject) => {
                    api.home.getRejectApplyList().then(res => {
                        if (res.code == 200 && res.data) {
                            this.homeData.rejectpage = res.data.rejectpage;
                        }
                        resolve(res);
                    });
                });
            },
            //获取三级商户（线下贷款）配置
            getEntranceConfig() {
                return new Promise((resolve, reject) => {
                    api.home.getEntranceConfig().then(res => {
                        if (!helper.isSuccess(res)) return;
                        if (res.data && res.data.thirdproducts) {
                            this.homeData.thirdproducts = res.data.thirdproducts;
                        }
                        resolve(res);
                    });
                });
            },
            // 获取首页数据大接口
            fetchData(tag) {
                return new Promise((resolve, reject) => {
                    if (tag) {
                        console.log(`return 伪协议 调用 `);
                        this.$AppBridge.getHomeData({}, res => {
                            if (helper.isSuccess(res)) {
                                console.log("收到伪协议的数据了！");
                                this.homeData = Object.assign(this.homeData, res.data);
                                this.homeData.apiFinish = true;

                                if (!(res.data.applyproducts && res.data.applyproducts.length)) {
                                    this.homeData = Object.assign(this.homeData, {
                                        applyproducts: []
                                    });
                                }

                                this.formatData(this.homeData);
                                this.parseHomeDriver(res)
                                this.isInit = false

                                this.$nextTick(() => {
                                    this.pageShow = true;
                                });
                                this.resolveQueue(res.data.productext);

                                resolve(res);
                            }
                        });
                    } else {
                        api.home
                            .getHomePage()
                            .then(res => {

                                // res= this.mock.home

                                if (helper.isSuccess(res)) {
                                    this.homeData = Object.assign(this.homeData, res.data);
                                    this.homeData.apiFinish = true;

                                    if (!(res.data.applyproducts && res.data.applyproducts.length)) {
                                        this.homeData = Object.assign(this.homeData, {
                                            applyproducts: []
                                        });
                                    }
                                    this.formatData(this.homeData);
                                    this.parseHomeDriver(res)
                                    this.isInit = false

                                    this.$nextTick(() => {
                                        this.pageShow = true;
                                    });
                                    this.resolveQueue(res.data.productext);

                                    resolve(res);
                                }
                            })
                            .finally(this.loadingClose);
                    }
                });
            },
            formatData(data) {
                let withdrawProducts = [];
                let repayProducts = [];
                let otherProducts = [];
                if (data.applyproducts) {
                    let repayArray = [16, 17, 18, 19, 20, 21, 22, 25, 26, 27, 31];
                    data.applyproducts.forEach(item => {
                        /*
                                      if(item.status == 10) {
                                          withdrawProducts.push(item)
                                      }else if(repayArray.includes(item.status)){
                                          repayProducts.push(item);
                                      }else {
                                          otherProducts.push(Object.assign({isOneProduct: true}, item));
                                      }*/
                        if (repayArray.includes(item.status)) {
                            repayProducts.push(item);
                        } else {
                            withdrawProducts.push(Object.assign({isOneProduct: true}, item));
                        }
                    });
                    this.homeData.withdrawProducts = withdrawProducts;
                    this.homeData.repayProducts = repayProducts;
                    helper.set(
                        "homeData-repayProducts",
                        JSON.stringify(this.homeData.repayProducts)
                    );
                }
                if (data.resecondproducts && data.resecondproducts.length > 0) {
                    otherProducts = otherProducts.concat(data.resecondproducts);
                } else {
                    otherProducts = []
                }
                this.homeData.otherProducts = otherProducts;
            },
            queryHomePageWelfareInfo() {
                api.home
                    .queryHomePageWelfareInfo({
                        type: "list",
                        token: util.getParams("token") || storage.get("token") || ""
                    })
                    .then(res => {
                        if (helper.isSuccess(res)) {
                            if (res.data) {
                                this.homeData = Object.assign({}, this.homeData, {
                                    welfareInfo: res.data.realData
                                });
                            }
                        }
                    });
            },
            //消息红点查询
            redData() {
                return new Promise((resolve, reject) => {
                    api.user.message
                        .redDot({
                            pageCode: 2001004, //活动消息
                            productId: 2001,
                            token: util.getParams("token") || storage.get("token") || ""
                        })
                        .then(res => {
                            if (!helper.isSuccess(res)) return;
                            if (
                                res.data.messageCenterTotal &&
                                res.data.messageCenterTotal > 0
                            ) {
                                this.redIconShow = true;
                                if (res.data.messageCenterTotal > 99) {
                                    this.redIconCount = "99+";
                                } else {
                                    this.redIconCount = String(res.data.messageCenterTotal);
                                }
                            } else {
                                this.redIconShow = false;
                            }
                            resolve(res);
                        });
                });
            },

            // 获取在线客服地址
            getOnlineService() {
                this.$AppBridge.getInitData({type: "pageaddress"}, res => {
                    console.log("pageaddress", res);
                    if (
                        res.code === "200" &&
                        res.data &&
                        res.data.pageaddress &&
                        res.data.pageaddress.length
                    ) {
                        let list =
                            typeof res.data.pageaddress != "string"
                                ? res.data.pageaddress
                                : JSON.parse(res.data.pageaddress);

                        list.map((item, index) => {
                            if (item.type === "ONLINESERVICE" && item.showmodel === "2") {
                                this.onlineServiceUrl = item.url;
                                return;
                            }
                        });
                    }
                });
            }
        },
        created() {
            this.getOnlineService();
            this.init();
            console.log('created')
            EventBus.$on("postMessage", this.postMessageHandle);
        },
        destroyed() {
            EventBus.$off("postMessage");
        },
        mounted() {
            this.$root.setStatusColor("white");
            console.log('mounted')
            this.$nextTick(() => {
                this.$root.loadingClose();
            });
        },
        onRefresh(tag, data) {
            if (tag == "home" || tag == "refresh") {
                this.init(tag);
            }
        },
        watch: {}
    };
</script>

<style lang="scss" scoped>
    @-webkit-keyframes loadingRotate {
        0% {
            -webkit-transform: rotateZ(0deg);
        }
        100% {
            -webkit-transform: rotateZ(360deg);
        }
    }

    .view {
        transform: translateX(0);

        .c-view-content {
            transition: all 0.5s;
            min-height: 100vh;
            box-sizing: border-box;
        }

        .nopass-content {
            background-size: 100%;
            width: 100%;

            .header-content {
                display: flex;
                align-items: center;
                text-align: left;
                padding-left: 16px;
                margin-bottom: 10px;

                .center {
                    display: flex;
                    align-items: center;

                    img {
                        width: 100px;
                        content: normal !important;
                    }
                }

                .header-desc {
                    display: inline-block;
                    font-size: 12px;
                    height: 12px;
                    line-height: 12px;
                    color: #797979;
                    margin-left: 6px;
                    padding-left: 6px;
                    border-left: 1px solid #797979;
                }

                .right {
                    position: absolute;
                    right: 0;
                    margin-right: 16px;
                }
            }
        }

        .no-pass {
            background: #f8f8f8;
            border-radius: 4px;
            height: 60px;
            text-align: left;
            padding: 20px 16px;
            margin: 10px 16px;
        }
    }

    .no-thirdproducts-kefu {
        margin: 20px 16px;

        img {
            width: 100%;
        }
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
        background-image: linear-gradient(-190deg, #7164cb 0%, #3961d6 100%);
        position: absolute;
        z-index: -1;
        width: 100%;
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

    .block-header {
        display: block;
        background: transparent;
        height: 50px;

        @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
            height: 60px;
        }
        @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
            height: 88px;
        }
    }

    .iframe-section {
        border-top: 0 !important;
    }

    .kefu-content {
        background-color: white;
        padding: 10px 13px;

        img {
            width: 100%;
        }
    }

    .posi-r {
        position: relative;
    }

    .red-icon {
        font-size: 18px;
        color: #ffffff;
        position: absolute;
        display: inline-block;
        text-align: center;
        background-color: #e72427;
        transform: scale(0.5);
    }

    .red-icon-one {
        padding: 2px 8px 3px 6px;
        top: -11px;
        right: -10px;
        border-radius: 50%;
    }

    .red-icon-two {
        padding: 2px 9px 3px 6px;
        border-radius: 36px;
        top: -10px;
        right: -18px;
    }

    .red-icon-three {
        padding: 2px 9px 3px 6px;
        border-radius: 40px;
        top: -13px;
        right: -22px;
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

    .el-watermark-noScreen {
        position: absolute;
        bottom: 0;
        width: 100%;
    }

    .icon_b {
        width: 22px;
        height: 22px;
    }
</style>
