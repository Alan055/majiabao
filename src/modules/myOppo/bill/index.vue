<template lang="html">
    <div class=" billIndex">
        <!--主体-->
        <!--有数据-->
            <mt-loadmore
                v-if="requestFlag && dataList.length"
                :bottom-method="loadBottom"
                :bottom-all-loaded="noMore"
                :bottom-pull-text="bottomPullText"
                :top-method="topRefresh"
                :top-pull-text="topPullText"
                ref="loadmorea"
                style="padding: 0; margin: 0"
            >
                <div class="top-tip">
                    <p>借款资金由对应放款服务方提供，平台仅提供借款撮合服务，不参与实际放款。</p>
                </div>
                <div class="bill-list">

                    <!--列表渲染-->
                    <div class="bill-item"
                         v-for="item in dataList" :key="item.id"
                         :class="{'state-done': item.billstatus == 3}"
                         @click="toList(item)"
                         v-sinaAds="adsInfo.bill.index.clickBill"
                    >

                        <p class="c-flex-row c-v-center title-row">

                            <!--账单资金方-->
                            <span class="c-flex-item c-tl title">
              <img class="c-icon" :src="item.iconurl" alt="">
              {{item.productname}}
            </span>

                            <!--账单状态-->
                            <span class="c-flex-item c-tr">
              <span class="state green" v-if="item.billstatus == 1">待还款</span>
              <span class="state red" v-if="item.billstatus == 2">已逾期</span>
              <span class="state" v-if="item.billstatus == 3">已结清</span>
              <c-icon v-if="!(item.billstatus == 3 && item.isShowFeeText)" class="icon-enter" type="enter"/>
            </span>
                        </p>

                        <!--账单借款金额-->
                        <p class="c-flex-row c-v-center count-row">
                            <span class="c-flex-item c-tl count-title">借款金额(元)</span>
                            <span class="c-flex-item c-tr count">{{item.loanamount | formatMoney}}</span>
                        </p>

                        <!--分割线-->
                        <div class="gap">
                            <div class="line"></div>
                            <div class="circle-left"></div>
                            <div class="circle-right"></div>
                        </div>

                        <!--账单借款明细-->
                        <p class="c-flex-row c-v-center detail-row">
                            <span class="c-flex-item c-tl time" v-html="computedLeftData(item)"></span>
                            <span class="line"></span>
                            <span
                                class="c-flex-item c-tr bank-info">入账{{item.cardBankName}}尾号({{item.cardNoLast4}})</span>
                        </p>
                    </div>

                </div>

                <p v-if="(noMore && !(dataList &&  dataList.length>0 && dataList.length<pageSize))  "  class="noMore">无更多数据....</p>

            </mt-loadmore>

        <!--无数据-->
        <div class="bill-noList c-absolute" v-if="requestFlag && !dataList.length">
            <div class="bill-noList-img c-aspectratio w-180-140">
                <div class="c-aspectratio-content">
                    <img src="@/assets/images/my/bill/no_list@2x.png" alt="">
                </div>
            </div>
            <div class="bill-noList-text c-tc c-font-l">
                您暂时没有任何账单
            </div>
        </div>
    </div>
</template>

<script>
    import api from '@/services/api'
    import {Toast} from '@/utils/helper'
    import PageControl from "@/utils/PageControl";
    import listState from '@/components/common/listState'
    import {Indicator, Loadmore} from "mint-ui";
    import helper from "@/utils/helper";

    import scroller from "@/components/view/scroller";


    export default {
        data() {
            return {

                /****************/

                pageNo: 1,
                pageSize: 6,
                dataList: [],
                requestFlag: false,
                noMore: false, //是否还有更多
                bottomPullText: '',
                topPullText: '',


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
            }
        },

        methods: {

            /**
             * 下拉刷新
             */
            topRefresh() {
                this.pageNo = 1
                this.topPullText = '下拉刷新'
                this.fetchData()
            },

            /**
             * 请求数据
             */
            fetchData(type) {

                try {
                    api.user.bill.index({
                        pageIndex: this.pageNo,
                        pageSize: this.pageSize,

                    }).then(res => {

                        if (!helper.isSuccess(res)) {
                            Toast(res.msg)
                            return
                        }

                        this.requestFlag = true
                        if (res.data && res.data.length) {

                            if (type == 'load') {
                                this.dataList.push(...res.data)
                            } else {
                                this.dataList = res.data
                            }

                        } else {
                            this.noMore = true;
                        }
                        this.$root.loadingClose();
                    }).catch(e => {

                        Toast(e)

                    }).finally(() => {

                        this.bottomPullText = ''

                        if( this.$refs.loadmorea) this.$refs.loadmorea.onBottomLoaded();
                        this.$root.loadingClose();
                    })
                } catch (error) {
                    this.$root.loadingClose();
                }

            },


            loadBottom() {
                this.pageNo++
                this.bottomPullText = '上拉刷新'
                this.fetchData('load')
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

               /* console.log(JSON.stringify(item, null, 2));
                return*/

                //我的账单还清后，不可点击查看账单列表和账单详情
                if (item.billstatus==3 && item.isShowFeeText) {
                    console.log('我的账单还清后，不可点击===》',JSON.stringify(item,null,2));
                    return
                }
                this.$root.nextTitle = item.productname || '账单列表';
                this.$router.push({
                    name: 'billList',
                    params: {
                        id: item.id,
                        productid: item.productid,
                        orderid: item.orderid
                    },
                })
            },

        },

        mounted() {
            this.fetchData()
        },

        filters: {
            formatMoney(num = 0) {
                return Number(num).toFixed(2);
            }
        },
        components: {
            listState,
            scroller,
        }
    }
</script>

<style lang="scss" scoped>

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



    .bill-list {
        padding: $gap $gap 0;
    }

    /*数据列表子项*/
    .bill-item {
        background: #FFFFFF;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.10);
        border-radius: 4px;
        margin-bottom: $gap;
        padding: 10px 16px;
        overflow: hidden;
    }

    .title-row {
        .title {
            font-size: $fontM;
            .c-icon {
                @include size(16px);
            }
        }
        .state {
            font-size: $fontS;
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
    }

    .count-row {
        margin: 16px 0;
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
        font-size: $fontS;
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
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
        /*展示图片样式*/
        .bill-noList-img {
            width: 180px;
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
            color: #666666;
        }
    }

</style>

<style lang="scss">


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

    .billIndex {
        height: 100%;
        overflow-y: scroll;
        .mint-loadmore {
            overflow: visible;
        }
        .load-more-wrap {
            padding: 0 0 0px 0;
        }

        .btm-loader-tips {
            width: 100%;
            height: 40px;
            line-height: 40px;
        }

        .mint-tab-container-item {
            width: 100vw;
        }
        .mint-tab-container, .mint-tab-container-item {
            display: flex;
        }
        .mint-tab-container-item, .c-view-content, .mint-tab-container-wrap {
            height: auto !important;
            flex: 1;
        }
    }

    .state-done.bill-item {
        /*图片置灰*/
        .c-icon {
            filter: grayscale(100%);
        }
    }

</style>
