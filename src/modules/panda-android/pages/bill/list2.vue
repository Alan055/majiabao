<template lang="html">
    <div class="view bill-detail-page">
        <div class="c-view-content c-bg-gray" v-min-height>
            <div class="bill-header">
                <div class="bill-header-title">应还金额（元）</div>
                <div class="bill-header-money">{{loanMoney}}</div>
                <div class="bill-status-img">
                    <img v-if="firstData.status == 2" src="../../assets/images/jieqing.png"/>
                </div>
                <div class="bill-header-subtitle">
                    <span class="status1" v-if="firstData.status == 1">待还款，最近还款日 {{firstData.loanDay}}</span>
                    <span class="status2" v-if="firstData.status == 2">好借好还，再借不难</span>
                    <span class="status3" v-if="firstData.dueDay && firstData.status == 3">已逾期{{firstData.dueDay}}天，请尽快还款</span>
                </div>
            </div>
            <div class="bill-detail">
                <div class="title">借款明细</div>
                <div class="list">

                    <div class="list-item">
                        <div class="left-title">分期期数</div>
                        <div class="right-content">{{billList.length}}期</div>
                    </div>

                    <div class="list-item">
                        <div class="left-title">借款时间</div>
                        <div class="right-content">{{routeParams.loandate}}</div>
                    </div>

                    <div class="list-item">
                        <div class="left-title">借款协议</div>
                        <div class="right-content see-agreement" @click="gotoAgreements">查看</div>
                    </div>
                </div>
            </div>
            <div class="bill-plan">
                <div class="title">还款计划</div>
                <div class="list">
                    <div :class="['list-item', item.isClear ? 'clear':'']" v-for="(item, i) in billList" :key="i" @click="handleListClick(item)">
                        <div class="list-row">
                            <div class="left-title">第{{item.period}}期</div>
                            <div class="right-title">
                                <span class="state">¥ {{item.dueamount}}</span>
                                <c-icon class="icon-enter" type="enter"/>
                            </div>
                        </div>
                        <div class="list-row">
                            <div class="left-date">还款日：{{item.paydate}}</div>
                            <div class="right-content">
                                <span class="status0" v-if="item.status == 0">未开始</span>
                                <span class="status1" v-if="item.status == 1">待还款</span>
                                <span class="status2" v-if="item.status == 2">已结清</span>
                                <span class="status3" v-if="item.status == 3">已逾期
                                    <!-- {{computedDueDay(item)}}天 -->
                                </span>
                                <span class="status4" v-if="item.status == 4">逾期已结清</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bill-plan-space"></div>
        </div>

        <div class="footer-plan" v-if="footerPlan" v-html="footerPlan"></div>

        <Popup :value="isPopupShow">
            <div class="bill-detail-dialog" slot="content">
                <div class="dialog-title">
                    <span>第{{detailData.period}}期账单详情</span>
                    <span class="close" @click="isPopupShow = !isPopupShow"></span>
                </div>
                <div class="dialog-content">
                    <span class="dialog-cricle cricle-left"></span>
                    <span class="dialog-cricle cricle-right"></span>
                    <div class="dialog-sub-title">
                        应还款金额（元）
                    </div>
                    <div class="dialog-loan-money">
                        {{detailData.repayAmount}}
                    </div>
                    <div class="dialog-list">
                        <div class="dialog-list-item" v-for="(item, i) in detailData.billItemVOList" :key="i" v-if="item.amount > 0">
                            <div class="left-title">{{item.desc}}</div>
                            <div class="right-content">{{item.amount}}</div>
                        </div>
                    </div>
                    <div class="dialog-list" v-if="detailData.billProgressList && detailData.billProgressList.length > 0">
                        <div class="dialog-list-item">
                            <div class="left-title">还款时间</div>
                            <div class="right-content">{{detailData.billProgressList[0].createtime}}</div>
                        </div>
                        <div class="dialog-list-item">
                            <div class="left-title">还款账户</div>
                            <div class="right-content">{{detailData.cardBank}}(尾号{{detailData.cardNoLast4}})</div>
                        </div>
                    </div>
                </div>

            </div>
        </Popup>
    </div>
</template>

<script>
    import PageControl from "@/utils/PageControl";
    import api from '@/services/api';
    import helper from '@/utils/helper';
    import util from "@/utils";
    ;
    import Popup from '@/components/view/popup';
    import { Toast, Indicator } from "@/utils/helper";

    export default {
        data() {
            return {
                routeParams: {},
                billList: [],
                billUnClearedList: [],
                billClearedList: [],
                loanMoney: '',
                currentDay: moment(),
                firstData: {
                    status: '',
                    dueDay: '',
                    loanDay: ''
                },
                isPopupShow: false,
                detailData: {
                    period: '',
                    repayAmount: '',
                    billItemVOList: [],
                    billProgressList: []
                },
                footerPlan: ''
            }
        },
        computed: {
            computedDueDay(item) {
                return (item) => {
                    return this.currentDay.diff(moment(item.paydate), 'day')
                }
            }
        },
        components: {
            Popup,
        },
        methods: {
            gotoAgreements() {

                this.sinaAds.click(this.adsInfo.bill.list.clickLoanList);

                this.$root.nextTitle = '借款协议';

                if (this.$root.isApp) {

	                this.$AppBridge.getInitData(res => {
		                if (res && res.data.pageaddress) {
			                let agreement = res.data.pageaddress.find(e=>(e.type == 'USER_AGREEMENTS'))
			                console.log("跳转的url", agreement.url)
			                this.$root.openUrl({url: agreement.url+'/' + this.routeParams.productid + '/' + this.routeParams.orderid, title: '借款协议'});
		                }
	                })

                } else {

                    this.$router.push({
                        path: `/agreements/loanList/${this.routeParams.productid}`
                    })

                }

            },
            getBillList1() {
                return new Promise((resolve, reject) => {
                    api.user.bill.list({
                        pageIndex: '1',
                        pageSize: '99',
                        type: '1',
                        billid: this.routeParams.id

                    }).then(res => {
                        if (!helper.isSuccess(res)) {
                            Toast(res.msg)
                            return
                        }

                        if (res.data && res.data.billUnClearedList) {
                            this.billUnClearedList = res.data.billUnClearedList;
                        }else {
                            this.allLoadeda = true;
                            this.nomoreShowa = true;
                        }

                        resolve(res)
                    })
                })
            },
            //结清账单
            getBillList2() {
                return new Promise((resolve, reject) => {
                    api.user.bill.list({
                        pageIndex: '1',
                        pageSize: '99',
                        type: '2',
                        billid: this.routeParams.id

                    }).then(res => {
                        if (!helper.isSuccess(res)) {
                            Toast(res.msg)
                            return
                        }

                        if (res.data && res.data.billClearedList) {
                            this.billClearedList = res.data.billClearedList.map((item) => {
                                return Object.assign(item, {
                                    isClear: true
                                })
                            });
                        }

                        resolve(res)
                    })
                })

            },
            handleListClick(item) {
                Indicator.open();
                this.getBillDetail(item.id).then(() => {
                    this.isPopupShow = true;
                    Indicator.close();
                })
            },
            getBillDetail(id) {
                return new Promise((resolve, reject) => {
                    api.user.bill
                        .detail({
                            billdetailid: id
                        })
                        .then(res => {

                            if (!helper.isSuccess(res)) {
                                return;
                            }
                            this.detailData = res.data;

                            resolve(res)
                        })
                })
            },
            //查询底部文案
            queryPlans() {
                api.queryPlans({
                    fundproductid: this.routeParams.productid,
                    modeltype: '3',
                    configtype: '4',
                    status: '',

                }).then(res => {


                    if (!helper.isSuccess(res)) {
                        Toast(res.msg)
                        return
                    }

                    if (res.data && res.data.length) {

                        let data = res.data.filter(item => {
                            return item.type == 50
                        })

                        if (data.length && data[0].content) {
                            this.footerPlan = data[0].content
                        }
                    }

                }).catch(e => {

                })

            },
        },
        activated () {
            this.$root.getRouteData().then(params => {
                this.routeParams = params
                console.log('this.routeParams', this.routeParams)

                Promise.all([this.getBillList1(), this.getBillList2()]).then((values) => {
                    let billList = this.billUnClearedList.concat(this.billClearedList);
                    billList.forEach((item) => {
                        this.loanMoney = (Number(this.loanMoney) + Number(item.dueamount)).toFixed(2);
                    })
                    if(billList.length > 0) {
                        console.log('billList[0]', billList[0])
                        this.firstData.status = billList[0].status;
                        this.firstData.loanDay = billList[0].paydate;

                        //this.firstData.dueDay = this.currentDay.diff(moment(billList[0].paydate), 'day');
                        this.firstData.dueDay = this.routeParams.overduedays;
                    }
                    this.billList = billList;
                });

                this.queryPlans();
            })

        },
        watch: {

        }

    }
</script>

<style lang="scss" scope>

    .bill-detail-page {
        .bill-header {
            position: relative;
            background: white;
            margin-bottom: 8px;

            .bill-header-title {
                font-size: 14px;
                color: #666666;
                letter-spacing: 0.12px;
                text-align: center;
                padding-top: 14px;
            }
            .bill-header-money {
                font-size: 26px;
                color: #333333;
                letter-spacing: 0.23px;
                text-align: center;
                margin-bottom: 8px;
            }
            .bill-status-img {
                position: absolute;
                width: 70px;
                height: 70px;
                right: 10px;
                top: 10px;

                img {
                    width: 100%;
                }
            }
            .bill-header-subtitle {
                font-size: 14px;
                letter-spacing: 0.12px;
                text-align: center;
                padding-bottom: 25px;

                &.red {
                    color: #D54740;
                }

                .status1 {
                    color: #666666;
                }
                .status2 {
                    color: #666666;
                }
                .status3 {
                    color: #D54740;
                }
            }
        }

        .bill-detail {
            background: white;
            padding: 14px;
            margin-bottom: 8px;

            .title {
                font-size: 16px;
                color: #333333;
            }

            .list {
                padding: 14px 0 6px 0;
                background: white;
                .list-item {
                    display: flex;
                    justify-content: space-between;
                    padding-bottom: 8px;
                    color: #666666;

                    .right-content {
                        display: flex;
                        font-size: 14px;
                    }

                    .see-agreement {
                        color: #4A90E2;
                    }

                }
            }

        }

        .bill-plan {
            position: relative;
            background: white;
            padding: 14px;

            .title {
                font-size: 16px;
                color: #333333;
                padding-bottom: 14px;
            }

            .list {
                .list-row {
                    display: flex;
                    justify-content: space-between;

                    .left-title,
                    .right-title {
                        font-size: 16px;
                        color: #333333;
                        padding: 11px 0 5px 0;
                    }

                    .left-date,
                    .right-content {
                        font-size: 14px;
                        color: #999999;
                        padding-bottom: 14px;
                    }
                    .right-content {
                        margin-right: 20px;
                        .status1 {
                            color: #42B05A;
                        }
                        .status2 {
                            color: #ADADAD;
                        }
                        .status3 {
                            color: #D54740;
                        }
                        .status4 {
                            color: #ADADAD;
                        }
                    }
                }
                .list-item {
                    @extend %border-t;
                }
            }
            .clear {
                .left-date,
                .right-content,
                .left-title,
                .right-title {
                    color: #ADADAD !important;
                }
            }
        }

        .bill-plan-space {
            height: 88px;
            width: 100%;
            background-color: transparent;
        }

        .footer-plan {
            background: #f4f4f4;
            position: absolute;
            bottom: 0;
            padding: 20px;
            line-height: 16px;
            color: #999;
        }
    }

    .bill-detail-dialog {
        background-color: #fff;
        width: 329px;
        .dialog-title {
            position: relative;
            background: #e8e7e7;
            font-size: 16px;
            color: #333333;
            padding: 14px;
            text-align: center;

            .close{
                display: inline-block;
                float: right;
                width: 14px;
                height: 14px;
                background: url("../../assets/images/close.png") no-repeat;
                background-size: cover;
                margin-top: 2px;
                padding: 2px 4px;
            }

        }
        .dialog-content {
            text-align: center;
            position: relative;

            .dialog-cricle {
                background: #666;
                height: 10px;
                width: 10px;
                border-radius: 50%;
                position: absolute;
                display: block;
                top: -5px;
            }
            .cricle-left {
                left: -5px;
            }
            .cricle-right {
                right: -5px;
            }

            .dialog-sub-title {
                font-size: 14px;
                color: #666666;
                padding: 20px 0 6px 0;
            }
            .dialog-loan-money {
                font-size: 18px;
                color: #333333;
                padding-bottom: 18px;
            }
        }

        .dialog-list {
            @extend %border-t;
            padding: 16px;

            .dialog-list-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                color: #666666;
            }
        }
    }
</style>
