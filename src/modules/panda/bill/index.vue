<template lang="html">
    <div class="billIndex c-bg-gray">
        <mt-navbar v-model="selected" class='fixed-nav'>
            <mt-tab-item id="1" v-sinaAds="adsInfo.message.index.clickSysMsg">
                待还款
            </mt-tab-item>
            <mt-tab-item id="2" v-sinaAds="adsInfo.message.index.clickActMsg">
                已结清
            </mt-tab-item>
        </mt-navbar>
        <mt-tab-container v-model="selected" :swipeable="true" class="c-view-block">
            <mt-tab-container-item id="1">
                <scroller
                    :on-refresh="refresh"
                    :offset="100"
                    :bounce="60"
                    :maxScrollerHeight="160"
                    :power="2"
                >
                    <template slot="pull-refresh">
                        <div class="pull-refres-bill">
                            <span class="down-tip"><i></i>下拉刷新</span>
                            <span class="up-tip"><i></i>松开刷新</span>
                            <span class="refresh-tip"><i></i>正在刷新</span>
                        </div>
                    </template>

                    <div class="c-view-content" :style="`min-height: ${minHeight}px`" v-if="requestFlag && dataList.length">
                        <div class="bill-list">
                            <div class="bill-item"
                                    v-for="item in dataList" :key="item.id"
                                    @click="toList(item)"
                                    v-sinaAds="adsInfo.bill.index.clickBill"
                            >
                                <p class="c-flex-row c-v-center title-row">

                                    <span class="c-flex-item c-tl title">
                                        <img class="c-icon" :src="item.iconurl" alt="">
                                        {{item.productname}}
                                    </span>

                                    <span class="c-flex-item c-tr date-row" v-if="item.nextpaydate">
                                        还款日：{{dateFormat(item.nextpaydate)}}
                                    </span>
                                </p>

                                <p class="c-flex-row c-v-center count-row">
                                    <span class="c-flex-item c-tl count">￥{{item.loanamount | formatMoney}}</span>

                                    <span class="c-flex-item c-tr">
                                        <span class="state green" v-if="item.billstatus == 1">待还款</span>
                                        <span class="state red" v-if="item.billstatus == 2">已逾期</span>
                                        <span class="state" v-if="item.billstatus == 3">已结清</span>
                                        <c-icon v-if="!(item.billstatus == 3 && item.isShowFeeText)" class="icon-enter" type="enter"/>
                                    </span>
                                </p>

                                <p class="c-flex-row c-v-center detail-row">
                                    <span class="c-flex-item c-tl time" v-html="computedLeftData(item)"></span>
                                </p>
                            </div>
                        </div>
                    <div v-if="nomoreShowa" class="no-more">{{noMore}}</div>
                </div>
                <div class="c-view-content bill-noList c-absolute" v-if="requestFlag && !dataList.length">
                    <div class="bill-noList-img c-aspectratio w-180-140">
                        <div class="c-aspectratio-content2">
                            <img style="width: 100px;" src="../images/message-nodata.png" />
                        </div>
                    </div>
                    <div class="bill-noList-text c-tc c-font-l">
                        您暂时没有待还账单
                    </div>
                </div>
            </scroller>

            </mt-tab-container-item>
            <mt-tab-container-item id="2">
                <scroller
                    :on-refresh="refresh"
                    :offset="100"
                    :bounce="60"
                    :maxScrollerHeight="160"
                    :power="2"
                >
                    <template slot="pull-refresh">
                        <div class="pull-refres-bill">
                            <span class="down-tip"><i></i>下拉刷新</span>
                            <span class="up-tip"><i></i>松开刷新</span>
                            <span class="refresh-tip"><i></i>正在刷新</span>
                        </div>
                    </template>
                    <div class="c-view-content" :style="`min-height: ${minHeight}px`" v-if="requestFlag && dataList2.length">
                            <div class="bill-list">
                                <div class="bill-item"
                                        v-for="item in dataList2" :key="item.id"
                                        @click="toList(item)"
                                        v-sinaAds="adsInfo.bill.index.clickBill"
                                >
                                    <p class="c-flex-row c-v-center title-row">

                                        <span class="c-flex-item c-tl title">
                                            <img class="c-icon" :src="item.iconurl" alt="">
                                            {{item.productname}}
                                        </span>

                                        <span class="c-flex-item c-tr date-row" v-if="item.nextpaydate">
                                            还款日：{{dateFormat(item.nextpaydate)}}
                                        </span>
                                    </p>

                                    <p class="c-flex-row c-v-center count-row">
                                        <span class="c-flex-item c-tl count">￥{{item.loanamount | formatMoney}}</span>

                                        <span class="c-flex-item c-tr">
                                            <span class="state green" v-if="item.billstatus == 1">待还款</span>
                                            <span class="state red" v-if="item.billstatus == 2">已逾期</span>
                                            <span class="state" v-if="item.billstatus == 3">已结清</span>
                                            <c-icon v-if="!(item.billstatus == 3 && item.isShowFeeText)" class="icon-enter" type="enter"/>
                                        </span>
                                    </p>

                                    <p class="c-flex-row c-v-center detail-row">
                                        <span class="c-flex-item c-tl time" v-html="computedLeftData(item)"></span>
                                    </p>
                                </div>
                            </div>
                        <div v-if="nomoreShowb" class="no-more">{{noMore}}</div>
                    </div>

                    <div class="c-view-content bill-noList c-absolute" v-if="requestFlag && !dataList2.length">
                        <div class="bill-noList-img c-aspectratio w-180-140">
                            <div class="c-aspectratio-content2">
                                <img style="width: 100px;" src="../images/message-nodata.png" />
                            </div>
                        </div>
                        <div class="bill-noList-text c-tc c-font-l">
                            您暂时没有结清账单
                        </div>
                    </div>
                </scroller>
            </mt-tab-container-item>
        </mt-tab-container>

    </div>
</template>

<script>
    import api from '@/services/api'
    import {Toast} from '@/utils/helper'
    import PageControl from "../PageControl";
    import {Indicator, Loadmore} from "mint-ui";
    import helper from "@/utils/helper";
    import scroller from "@/components/view/scroller";

    export default {
        data() {
            return {
                minHeight: window.innerHeight - 83,
                selected: "1",
                pageNo: '1',
                pageSize: '10000',
                dataList: [],
                dataList2: [],
                requestFlag: false,
                noMore: false, //是否还有更多
                bottomPullText: '',
                topPullText: '',
                pageNoa: 0, //more
                pageNob: 0,
                noMore: "数据已加载完",
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
                    keyPath: ['data']
                }),
            }
        },
        computed: {
            period() {
                //periodunit 期数单位 1天，2月，3周，4年
                let unit = '期';
                if (this.data.withdrawInfo.periodunit) {
                    if (this.data.withdrawInfo.periodunit == '1') {
                        unit = '天'
                    }
                }
                return this.data.withdrawInfo.loanperiod + unit
            },
            dateFormat(date) {
                return (date) => {
                    return date ? moment(date).format('YYYY-MM-DD') : '';
                }
            }
        },
        components: {
            scroller
        },
        methods: {
            //more
            handleBottomChange(status) {
                this.bottomStatus = status;
            },
            loadBottoma(token) {
                console.log('loadBottoma')
                this.pageNoa = this.pageNoa + 1;

                let params = {
                    pageIndex: String(this.pageNoa),
                    pageSize: String(this.pageSize)
                }
                if(token) {
                    params.token = token;
                }
                api.user.bill.index(params).then(res => {

                    if (!helper.isSuccess(res)) {
                        return
                    }

                    if (res.data) {
                        res.data = res.data.filter((item) => {
                            return item.billstatus != 3
                        })
                        if(res.data.length > 0){
                            this.dataList.push(...res.data)
                        }else{
                            if(this.pageNoa == 1) {
                                this.dataList = res.data
                                //this.nomoreShowa = true;
                            }
                        }
                    } else {
                        this.dataList = res.data;
                        //this.nomoreShowa = true;
                    }
                    this.requestFlag = true
                    this.$root.loadingClose();
                }).finally(() => {
                    this.bottomPullText = ''

                    if( this.$refs.loadmorea) this.$refs.loadmorea.onBottomLoaded();
                    this.$root.loadingClose();
                })
            },
            loadBottomb(token) {
                console.log('loadBottomb')
                this.pageNob = this.pageNob + 1;

                let params = {
                    pageIndex: String(this.pageNob),
                    pageSize: String(this.pageSize)
                }
                if(token) {
                    params.token = token;
                }
                api.user.bill.index(params).then(res => {

                    if (!helper.isSuccess(res)) {
                        return
                    }

                    if (res.data) {
                        res.data = res.data.filter((item) => {
                            return item.billstatus == 3
                        })
                        if(res.data.length > 0){
                            this.dataList2.push(...res.data)
                        }else{
                            if(this.pageNob == 1) {
                                this.dataList2 = res.data
                            }else {
                                this.allLoadedb = true;
                                //this.nomoreShowb = true;
                            }
                        }
                    } else {
                        this.dataList2 = res.data;
                        //this.nomoreShowb = true;
                    }
                    this.requestFlag = true
                    this.$root.loadingClose();
                }).finally(() => {
                    this.bottomPullText = ''

                    if( this.$refs.loadmoreb) this.$refs.loadmoreb.onBottomLoaded();
                    this.$root.loadingClose();
                })
            },
            //刷新
            refresh(cb) {
                this.fetchData();
                setTimeout(() => {
                    cb && cb()
                }, 1000)
            },
            /**
             * 请求数据
             */
            fetchData() {
                this.loadBottoma();
                this.loadBottomb();
            },

            /**
             * 账单借款明细
             */
            computedLeftData(item) {
                let unit = '期';
                if (item.periodunit && item.periodunit == '1') {
                    unit = '天'
                }
                return item.loandate + '借(共' + item.loanperiod + unit + ')';
            },

            /**
             * 账单详情
             * @param item
             */
            toList(item) {
                //我的账单还清后，不可点击查看账单列表和账单详情
                if (item.billstatus==3 && item.isShowFeeText) {

                    return
                }
                this.$root.nextTitle = item.productname || '账单列表';
                this.$router.push({
                    name: 'billList2',
                    params: {
                        id: item.id,
                        productid: item.productid,
                        orderid: item.orderid,
                        loandate: item.loandate,
                    },
                })
            },
        },
        mounted() {
            this.$root.setStatusColor('black')
            this.$root.setWebAttribute({
                title: "账单"
            });

            this.loadBottoma();
            this.loadBottomb();
            //this.fetchData()
            console.log('新的账单页面')
            //this.pageControl.refresh()

        },
        onRefresh(tag, data) {
            if(tag == 'login'){
                console.log("收到通知了!,token是", data);
                this.pageNoa = 0;
                this.pageNob = 0;
                 this.dataList = [];
                this.dataList2 = [];
                this.loadBottoma(data);
                this.loadBottomb(data);
            }
            console.log('收到tab的消息了', tag)
            if (tag == "trust") {
                this.$root.setStatusColor('black')
                this.loadBottoma();
                this.loadBottomb();
            }
        },
        filters: {
            formatMoney(num = 0) {
                return Number(num).toFixed(2);
            }
        }
    }
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
        color: #69A2FC;
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


    .bill-list {
        padding-top: 10px;


    }

    /*数据列表子项*/
    .bill-item {
        padding: $gap $gap 0;
        @extend %border-b;
        background: #FFFFFF;
        border-radius: 4px;
        //margin-bottom: $gap;
        padding: 10px 16px;
        overflow: hidden;

        &:last-child {
            border: 0;
        }
    }

    .title-row {
        .title {
            font-size: $fontM;
            .c-icon {
                @include size(16px);
            }
        }
    }
    .state {
        font-size: $fontM;
        color: $light;
        &.red {
            color: $red;
        }
        &.green {
            color: $green;
        }
    }
    .icon-enter {
        @include size(12px);
    }

    .count-row {
        margin: 8px 0 4px 16px;
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
            border-top: 1px dashed #E6E6E6;
            margin: 0 5px;
        }
        .circle-left, .circle-right {
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
            @extend %border-r;
        }
    }

    .date-row {
        font-size: $fontM;
        color: $light;
        .line {
            height: 20px;
            @extend %border-r;
        }
    }
    .bill-item {
        &.state-done {
            .title, .state, .count-row, .detail-row {
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
            aspect-ratio: '180:140';
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
    p.noMore{
        text-align: center;
    }

    div.msgNotice {
        //background: #F5F5F5;
        background: linear-gradient(top, #F5F5F5 0%, #F5F5F5 100%);

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
        background: #FDD108;
        left: 33.7%;
        right: 32.7%;
        height: 2px;
    }
    .mint-tab-container {
        overflow: auto !important;
    }
</style>
