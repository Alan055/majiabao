<template lang="html">
    <!-- 不能在scroller 组件上加c-view 所以包裹一层 原因： 会导致超出一屏时向上滑不滑到顶部也触发下拉刷新 -->
    <div class="billIndex" v-if="dataList.length">
        <scroller
            class="billIndex"
            :enableRefresh="false"
            :enableInfinite="true"
            :on-infinite="onInfinite"
        >
            <template slot="pull-refresh">
                <div class="pull-refres-bill">
                    <span class="down-tip"><i></i>下拉刷新</span>
                    <span class="up-tip"><i></i>松开刷新</span>
                    <span class="refresh-tip"><i></i>正在刷新</span>
                </div>
            </template>

            <div class="c-view-content">
                <div class="bill-list">
                    <div class="bill-item"
                         v-for="item in dataList" :key="item.id"
                         @click="toList(item)"
                         v-sinaAds="adsInfo.bill.index.clickBill"
                    >
                        <p class="c-flex-row c-v-center title-row">

                            <span class="c-flex-item c-tl title">
                                <img class="c-icon" :src="item.iconurl" alt="">
                                {{item.productname || item.name}}
                            </span>

                            <span class="c-flex-item c-tr">
                                <span class="state green" v-if="item.billstatus == 1">待还款</span>
                                <span class="state red" v-if="item.billstatus == 2">已逾期</span>
                                <span class="state gay" v-if="item.billstatus == 3">已结清</span>
                                <span class="state gay" v-if="item.status == 4">审批未通过</span>

                                <!-- <c-icon v-if="!(item.billstatus == 3 && item.isShowFeeText)" class="icon-enter" type="enter"/> -->
                            </span>
                        </p>

                        <p class="c-flex-row c-v-center count-row">
                            <span class="c-flex-item c-tl count">
                        <p class="sub-content">{{item.loanamount || item.maxamount | formatMoney}}</p>
                        <p class="sub-title">申请金额(元)</p>
                        </span>

                        <span class="c-flex-item c-tr date-row" v-if="item.nextpaydate">
                                <p class="sub-content" v-html="computedLeftData(item)"></p>
                                <p class="sub-title">申请日期</p>
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </scroller>
    </div>

    <no-data
        :imgUrl="require('../../assets/images/no-bill@2x.png')"
        text="您暂时没有任何账单"
        v-else-if="requestFlag && !dataList.length"
    ></no-data>
</template>

<script>
    import api from "@/services/api";
    import {Toast} from "@/utils/helper";
    import PageControl from "../../PageControl";
    import {Indicator, Loadmore} from "mint-ui";
    import helper from "@/utils/helper";
    import scroller from "@/components/view/scroller";
    import noData from "@/components/common/noData";

    export default {
        data() {
            return {
                minHeight: window.innerHeight - 83,
                selected: "1",
                pageNo: 1,
                pageSize: 10,
                dataList: [],
                dataList2: [],
                requestFlag: false,
                noMore: false, //是否还有更多
                bottomPullText: "",
                topPullText: "",
                pageNoa: 1, //more
                pageNob: 0,
                noMoreText: "数据已加载完",
                bottomText: "上拉加载更多...",
                nomoreShowa: false,
                nomoreShowb: false,
                allLoadeda: false,
                allLoadedb: false,
                bottomStatus: "",
                pageControl: new PageControl({
                    pageStart: 1,
                    pageSize: 9999,
                    api: api.user.bill.index,
                    keyPath: ["data"]
                })
            };
        },
        computed: {
            period() {
                //periodunit 期数单位 1天，2月，3周，4年
                let unit = "期";
                if (this.data.withdrawInfo.periodunit) {
                    if (this.data.withdrawInfo.periodunit == "1") {
                        unit = "天";
                    }
                }
                return this.data.withdrawInfo.loanperiod + unit;
            },
            dateFormat(date) {
                return date => {
                    return date ? moment(date).format("YYYY-MM-DD") : "";
                };
            }
        },
        components: {
            scroller,
            noData
        },
        methods: {
            //more
            handleBottomChange(status) {
                this.bottomStatus = status;
            },
            loadBottoma(token) {
                console.log("loadBottoma");
                return new Promise((resolve, reject) => {
                    let params = {
                        pageIndex: String(this.pageNo),
                        pageSize: String(this.pageSize)
                    };
                    if (token) {
                        params.token = token;
                    }
                    api.user.bill
                        .index(params)
                        .then(res => {
                            if (!helper.isSuccess(res)) {
                                return;
                            }

                            if (res.data) {
                                this.dataList.push(...res.data);
                            }
                            this.requestFlag = true;

                            resolve(res);
                            this.$root.loadingClose();
                        })
                        .finally(() => {
                            this.bottomPullText = "";

                            this.$root.loadingClose();
                        });
                });
            },

            //刷新
            refresh(cb) {
                this.dataList = [];
                this.fetchData();
                setTimeout(() => {
                    cb && cb();
                }, 1000);
            },

            onInfinite(cb) {
                console.log("执行上拉加载更多");
                this.pageNo++;
                this.loadBottoma().then(res => {
                    if (res.data.length <= 0) {
                        cb && cb("数据已加载完");
                    } else {
                        cb && cb();
                    }
                });
            },
            /**
             * 请求数据
             */
            fetchData() {
                //this.dataList = [];
                this.loadBottoma().then(() => {
                    this.getRejectedItems();
                });
            },

            getRejectedItems() {
                api.loan.getRejectedItems().then(res => {
                    if (res.code == 200) {
                        if (res.data && res.data.length > 0) {
                            this.renderData(res.data);
                        }
                    }
                });
            },
            renderData(data) {
                data.map(item => {
                    let obj = item;
                    obj.text1 = item.copywrites.filter(i => i.type == 1);
                    obj.text2 = item.copywrites.filter(i => i.type == 2);
                    obj.text3 = item.copywrites.filter(i => i.type == 3);

                    //导流状态卡 追加到顶部
                    (obj.xmdriver) ? this.dataList.splice(0, 0, obj) : this.dataList.push(obj)
                });
            },

            /**
             * 账单借款明细
             */
            computedLeftData(item) {
                let unit = "期";
                if (item.periodunit && item.periodunit == "1") {
                    unit = "天";
                }
                //return item.loandate + '(共' + item.loanperiod + unit + ')';
                return item.loandate;
            },

            /**
             * 账单详情
             * @param item
             */
            toList(item) {

                if (item.unloginUrl) {
                    this.beforeDriver(item.unloginUrl)
                }

                if (item.xmdriver && (item.xmdriver == 1 || item.xmdriver == 2)) {

                    let url = item.nextpage.url;

                    this.sinaAds.click({currEvent: this.stat_diversion.diversion.refuse.btnClick}, () => {
                        this.$root.openUrl(url);
                    });
                    return;
                }

                //被拒账单不可点击
                if (item.status == 4) {
                    return;
                }
                //我的账单还清后，不可点击查看账单列表和账单详情
                if (item.billstatus == 3 && item.isShowFeeText) {
                    return;
                }
                this.$root.nextTitle = item.productname || "账单列表";
                this.$router.push({
                    name: "billList2",
                    params: {
                        id: item.id,
                        productid: item.productid,
                        orderid: item.orderid,
                        loandate: item.loandate,
                        name: item.productname,
                        iconurl: item.iconurl
                    }
                });
            }
        },
        mounted() {
            //this.$root.setStatusColor('black')
            this.$root.setWebAttribute({
                title: "全部账单"
            });

            //this.loadBottoma();
            this.fetchData();
            console.log("新的账单页面");
            //this.pageControl.refresh()
        },
        onRefresh(tag, data) {
            if (tag == "login") {
                console.log("收到通知了!,token是", data);
                this.pageNoa = 0;
                this.pageNob = 0;
                this.dataList = [];
                this.dataList2 = [];
                this.loadBottoma(data);
            }
            console.log("收到tab的消息了", tag);
            if (tag == "trust") {
                this.$root.setStatusColor("black");
                this.loadBottoma();
            }
        },
        filters: {
            formatMoney(num = 0) {
                return Number(num).toFixed(2);
            }
        }
    };
</script>

<style lang="scss" scoped>
    /deep/ .inner {
        margin-top: -24px !important;
        position: relative;

        .pull-refresh {
            background-color: transparent !important;
            height: 24px !important;
            padding: 0 !important;
        }
    }

    .top-tip {
        font-size: 14px;
        color: #69a2fc;
        width: 100%;
        background-color: #e1f5ff;
        height: 48px;
        line-height: 48px;
        padding-top: 5px;
        line-height: 1.7;
        font-family: PingFangSC-Regular;
        margin-top: -1px;
        font-size: 12px;
        letter-spacing: -0.27px;
        text-align: justify;

        p {
            width: 91%;
            margin: 0 auto;
        }
    }

    .header-layer {
        position: relative;
        z-index: 1;
    }

    .block-header {
        display: block;
        background: transparent;
        height: 44px;
    }

    .c-view-content {
        background-color: #fff;
        padding: 12px 16px;
    }

    .bill-list {
        padding-top: 10px;
    }

    /*数据列表子项*/
    .bill-item {
        position: relative;
        padding: $gap $gap 0;
        background: #ffffff;
        border-radius: 4px;
        //margin-bottom: $gap;
        padding: 10px 16px;
        overflow: hidden;

        background: #ffffff;
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
        border-radius: 4px;

        &:last-child {
            border: 0;
        }
    }

    .title-row {
        padding-bottom: 14px;

        .title {
            font-size: 16px;
            color: #333333;

            .c-icon {
                @include size(16px);
            }
        }
    }

    .state {
        display: inline-block;
        position: absolute;
        top: -1px;
        right: -1px;
        font-size: $fontM;
        border-radius: 0 8px 0 8px;
        height: 25px;
        line-height: 25px;
        text-align: center;
        width: 72px;
        color: white;

        &.red {
            background-color: $red;
        }

        &.green {
            background-color: $green;
        }

        &.gay {
            background-color: #bfbfbf;
        }
    }

    .icon-enter {
        @include size(12px);
    }

    .count-row {
        margin: 14px 0 4px 0px;

        .count-title {
            font-size: $fontL;
        }

        .count {
            font-size: $fontXL;
        }
    }

    /*分割线*/
    .gap {
        position: relative;
        margin: 0 -16px 10px -16px;

        .line {
            border-top: 1px dashed #e6e6e6;
            margin: 0 5px;
        }

        .circle-left,
        .circle-right {
            @include circle(10px);
            background: rgba(0, 0, 0, 0.05);
            position: absolute;
            top: -5px;
        }

        .circle-left {
            left: -5px;
        }

        .circle-right {
            right: -6px;
        }
    }

    /*借款明细*/
    .detail-row {
        margin-left: 16px;
        font-size: $fontM;
        color: $light;

        .line {
            height: 20px;
        }
    }

    .date-row {
        .line {
            height: 20px;
            @extend %border-r;
        }
    }

    .sub-title {
        font-size: 12px;
        color: #999999;
    }

    .sub-content {
        font-size: 24px;
        color: #444444;
    }

    .bill-item {
        margin-bottom: 10px;

        &.state-done {
            .title,
            .state,
            .count-row,
            .detail-row {
                color: $light !important;
            }
        }
    }

    // 无数据
    .bill-noList {
        left: 50%;
        transform: translate(-50%, -50%);
        /*展示图片样式*/
        .bill-noList-img {
            width: 100%;

            img {
                width: 100%;
            }
        }

        /*占位符*/
        .w-180-140 {
            aspect-ratio: "180:140";
        }

        /*展示文字样式*/
        .bill-noList-text {
            color: #666;
            margin-top: 20px;
        }
    }
</style>

<style lang="scss">
    .c-aspectratio-content2 {
        text-align: center;

        img {
            width: 100px;
        }
    }

    p.noMore {
        text-align: center;
    }

    div.msgNotice {
        //background: #F5F5F5;
        background: linear-gradient(top, #f5f5f5 0%, #f5f5f5 100%);

        height: 52px;
        padding: 5px;
        width: 100%;
        line-height: 1.7;
        font-family: PingFangSC-Regular;
        margin-top: -16px;
        font-size: 14px;
        color: #666666;
        letter-spacing: -0.27px;
        text-align: justify;
        //border: 1px solid red;
    }

    .state-done.bill-item {
        /*图片置灰*/
        .c-icon {
            filter: grayscale(100%);
        }
    }

    .pull-refres-bill {
        .down-tip,
        .refresh-tip,
        .up-tip {
            display: none;
            color: black;

            i {
                position: relative;
                top: 3px;
                display: inline-block;
                height: 16px;
                width: 16px;
                margin-right: 6px;
            }
        }

        .down-tip {
            i {
                background: url("~@/assets/images/scroller/down-gay.png") no-repeat !important;
                background-size: cover !important;
            }
        }

        .up-tip {
            i {
                background: url("~@/assets/images/scroller/up-gay.png") no-repeat !important;
                background-size: cover !important;
            }
        }

        .refresh-tip {
            z-index: 2;

            i {
                animation: loadingRotate 0.5s linear infinite;
                background: url("~@/assets/images/scroller/loading-gay.png") no-repeat !important;
                background-size: cover !important;
            }
        }
    }

    .mint-navbar {
        box-shadow: none !important;
    }

    .mint-navbar .mint-tab-item .mint-tab-item-label {
        font-size: 14px;
    }

    .mint-navbar .mint-tab-item.is-selected {
        border-bottom: solid 0px #fff !important;
        font-family: PingFangSC-Medium;
        color: #333333;
        text-align: center;
    }

    .mint-navbar .mint-tab-item.is-selected:after {
        background: #fdd108;
        left: 33.7%;
        right: 32.7%;
        height: 2px;
    }

    .mint-tab-container {
        overflow: auto !important;
    }
</style>
