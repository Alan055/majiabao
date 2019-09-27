<template lang="html">
    <div class="view">
        <div id="spaceDiv" style="display: block; height: 120vh;"></div>

        <div v-if="homeData.apiFinish" class="c-view-content" id="scrollerContent">
            <!-- :enableRefresh="true" :on-refresh="refresh" :offset="100" :bounce="60" :maxScrollerHeight="160" :power="2" @refreshFinsh="refreshFinsh" @onScroll="onScroll" @onPulling="onPulling" -->
            <div class="m-main c-view-bg-white">
                <div class="nopass-content" :style='{"background-image": theme1 ? `url(${require("../../assets/images/recommend-bg@2x.png")}`: ""}'>
                    <div id="blockHeaderContent" class="block-header" ref="transparentBlock"></div>
                    <div class="header-content">
                        <span class="center">
                            <img v-if="theme2" src="../../assets/images/loan-logo@2x.png"/>
                            <img v-else src="../../assets/images/header-logo@2x.png"/>
                        </span>
                        <span class="posi-r right" v-sina-ads='stat.recommend.message.mess'
                            @click="$root.openUrl(messageUrl);redIcon=false;">
                            <img v-if="theme1" class="c-icon icon_a" src="../../assets/images/message-white.png"/>
                            <img v-else class="c-icon icon_a" src="../../assets/images/message-blue.png"/>
                            <span v-if="redIconShow"
                                :class="['red-icon', ['red-icon-one', 'red-icon-two', 'red-icon-three'][redIconCount.length - 1]]">{{redIconCount}}</span>
                        </span>
                    </div>

                    <broadcast v-if="theme1" :resdata="homeData"/>

                    <!-- 专属推荐（new卡） -->
                    <newcards :resdata="homeData" v-if="homeData.newcards"/>
                    
                    <record class="section transparent-gap" 
                        :theme="{
                            theme1: theme1,
                            theme2: theme2
                        }" 
                        :resdata="homeData" 
                        v-if="homeData.applyproducts"
                    />
                </div>

                <top-icon class="section" :data="topIconData"/>
                
                <!-- 贷超 -->
                <credit-card class="section iframe-section" :style="`height: ${creditCardHeight};`" v-if="iframeUrl && isShowIframeUrl == 1" :iframeUrl="iframeUrl"/>

                <div class="m-huabei">
                    <div class="title">为您推荐</div>
                    <div class="el-content">
                        <van-swipe indicator-color="white" :autoplay="3000" :height="90" @change="onSwipeChange">
                            <van-swipe-item v-for="(item, i) in recommendData" :key="i">
                                <div class="el-img">
                                    <img 
                                        :src="item.imgurl" 
                                        @click="handleOpenUrl(item.jumplink, item.title)"
                                        v-sina-ads="{
                                            currEvent: adsInfo.home.clickBanner,
                                            currEventParams:{
                                                jumplink: item.jumplink
                                            }
                                        }"
                                    />
                                </div>
                            </van-swipe-item>
                        </van-swipe>
                    </div>
                </div>
                <div class="m-welfare">
                    <div class="title">限时福利</div>
                    <div class="el-content">
                        <div class="el-img" v-for="(item, i) in welfareData" :key="i">
                            <img 
                                :src="item.imgurl" 
                                @click="handleOpenUrl(item.jumplink, item.title)"
                                v-sina-ads="{
                                    currEvent: adsInfo.home.clickFuli,
                                    currEventParams:{
                                        jumplink: item.jumplink
                                    }
                                }"
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            <watermark class="c-view-bg-gray" ref="watermark" :onlineServiceUrl="onlineServiceUrl"/>
            
        </div>

        <rongze-dialog 
            :visibility="homeData.xm_driverPopConfig != ''"
            :data="homeData.xm_driverPopConfig"
        />

        <jitter 
            v-if="jitterArgs.isShow" 
            :start.sync="jitterArgs.isStart" @jitterClick="jitterClick"
            :icon="driver.xm_driverSuspensionWindowConfig.imgurl"
        />

        <market-dialog />
    </div>
</template>

<script>
    import newcards from "./components/newcards";
    import record from "./components/record";
    import broadcast from "./components/broadcast";
    import secondRemittance from "./components/secondRemittance";
    import watermark from "./components/watermark";
    import topIcon from "./components/topIcon";
    import creditCard from "@/components/view/cMarket";
    import storage from "@/utils/storage";
    import scroller from "@/components/view/scroller";
    import helper from "@/utils/helper";
    import util from "@/utils";
    import api from "@/services/api";
    import EventBus from "@/services/EventBus";
    import {Toast, Indicator} from "@/utils/helper";

    import AppBridge from "@/services/AppBridge.js";

    import jitter from "@/components/business/jitter";
    import {mapGetters, mapMutations, mapState} from "vuex";
    import rongzeDialog from "@/components/business/rongzeDialog";
    import marketDialog from "@/components/business/marketDialog";

    export default {
        data() {
            return {
                messageUrl: process.env.kingPath + "/pages/panda/#/message", //消息中心
                onlineServiceUrl: "",
                redIconShow: false,
                redIconCount: "0",
                isShowIframeUrl: util.getParams("isShowIframeUrl") || 0,
                headerOpacity: 1,
                headerRgba: 1,
                activeHeight: "30vh",
                searchData: {
                    floattext: '',
                    icontext: '',
                    jumplink: '',
                    title: ''
                },
                topIconData: [],
                recommendData: [],
                welfareData: [],
                isSetArrayFinsh: false,
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
                    xm_driverPopConfig: '',
                    xm_newcardsconfig: '',
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
            };
        },
        mixins: [require('../../mixins').default],
        components: {
            newcards,
            record,
            broadcast,
            creditCard,
            secondRemittance,
            scroller,
            rongzeDialog,
            jitter,
            marketDialog,
            watermark,
            topIcon
        },

        computed: {
            ...mapState([
                'driver'
            ]),
        },

        methods: {
            ...mapMutations(['setDriverConfig',]),

            parseHomeDriver(res) {
                //弹窗导流-联合登录
                this.PubDriver('xm_driverPopConfig', res.data.xm_driverPopConfig)

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
                    this.fetchData(tag).then(res => {
                        this.queryHomePageWelfareInfo();
                    });
                    this.getApprovaling();
                    this.getmarketinfo();
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
                this.$nextTick(() => {
                    document.getElementById("spaceDiv").style.height = "0px";
                });
                this.$root.loadingClose();
            },
            //刷新
            refresh(cb) {
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

            //获取运营位数据
            getApprovaling() {
                return new Promise((resolve, reject) => {
                    api.activity
                        .getApprovaling({
                            pageid: "1035",
                            productId: "2001",
                            token: util.getParams("token")
                        })
                        .then(res => {
                            if (res.code == 200 && res.data) {
                                if(res.data.pagedata.blackPageTop && res.data.pagedata.blackPageTop.pagedata) {
                                    this.searchData = res.data.pagedata.blackPageTop.pagedata[0];
                                    console.log('this.searchData', this.searchData)
                                }
                                if(res.data.pagedata.homeSplitFailPageBanner && res.data.pagedata.homeSplitFailPageBanner.pagedata) {
                                    this.recommendData = res.data.pagedata.homeSplitFailPageBanner.pagedata;
                                    console.log('this.recommendData', this.recommendData)

                                }
                                if(res.data.pagedata.homeSplitFailPageFuLi && res.data.pagedata.homeSplitFailPageFuLi.pagedata) {
                                    this.welfareData = res.data.pagedata.homeSplitFailPageFuLi.pagedata;

                                    this.welfareData.forEach(element => {
                                        this.sinaAds.display({
                                            currEvent: this.adsInfo.home.showFuli,
                                            currEventParams: {
                                                jumplink: element.jumplink
                                            }
                                        });
                                    });
                                }
                                if(res.data.pagedata.homeSplitFailPageIcon && res.data.pagedata.homeSplitFailPageIcon.pagedata) {
                                    this.topIconData = res.data.pagedata.homeSplitFailPageIcon.pagedata;
                                }
                            }
                            resolve(res);
                        });
                })
            },
            //滑块改变事件，添加埋点
            onSwipeChange(index) {  
                let item = this.recommendData[index];
                if(!this.isSetArrayFinsh) {
                    this.sinaAds.display({
                        currEvent: this.adsInfo.home.showBanner,
                        currEventParams: {
                            jumplink: item.jumplink
                        }
                    });
                    console.log('上报item.jumplink   ====>>>>', index, item.jumplink)
                }
                if(index == 0) {//注意change是从第二个开始触发，固等于0即为 一轮已经播完
                    this.isSetArrayFinsh = true;
                }
            },
            // 获取首页数据大接口
            fetchData(tag) {
                return new Promise((resolve, reject) => {
                    if (tag) {
                        AppBridge.getHomeData({}, res => {

                            if (helper.isSuccess(res)) {
                                this.homeData = Object.assign(this.homeData, res.data);
                                this.homeData.apiFinish = true;

                                if (!(res.data.applyproducts && res.data.applyproducts.length)){
                                    this.homeData = Object.assign(this.homeData, {
                                        applyproducts:[]
                                    });
                                }
                                this.formatData(this.homeData);
                                  this.parseHomeDriver(res)

                                this.$nextTick(() => {
                                    this.pageShow = true;
                                });

                                resolve(res);
                            }
                        });
                    } else {
                        api.home
                            .getHomePage()
                            .then(res => {

                                if (helper.isSuccess(res)) {
                                    this.homeData = Object.assign(this.homeData, res.data);
                                    this.homeData.apiFinish = true;

                                    if (!(res.data.applyproducts && res.data.applyproducts.length)){
                                        this.homeData = Object.assign(this.homeData, {
                                            applyproducts:[]
                                        });
                                    }
                                    this.formatData(this.homeData);
                                    this.parseHomeDriver(res)

                                    this.$nextTick(() => {
                                        this.pageShow = true;
                                    });

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
                }else{
                    otherProducts=[]
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
                AppBridge.getVisitUrl(
                    {
                        pageName: "ONLINESERVICE"
                    },
                    res => {
                        if (!res || !res.data) return;
                        let data = res.data;
                        if (typeof data == "string") {
                            data = JSON.parse(data);
                        }

                        if (data && data.url) {
                            this.onlineServiceUrl = data.url;
                        }
                    }
                );
            },
            
            handleOpenUrl(url, title) {
                console.log('title', title)
                AppBridge.activityView({
                    url: url,
                    title: title
                })
            },
        },
        beforeCreate() {
            let _mjbname = util.getParams("mjbname");
            if (_mjbname) {
                //样式A：花呗（pandahuabei）、有借（pandacanborrow）、钱进（pandamoneymove）        安卓：极速熊猫（suppanda）
                let themeA = ['pandahuabei', 'pandacanborrow', 'pandamoneymove', 'suppanda'];
                //样式B：IOS：容易贷（easyloan、pandarongyiloan）、闪贷（pandaflashloan）、熊猫花花（pandaokplus） ，熊猫有钱（pandagoldsuit）         安卓：有钱（pandastages）、钱包（yukespxm)、大额(pandalarge)、Plus(pandaplus)
                let themeB = ['easyloan', 'pandarongyiloan', 'pandaflashloan', 'pandaokplus', 'pandastages', 'yukespxm', 'pandaplus', 'pandagoldsuit'];
                
                if(themeA.includes(_mjbname)) {
                    this.theme1 = true;
                    this.theme2 = false;
                }else if(themeB.includes(_mjbname)) {
                    this.theme1 = false;
                    this.theme2 = true;
                }else {
                    this.theme1 = true;
                    this.theme2 = false;
                }

                console.log('this.theme1', this.theme1)
                console.log('this.theme2', this.theme2)

            }
        },
        created() {
            this.init();
            this.getOnlineService();
            EventBus.$on("postMessage", this.postMessageHandle);
        },
        destroyed() {
            EventBus.$off("postMessage");
        },
        mounted() {
            this.$root.setStatusColor("white");
            this.$nextTick(() => {
                this.loadingClose();
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

        /deep/ .inner {
            margin-top: -22px !important;
            position: relative;
            min-height: 111vh;

            .pull-refresh {
                background-color: transparent !important;
                height: 24px !important;
                padding: 0 !important;
            }
        }

        .c-view-content {
            transition: all 0.5s;
            min-height: 101vh;
        }

        .nopass-content {
            background-size: 100%;
            width: 100%;
            .header-content {
                text-align: center;

                .center {
                    display: inline-block;
                    width: 100px;

                    img {
                        width: 100%;
                    }
                }

                .right {
                    position: absolute;
                    right: 0;
                    margin-right: 16px;
                    margin-top: -4px;
                }

                .title {
                    text-align: left;
                    padding: 0 16px;
                    margin-bottom: 4px;
                    font-size: 16px;
                    color: #ffffff;
                    letter-spacing: 0.89px;
                    margin-top: 16px;
                }

                .sub-title {
                    text-align: left;
                    padding: 0 16px;
                    margin-bottom: 8px;
                    font-size: 14px;
                    color: #ffffff;
                    letter-spacing: 0.89px;
                    opacity: 0.86;
                    margin-top: 12px;
                }

                /*向下箭头*/
                .triangle-border-down {
                    width: 0;
                    height: 0;
                    border-width: 8px 8px 0;
                    border-style: solid;
                    border-color: #ffffff transparent transparent; /*灰 透明 透明 */
                    margin: 14px auto;
                    position: relative;
                    opacity: 0.84;
                }

                .no-thirdproducts {
                    position: relative;
                    z-index: 2;
                    margin: 0 auto;
                    background: #ffffff;
                    box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.1);
                    border-radius: 6px;
                    height: 246px;
                    width: 343px;
                    text-align: center;

                    img {
                        width: 131px;
                        height: 83px;
                        margin-top: 49px;
                    }

                    .title {
                        font-size: 16px;
                        color: #353241;
                        letter-spacing: 0.5px;
                        text-align: center;
                    }

                    .sub-title {
                        font-size: 14px;
                        color: #666666;
                        letter-spacing: 0.5px;
                        text-align: center;
                    }
                }
            }
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
        height: 44px;

        @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
            height: 60px;
        }
        @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
            height: 88px;
        }
    }

    .section + .section {
        border-top: 8px solid #f4f4f4;
    }

    .iframe-section {
        border-top: 0 !important;
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

    .m-huabei {
        background: #fff;
        .title {
            margin: 16px 0 16px 16px;
            font-size: 16px;
            color: #333333;
            letter-spacing: 0.89px;
        }

        .el-content {
            padding: 0 16px;

            .el-img {
                width: 100%;
                height: 100%;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
    .m-welfare {
        background: #fff;
        padding-bottom: 20px;
        .title {
            margin: 28px 0 7px 16px;
            font-size: 16px;
            color: #333333;
            letter-spacing: 0.89px;
        }
        .el-content {
            padding: 0 16px;    
            display: flex;
            flex-wrap: wrap;    
            align-items: center;
            .el-img {
                &:nth-child(odd) {
                    padding-right: 3px;
                }
                &:nth-child(even) {
                    padding-left: 3px;
                }
                width: 50%;
                img {
                    width: 100%;

                }
                .el-img-one {
                    margin-bottom: 2px;
                }
            }
        }
    }
</style>
