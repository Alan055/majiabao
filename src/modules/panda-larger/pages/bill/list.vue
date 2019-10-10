<template lang="html">
    <div class="view billList">

        <!--tab-->
        <div class="h-44" v-show="isShowTab">
            <mt-navbar v-model="selected">
                <!--需求： 只有待还款时 不显示tab （已结清同理）-->
                <mt-tab-item id="1">待还款账单</mt-tab-item>
                <mt-tab-item id="2">已结清账单</mt-tab-item>
            </mt-navbar>
        </div>
        <!--tab-container-->

        <div class="hackOppo" v-if="requireFinish" :class="{'c-top': !isShowTab}">
            <mt-tab-container v-model="selected" :swipeable="false" class="c-view-block">

                <!--待还款-->
                <mt-tab-container-item id="1" v-if="pageControl1.dataList.length">
                    <div class="c-view-content" @scroll="pageControl1.scroll($event)">

                        <!--上下拉组件-->
                        <mt-loadmore class="load-more-wrap c-relative"
                                     :top-method="refresh1"
                                     ref="loadmore1"
                                     :style="{minHeight: minHeight1}"
                        >

                            <!--列表数据-->
                            <div class="bill-list">
                                <bill-list-item v-for="item in pageControl1.dataList" :key="item.id" :item="item"
                                                v-sinaAds="{
                  currEvent: adsInfo.bill.list.clickBillList,
                  currEventParams: {type: 0}}"
                                />
                            </div>

                            <!--加载更多/已经到底了-->
                            <list-state :pageControl="pageControl1" slot="bottom" class=" c-tc">

                                <!--没有更多了-->
                                <div slot="noMore">
                                </div>
                                <!-- 可以加载更多 -->
                                <div slot="moreToLoad">
                                    努力加载中...
                                </div>

                            </list-state>

                        </mt-loadmore>

                        <div v-if="copyBottomDesc" class="copyBottomDesc" v-html="copyBottomDesc">
                        </div>


                    </div>

                </mt-tab-container-item>

                <!--已结清-->
                <mt-tab-container-item id="2" v-if="pageControl2.dataList.length">
                    <div class="c-view-content" @scroll="pageControl2.scroll($event) ">

                        <!--上下拉组件-->
                        <mt-loadmore class="load-more-wrap c-relative"
                                     :top-method="refresh2"
                                     ref="loadmore2"
                                     :style="{minHeight: minHeight2}"
                        >

                            <!--数据列表-->
                            <div class="bill-list">
                                <bill-list-item v-for="item in pageControl2.dataList" :key="item.id" :item="item"
                                                v-sinaAds="{
                  currEvent: adsInfo.bill.list.clickBillList,
                  currEventParams: {
                    type: 1
                  }
                }"
                                />
                            </div>

                            <!--加载更多/已经到底了-->
                            <list-state :pageControl="pageControl2" slot="bottom" class=" c-tc">

                                <!--没有更多了-->
                                <div slot="noMore">
                                </div>
                                <!-- 可以加载更多 -->
                                <div slot="moreToLoad">
                                    努力加载中...
                                </div>

                            </list-state>

                        </mt-loadmore>
                        <div v-if="copyBottomDesc" class="copyBottomDesc" v-html="copyBottomDesc">
                        </div>
                    </div>

                </mt-tab-container-item>

            </mt-tab-container>



        </div>


    </div>
</template>

<script>
    import billListItem from './components/billListItem.vue';
    import PageControl from "@/utils/PageControl";
    import listState from '@/components/common/listState'
    import api from '@/services/api';
    import helper from '@/utils/helper';
    import {Toast} from '@/utils/helper';
    import AppBridge from '@/services/AppBridge';


    export default {
        data() {
            return {
                selected: '1',
                routeParams: {},

                pageControl1: new PageControl({
                    pageStart: 1,
                    pageSize: '6',
                    api: api.user.bill.list,
                    keyPath: ['data', 'billUnClearedList']
                }),
                pageControl2: new PageControl({
                    pageStart: 1,
                    pageSize: '6',
                    api: api.user.bill.list,
                    keyPath: ['data', 'billClearedList']
                }),
                minHeight1: 0, // 设置最小高度 （刷新触发计算）
                minHeight2: 0, // 设置最小高度 （刷新触发计算）

                // 请求结束标识 （特殊）
                requestFlag: {
                    billUnCleared: false,
                    billCleared: false
                },

                //底部
                copyBottomDesc: '',
            }
        },
        components: {
            billListItem, listState
        },
        computed: {

            // 是否显示TAB
            isShowTab() {
                return this.pageControl1.dataList.length !== 0 && this.pageControl2.dataList.length !== 0
            },

            // 用于控制渲染Dom （mint-ui 上下拉组件swipeable 属性 不支持实时更新状态）
            requireFinish() {

                // 请求结束后， 判断显示是否单列显示 （改变selected）
                if (this.requestFlag.billUnCleared && this.requestFlag.billCleared) {
                    // 待还款  无数据 && 已结清 有数据
                    // 显示已结清
                    if (!(this.pageControl1.dataList && this.pageControl1.dataList.length) && (this.pageControl2.dataList && this.pageControl2.dataList.length)) {
                        this.selected = '2';
                    }
                }

                return this.requestFlag.billUnCleared && this.requestFlag.billCleared;
            }

        },
        methods: {
            gotoAgreements() {

                this.sinaAds.click(this.adsInfo.bill.list.clickLoanList);

                this.$root.nextTitle = '借款协议';

                if (this.$root.isApp) {

	                AppBridge.getInitData(res => {
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
            setTitle() {

                // 设置右上角
                AppBridge.setWebTitleAttribute({
                    btnType: 'text',
                    btnVal: '借款协议'
                }, () => {
                    this.gotoAgreements();
                });

            },

            // 下拉刷新触发回调
            refresh1(flag = false) {
                if (typeof flag !== 'boolean') {
                    flag = false
                }
                this.pageControl1.refresh(flag)
            },
            refresh2(flag = false) {
                if (typeof flag !== 'boolean') {
                    flag = false
                }
                this.pageControl2.refresh(flag)
            },

            // 动态计算dom最小高度 (撑满一屏)
            calcHeight(type) {
                let domHeight = this.$refs['loadmore' + type].$el.offsetHeight;
                let domOffsetTop = document.getElementsByClassName('hackOppo')[0].offsetTop;
                let windowHeight = document.body.clientHeight;

                if (domOffsetTop + domHeight < windowHeight) {
                    this['minHeight' + type] = windowHeight - domOffsetTop-80 + 'px';  //减去内外边距的值
                }

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
                            this.copyBottomDesc = data[0].content
                        }
                    }

                }).catch(e => {

                   // Toast(e)

                    console.error('queryPlans error===>',e);

                })

            },

        },
        created() {
            let _this = this;
            this.$root.getRouteData().then(params => {
                this.routeParams = params

                this.setTitle();

                this.queryPlans()

                // 监听刷新结束后回调
                this.pageControl1.onRefresh = () => {
                    // 第一次请求接口 关闭loading
                    if (!this.requestFlag.billUnCleared && this.requestFlag.billCleared) {
                        this.$root.loadingClose();
                    }
                    this.requestFlag.billUnCleared = true;
                    this.$nextTick(() => {

                        if (this.$refs.loadmore1) {
                            this.$refs.loadmore1.onTopLoaded();
                            this.calcHeight(1);
                        }
                    })
                }
                this.pageControl2.onRefresh = () => {
                    // 第一次请求接口 关闭loading
                    if (this.requestFlag.billUnCleared && !this.requestFlag.billCleared) {
                        this.$root.loadingClose();
                    }
                    this.requestFlag.billCleared = true;
                    this.$nextTick(() => {

                        if (this.$refs.loadmore2) {
                            this.$refs.loadmore2.onTopLoaded();
                            this.calcHeight(2);
                        }
                    })

                }

                // 监听加载更多回调
                this.pageControl1.onLoadMore = (res, path) => {
                    this.calcHeight(1);
                }
                this.pageControl2.onLoadMore = (res, path) => {
                    this.calcHeight(2);
                }

                // 设置请求参数
                this.pageControl1.getParams = (res) => {
                    return {
                        billid: params.id,
                        type: '1'
                    };
                }
                this.pageControl2.getParams = (res) => {
                    return {
                        billid: params.id,
                        type: '2'
                    };
                }


                // 进页面先加载一次数据
                this.refresh1()
                this.refresh2()
            })

        },
        watch: {
            selected(newVal) {
                this.calcHeight(newVal);
                if (newVal == 1) {
                    this.sinaAds.click(this.adsInfo.bill.list.clickNavTab1);
                } else if (newVal == 2) {
                    this.sinaAds.click(this.adsInfo.bill.list.clickNavTab2);
                }
            }
        }

    }
</script>

<style lang="scss">


    .billList {
        position: relative;

        div.copyBottomDesc{
            z-index: 1;
            font-size: 12px;
            color: #333;
            width: 100%;
            letter-spacing: 1px;
            padding: 8px 12px 22px 12px;
        }

        .load-more-wrap {
            padding: 0 0 40px 0;
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
</style>
<style lang="scss" scoped>
    .c-top {
        top: 0 !important;
    }

    .h-44 {
        height: 44px;
    }

    .hackOppo {
        position: absolute;
        top: 44px;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
    }

    .c-view-content {

    }

    .c-view-content {
        height: 100%;
    }

    .bill-list {
        padding: $gap;
    }

    .header-text {
        color: $textColor;
    }

</style>
