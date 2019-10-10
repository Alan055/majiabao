<template lang="html">
    <div class="bill-index-page c-bg-gray">
        <!-- <c-header ref="transparentHeader" class="header" :style="`border: 0;background: rgba(255, 255, 255, 1}); color: black;`" title="账单" :show="true"></c-header>
 -->
        <nav class="bill-nav">
            <ul>
                <li :class="{active: navActive == 1}" @click="navActive = 1">
                    <span>待还款</span>
                </li>
                <li :class="{active: navActive == 2}" @click="navActive = 2">
                    <span>已结清</span>
                </li>
            </ul>
        </nav>

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
            <div class="bill-list c-view-content" :style="`min-height: ${minHeight}px`" v-if="navActive == 1 && requestFlag && dataList.length">
                <div class="bill-item"
                        v-for="item in dataList" :key="item.id"
                        @click="toList(item)"
                        v-sinaAds="adsInfo.bill.index.clickBill"
                >
                    <p class="c-flex-row c-v-center title-row">

                        <span class="c-flex-item c-tl title">
                            <img class="c-icon c-financing-logo" :src="item.iconurl" alt="">
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
            <div class="c-view-content bill-noList c-absolute" v-if="navActive == 1 && requestFlag && !dataList.length">
                <div class="bill-noList-img c-aspectratio w-180-140">
                    <div class="c-aspectratio-content2">
                        <img style="width: 100px;" src="../../assets/images/message-nodata.png" />
                    </div>
                </div>
                <div class="bill-noList-text c-tc c-font-l">
                    您暂时没有待还账单
                </div>
            </div>
            <div class="bill-list c-view-content" :style="`min-height: ${minHeight}px`" v-if="navActive == 2 && requestFlag && dataList2.length">
                    <div class="bill-item"
                            v-for="item in dataList2" :key="item.id"
                            @click="toList(item)"
                            v-sinaAds="adsInfo.bill.index.clickBill"
                    >
                        <p class="c-flex-row c-v-center title-row">

                            <span class="c-flex-item c-tl title">
                                <img class="c-icon c-financing-logo" :src="item.iconurl" alt="">
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

            <div class="c-view-content bill-noList c-absolute" v-if="navActive == 2 && requestFlag && !dataList2.length">
                <div class="bill-noList-img c-aspectratio w-180-140">
                    <div class="c-aspectratio-content2">
                        <img style="width: 100px;" src="../../assets/images/message-nodata.png" />
                    </div>
                </div>
                <div class="bill-noList-text c-tc c-font-l">
                    您暂时没有结清账单
                </div>
            </div>
        </scroller>
    </div>

</template>

<script>
    import api from '@/services/api'
    import {Toast} from '@/utils/helper'
    import PageControl from "../../PageControl";
    import {Indicator, Loadmore} from "mint-ui";
    import helper from "@/utils/helper";
    import scroller from "@/components/view/scroller";

    export default {
        data() {
            return {
                navActive: 1,
                minHeight: window.innerHeight - 83,
                pageNo: 1,
                pageNoa: 0,
                pageNob: 0,
                pageSize: 10000,
                dataList: [],
                dataList2: [],
                requestFlag: false,
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
                            }
                        }
                    } else {
                        this.dataList = res.data;
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
                            }
                        }
                    } else {
                        this.dataList2 = res.data;
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
                        overduedays: item.overduedays
                    },
                })
            },
        },
        mounted () {
            this.$root.setStatusColor('black')
            this.$root.setWebAttribute({
                title: "账单"
            });

            this.loadBottoma();
            this.loadBottomb();
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

    .bill-index-page {
        .bill-nav {
            background: #FFFFFF;
            height: 44px;
            line-height: 44px;

            ul {
                height: 100%;
                display: flex;

                li {
                    height: 100%;
                    width: 50%;
                    text-align: center;
                    color: #999999;

                    span {
                        display: inline-table;
                        height: 100%;
                    }

                    &.active {
                        font-size: 14px;
                        color: #333333;

                        span {
                            border-bottom: 2px solid #FDD108;
                        }
                    }
                }
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
            margin: 8px 0 2px 16px;
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
            .time {
                margin-left: 2px;
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
                text-align: center;
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
    }

    .c-financing-logo {
        display: inline;
        margin-right: 0 !important;
    }
    /deep/ .pull-refres-bill {
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
</style>
