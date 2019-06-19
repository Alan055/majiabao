<template lang="html">
  <div class="view billIndex">
    <c-header class="header" title="我的账单" :show="true"></c-header>
    <!--主体-->
    <div class="bill-list c-view-content" v-if="isLogin">

      <!--有数据-->
      <div class="c-view-block" v-if="requestFlag && pageControl.dataList.length">
        <mt-loadmore class="load-more-wrap c-relative"
                   :top-method="refresh"
                   ref="loadmore"
                   :style="{minHeight: minHeight}"
        >
        <!--列表渲染-->
        <div class="bill-item"
             v-for="item in pageControl.dataList" :key="item.id"
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
              <c-icon class="icon-enter" type="enter" />
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
            <span class="c-flex-item c-tr bank-info">入账{{item.cardBankName}}尾号({{item.cardNoLast4}})</span>
          </p>
        </div>

        <!--加载更多/已经到底了-->
        <list-state :pageControl="pageControl" slot="bottom"  class="btm-loader-tips c-tc">

          <!-- 可以加载更多 -->
          <div slot="moreToLoad">
            努力加载中...
          </div>

        </list-state>
      </mt-loadmore>
      </div>

      <!--无数据-->
      <div class="bill-noList c-absolute" v-if="requestFlag && !pageControl.dataList.length"
      >
        <div class="bill-noList-img c-aspectratio w-180-140">
          <div class="c-aspectratio-content">
            <img src="../images/bill-no-data.png" alt="">
          </div>
        </div>
        <div class="bill-noList-text c-tc c-font-l">
          您暂时没有任何账单
        </div>
      </div>

    </div>
    <div class="no-login" v-min-height v-else>
      <p>请登录后查看~</p>
      <div class="btn" @click="handleLogin">去登录</div>
    </div>

  </div>
</template>

<script>
  import api from '@/services/api'
  import util from '@/utils'
  import {Toast} from '@/utils/helper'
  import PageControl from "../PageControl";
  import listState from '@/components/common/listState';
  import AppBridge from '@/services/AppBridge.js';

  export default {
    data() {
      return {
        // 数据列表
        pageControl: new PageControl({
          pageStart: 1,
          pageSize: '6',
          api: api.user.bill.index,
          keyPath: ['data']
        }),
        isLogin: !!util.getParams("token"),
        minHeight: 0,
        requestFlag: false
      }
    },
    computed: {
      period(){
          //periodunit 期数单位 1天，2月，3周，4年
          let unit = '期';
          if(this.data.withdrawInfo.periodunit){
              if(this.data.withdrawInfo.periodunit == '1'){
                  unit = '天'
              }
          }
          return this.data.withdrawInfo.loanperiod + unit
      }
    },
    beforeCreate () {

    },
    created() {
        if(!this.isLogin) {
            this.$root.loadingClose();
        }
        AppBridge.setStatusColor({color: "000000", mode: "black"});
        // 设置头
        this.$root.setWebAttribute({
            title: '我的账单'
        });

        // 监听刷新结束后回调
        this.pageControl.onRefresh = () => {

            if (!this.requestFlag) {
                // 关闭跳金币
                this.$root.loadingClose();
            }

            this.requestFlag = true;

            this.$nextTick(() => {
            this.$refs.loadmore.onTopLoaded();
            this.calcHeight();
            })
      }

      // 监听加载更多回调
      this.pageControl.onLoadMore = (res, path) => {
        this.calcHeight();
      }

      // 进页面先加载一次数据
      this.refresh()
    },
    methods: {
        handleLogin() {
          AppBridge.goNative({
            pkg: "login"
          });
        },
        computedLeftData(item) {
            let unit = '期';
            if(item.periodunit && item.periodunit == '1'){
                unit = '天'
            }
            return item.loandate + '借(共' + item.loanperiod + unit + ')';
        },
        toList (item) {

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
        // 下拉刷新触发回调
        refresh(flag = false) {
            if (typeof flag !== 'boolean') {
            flag = false
            }
            this.pageControl.refresh(flag)
        },
        // 动态计算最小(一屏)高度
        calcHeight (type = '') {

            let domHeight = this.$refs['loadmore' + type].$el.offsetHeight;
            let domOffsetTop = document.getElementsByClassName('c-view-block')[0].offsetTop;

            let windowHeight =  document.body.clientHeight;

            if (domOffsetTop + domHeight < windowHeight) {
            this['minHeight' + type] = windowHeight - domOffsetTop + 'px';
            }

        }
    },
    onRefresh(tag, data) {

        if(tag == 'login'){
            this.isLogin = !!data;
            this.refresh()
        }
    },
    filters : {
      formatMoney (num = 0) {
        return Number(num).toFixed(2);
      }
    },
    components: {
      listState
    }
  }
</script>

<style lang="scss" scoped>
  .bill-list{
    padding: $gap $gap 0;
  }
  /*数据列表子项*/
  .bill-item{
    background: #FFFFFF;
    box-shadow: 0 0 20px 0 rgba(0,0,0,0.10);
    border-radius: 4px;
    margin-bottom: $gap;
    padding: 10px 16px;
    overflow: hidden;
  }

  .title-row{
    .title{
      font-size: $fontM;
      .c-icon{
        @include size(16px);
      }
    }
    .state{
      font-size: $fontS;
      color: $light;
      &.red{
        color: $red;
      }
      &.green{
        color: $green;
      }
    }
    .icon-enter{
      @include size(12px);
    }
  }

  .count-row{
    margin: 16px 0;
    .count-title{
      font-size: $fontL;
    }
    .count{
      font-size: $fontXL;
    }
  }

  /*分割线*/
  .gap{
    position: relative;
    margin: 0 -16px 10px -16px;

    .line{
      border-top: 1px dashed #E6E6E6;
      margin: 0 5px;
    }
    .circle-left, .circle-right{
      @include circle(10px);
      background: rgba(0,0,0,0.05);
      position: absolute;
      top: -5px;
    }
    .circle-left{
      left: -5px;
    }
    .circle-right{
      right: -6px;
    }
  }

  /*借款明细*/
  .detail-row{
    font-size: $fontS;
    color: $light;
    .line{
      height: 20px;
      @extend %border-r;
    }
  }

  .bill-item{
    &.state-done{
      .title, .state, .count-row, .detail-row{
        color: $light!important;
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
      height: 154px;
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

  .billIndex {
    .mint-loadmore {
      overflow: visible;
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
    .mint-tab-container-item, .c-view-content,.mint-tab-container-wrap {
      height: auto!important;
      flex: 1;
    }
  }

  .state-done.bill-item {
    /*图片置灰*/
    .c-icon {
      filter: grayscale(100%);
    }
  }
  .no-login {
    margin-top: 100px;
    text-align: center;
    color: #666;

    .btn {
      display: inline-block;
      margin-top: 10px;
      color: white;
      text-align: center;
      background-image: linear-gradient(90deg, #EF7823 3%, #FABA4A 100%);
      border-radius: 4px;
      padding: 4px 20px;
    }
  }

</style>
