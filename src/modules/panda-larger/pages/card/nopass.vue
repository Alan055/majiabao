<template>
    <div class="view">
        <div class="c-layer">
            <div class="pull-down-bg" :style='{height: activeHeight}'></div>
        </div>

        <div class="c-layer header-layer">
            <c-header ref="transparentHeader" class="header transparent" :style="`color: black;`" :title="appName"
                      :show="true">
                <span slot="right" v-sinaAds="adsInfo.card.index.clickMessage"
                      @click="$root.openUrl(messageUrl);redIcon=false;" class="posi-r">
                        <mt-button><img class="c-icon icon_a" src="../../assets/images/message-blue.png"/></mt-button>
                        <span v-if="redIconShow"
                              :class="['red-icon', ['red-icon-one', 'red-icon-two', 'red-icon-three'][redIconCount.length - 1]]">{{redIconCount}}</span>
                </span>
            </c-header>
        </div>

        <div class="c-view-content" v-show="!isInit">

            <div class="pt" v-if="homeData.newcards || homeData.withdrawProducts">
                <!-- 专属推荐（new卡） -->
                <newcards :resdata="homeData" v-if="homeData.newcards && isShowNewCards"/>

                <record class="section transparent-gap" :resdata="homeData" v-if="homeData.withdrawProducts"/>

                <div class="content-bottom" style="margin-top: 0;">
                    <div class="section kefu-content" v-sinaAds="adsInfo.card.index.clickKefu"
                         @click="$root.openUrl({url: onlineServiceUrl, title: '在线客服'})">
                        <img src="../../assets/images/kefu-banner.png" alt="">
                    </div>
                </div>
            </div>

            <div v-else>
                <div class="content-main">
                    <img src="../../assets/images/no-pass-panda.png" alt="">

                    <p class="title">抱歉！您未匹配到额度～</p>
                    <p class="sub-title">您的申请资料暂未匹配到借款机构，建议您保持良好信用，半年后重新尝试~</p>
                </div>
                <div class="content-bottom">
                    <div class="section kefu-content" v-sinaAds="adsInfo.card.index.clickKefu"
                         @click="$root.openUrl({url: onlineServiceUrl, title: '在线客服'})">
                        <img src="../../assets/images/kefu-banner.png" alt="">
                    </div>
                </div>
            </div>

        </div>
        <rongze-dialog :visibility="homeData.xm_driverPopConfig != ''"
                       :data="homeData.xm_driverPopConfig"></rongze-dialog>

        <jitter v-if="jitterArgs.isShow" :start.sync="jitterArgs.isStart" @jitterClick="jitterClick"
                :icon="driver.xm_driverSuspensionWindowConfig.imgurl"/>

    </div>
</template>

<script>
    import api from "@/services/api";
    import util from "@/utils";
    import AppBridge from "@/services/AppBridge.js";
    import helper from "@/utils/helper";
    import storage from "@/utils/storage";

    import jitter from "@/components/business/jitter";
    import {mapGetters, mapMutations, mapState} from "vuex";
    import rongzeDialog from "@/components/business/rongzeDialog";
    import record from "../recommend/components/record";
    import newcards from "../recommend/components/newcards";

    export default {
        name: "nopass",
        data() {
            return {
                messageUrl: process.env.path + "/v1.1.0/king/pages/panda-larger/#/message", //消息中心
                onlineServiceUrl: '',
                redIconShow: false,
                redIconCount: '0',
                pullDown: true,
                headerOpacity: 1,
                headerRgba: 0,
                activeHeight: "50vh",

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

                //抖动小球参数
                jitterArgs: {
                    isShow: false,
                    isStart: false,
                },

                isShowNewCards:false,
                isInit:true

            };
        },
        computed: {
            ...mapState([
                'driver'
            ]),
        },

        components: {
            rongzeDialog,
            jitter,
            record,
            newcards,
        },

        mounted() {
            /*  this.getOnlineService();
              this.redData();*/
            console.error("mounted2222");
            this.init();
        },

        onRefresh(tag, data) {
            console.error('onRefresh====>',tag);
            if (tag == "home" || tag == "refresh") {
                this.init(tag);
            }
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
                    this.getOnlineService();
                    this.fetchData(tag).then(res => {
                    });
                    this.redData();

                } catch (error) {

                }finally{
                    this.$nextTick(() => {
                        this.$root.loadingClose();
                    });

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

                                if (!(res.data.applyproducts && res.data.applyproducts.length)) {
                                    this.homeData = Object.assign(this.homeData, {
                                        applyproducts: []
                                    });
                                }

                                this.formatData(this.homeData);
                                this.parseHomeDriver(res)
                                this.isInit=false

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

                                //res = this.mock.home

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
                                    this.isInit=false

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
                }
                this.homeData.otherProducts = otherProducts;
            },

            // 获取在线客服地址
            getOnlineService() {
                AppBridge.getVisitUrl({
                    pageName: 'ONLINESERVICE'
                }, res => {
                    if (!res || !res.data) return
                    let data = res.data
                    if (typeof data == 'string') {
                        data = JSON.parse(data)
                    }

                    if (data && data.url) {
                        this.onlineServiceUrl = data.url;
                    }

                })
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
                            if (res.data.messageCenterTotal && res.data.messageCenterTotal > 0) {
                                this.redIconShow = true;
                                if (res.data.messageCenterTotal > 99) {
                                    this.redIconCount = '99+'
                                } else {
                                    this.redIconCount = String(res.data.messageCenterTotal)
                                }
                            } else {
                                this.redIconShow = false;
                            }
                            resolve(res)
                        });
                })
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

    .header-layer {
        position: relative;
        z-index: 1;
    }

    .content-bg {
        img {
            width: 100%;
        }
    }

    .pt {
        padding: 0 20px;
        margin-top: 50px;
    }

    .content-main {
        position: relative;
        background: #FFFFFF;
        background: url("../../assets/images/nopass@2x.png") no-repeat;
        background-size: 100% 158px;
        box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.09);
        border-radius: 8px;
        width: 343px;
        height: 281px;
        margin-left: 4.3%;
        top: 69px;
        text-align: left;
        padding: 0 20px;

        img {
            width: 82px;
            height: 90px;
            margin-top: 50px;
            margin-left: 4px;
        }

        .title {
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #333333;
            letter-spacing: 0;
            margin-top: 21px;
        }

        .sub-title {
            color: #5A6275;
            font-size: 14px;
            margin-top: 12px;
        }
    }

    .content-bottom {
        margin-top: 88px;
        display: flex;
        justify-content: center;

        .kefu-content {
            background-color: white;
            padding: 10px 13px;

            img {
                width: 100%;
            }
        }
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

</style>
