<template lang="html">
    <div class="view c-bg-gray">

        <div class="c-view-content bill-detail">
            <p class="c-gap-title">账单明细</p>

            <div class="c-section detail-wrap">
                <p class="title">应还金额(元)</p>
                <p v-if="!data.isShowFeeText" class="count">{{data.repayAmount}}</p>
                <p v-else class="count">{{data.isShowFeeText}}</p>


                <div v-for="row in feeItem" class="dataList">

                   <!-- :class="{ 'borderNone':index2==row.length-1}"-->
                    <template v-for="(item,index2) in row">
                        <p v-if="[1,2].indexOf(item.feeitemtype)==-1 && data.isShowFeeText"><span>{{item.desc}}：</span>
                            <span>{{data.isShowFeeText}}</span></p>
                        <p v-else ><span>{{item.desc}}</span> <span>{{item.amount}}</span></p>
                    </template>
                </div>

                <div v-if="progress.length" class="clearIcon"></div>

            </div>
            <div class="c-section bank-wrap" v-if="progress.length">
                <dl class="c-flex-row">
                    <dd class="c-tl title">还款账户</dd>
                    <dd class="c-tr info">
                        <img class="c-icon icon_c" :src="data.cardBankLogo" alt="">
                        {{data.cardBank}}(尾号{{data.cardNoLast4}})
                    </dd>
                </dl>

                <dl v-if="progress[0].createtime" class="c-flex-row">
                    <dd class="c-tl title">还款时间</dd>
                    <dd class="c-tr info">
                        {{progress[0].createtime}}
                    </dd>
                </dl>

                <dl class="c-flex-row">
                    <dd class="c-tl title">还款记录</dd>
                    <dd class="c-tr info">
                        <span @click="openDetail" class="link">查看</span>
                    </dd>
                </dl>

            </div>

            <!--未逾期待还账单详情页不显示 查看-->
            <div class="c-section bank-wrap"  v-if="!progress.length && feeItem.length && (data.status!=1)">

                <dl class="c-flex-row" style="padding-right: 10px;">
                    <dd class="c-tl title">还款记录</dd>
                    <dd class="c-tr info">
                        <span @click="openDetail" class="link">查看</span>
                    </dd>
                </dl>

            </div>

        </div>

        <div v-if="copyBottomDesc" class="copyBottomDesc" v-html="copyBottomDesc">
        </div>

    </div>
</template>

<script>
import api from "@/services/api";
import helper from "@/utils/helper";
import { Toast } from "@/utils/helper";

export default {
  data() {
    return {
      routeParams: {},

      //底部文案
      copyBottomDesc: "",

      data: {}
    };
  },
  computed: {
    feeItem() {
      // 数据转换，每行两条
      let list = this.data.billItemVOList || [];
      let result = [];
      let row = [];
      list.forEach(item => {
        if (item.amount !== 0) {
          row.push(item);
        }
        // if (row.length === 2 || (list[list.length - 1] === item && item.amount !== 0)) {
        if (row.length === 2 || list[list.length - 1] === item) {
          result.push(row);
          row = [];
        }
      });
      return result;
    },
    progress() {
      return this.data.billProgressList || [];
    }
  },
  methods: {
    fetchData() {
      api.user.bill
        .detail({
          billdetailid: this.routeParams.id
        })
        .then(res => {
          console.log("=======================>", JSON.stringify(res, null, 2));

          if (!helper.isSuccess(res)) {
            return;
          }
          this.$root.loadingClose();
          this.data = res.data;
          //this.data['isShowFeeText']='计算中'
        })
        .catch(e => {
          console.log("api.user.bill=======>", e);
        });
    },
    setTitle() {
      // 设置标题
      let isNotShowProIdArray = ["3000601", "3001301", "3001401", "3001201"];
      if (!!isNotShowProIdArray.includes(this.routeParams.productid)) {
        this.$root.setWebAttribute({
          title: "账单详情"
        });
      } else {
        console.log("单位是=====>" + this.routeParams.periodunit);
        if (this.routeParams.periodunit && this.routeParams.periodunit == 1) {
          this.$root.setWebAttribute({
            title: "账单详情"
          });
        } else {
          this.$root.setWebAttribute({
            title: `第${this.routeParams.period || " "}期账单详情`
          });
        }
      }
    },

    openDetail() {
      /*    console.log('val==>', this.data.billid, this.data.orderid, this.data.productid);
                    console.log('url===>', `${process.env.path}/pages/MerchantsStatus/#/LoanProgress?orderid=${this.data.orderid}&billid=${this.data.billid}&fundproductid=${this.data.productid}`);
                    return*/

      try {
        this.$AppBridge.activityView({
          // url:  `http://static.sinawallent.com/v1.1.0/pages/MerchantsStatus/#/LoanProgress?orderid=154287903111173966&billid=154287966520058992&terminalid=2001&type=3&fundproductid=3000601`,
          url: `${
            process.env.path
          }/pages/MerchantsStatus/#/LoanProgress?orderid=${
            this.data.orderid
          }&billid=${this.data.billid}&fundproductid=${this.data.productid}`,
          title: "进度详情",
          type: "open",
          isCloseCurrent: false
        });
      } catch (error) {
        console.error("openLinkError===>", error);
      }
    },

    //查询底部文案
    queryPlans() {
      api
        .queryPlans({
          fundproductid: this.routeParams.productid,
          modeltype: "3",
          configtype: "4",
          status: ""
        })
        .then(res => {
          if (!helper.isSuccess(res)) {
            Toast;
            return;
          }

          if (res.data && res.data.length) {
            let data = res.data.filter(item => {
              return item.type == 50;
            });

            if (data.length && data[0].content) {
              this.copyBottomDesc = data[0].content;
            }
          }
        })
        .catch(e => {
          console.error("queryPlans error===>", e);
        });
    }
  },
  created() {
    this.$root.getRouteData().then(params => {
      this.routeParams = params;
      this.setTitle();
      this.fetchData();
      this.queryPlans();
    });

    /* let data = {
                 "period": 3,
                 "periodunit": 2,
                 "productid": "2002901",
                 "dueamount": 2199.49,
                 "productname": "PP大王贷",
                 "id": "154779539063405567",
                 "userid": "154764533245968605",
                 "paydate": "2019-01-13",
                 "isShowFeeText": "",
                 "status": 3
             };
             this.routeParams = data;
             this.setTitle();
             this.fetchData();*/
  },
  filters: {
    // feeitemtype(value) {
    //   // 1本金，2利息，3罚息，4手续费，5服务费
    //   switch(value) {
    //     case 1: return '本金'; break;
    //     case 2: return '利息'; break;
    //     case 3: return '罚息'; break;
    //     case 4: return '手续费'; break;
    //     case 5: return '服务费'; break;
    //   }
    // }
  }
};
</script>

<style lang="scss" scoped>
.view {
  position: relative;
}
div.copyBottomDesc {
  z-index: 1;
  font-size: 12px;
  color: #333;
  width: 100%;
  letter-spacing: 1px;
  padding: 8px 12px 22px 12px;
}

div.bill-detail {
  padding-bottom: 20px;

  div.clearIcon {
    width: 75px;
    height: 75px;
    // border: 1px solid red;
    position: absolute;
    right: 25px;
    top: 45px;
    background: url("~@/assets/images/my/bill/clear@3x.png");
    background-size: 100%;
  }
}
.detail-wrap {
  padding: 10px 0;

  .title {
    color: $gray;
    padding: 18px $gap 9px $gap;
  }
  .count {
    font-size: $fontXXL;
    padding: 0 $gap;
    padding-bottom: 17px;
    border-bottom: 1px solid #f2f2f2;
  }
  .detail-row {
    @extend %border-t;
    padding: 14px $gap;
    color: $gray;
    & + .detail-row {
      margin-left: $gap;
      padding-left: 0;
    }
    .c-tl {
      // 解决安卓自高原因导致不居中的问题
      line-height: 1.6;
    }
  }
}

p.showDetail {
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  border-top: 1px solid;
}

div.dataList {
  padding: 0px $gap;

  p {
    display: flex;
    justify-content: space-between;
    line-height: 2;
    height: 48px;
    border-bottom: 1px solid #f2f2f2;
    line-height: 52px;
    span:nth-child(2) {
      margin-right: 12px;
    }
    &.borderNone {
      border: none;
    }
  }
}

.bank-wrap {
  padding: 0px $gap;
  border-bottom: 1px solid #f2f2f2;

  .title {
    font-size: $fontL;
  }

  dl.c-flex-row {
    height: 48px;
    border-bottom: 1px solid #f2f2f2;
    line-height: 52px;
    dd.c-tr {
      line-height: 52px;
    }

    &:last-child {
      border: none;
    }
  }
  .info {
    color: $gray;
    line-height: 1.6;
  }
  span.link {
    font-size: 14px;
    color: #659ffc;
    letter-spacing: 0;
  }
}

.c-gap-title {
  // 解决安卓自高原因导致不居中的问题
  box-sizing: content-box;
  padding-top: 0;
  padding-bottom: 0;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
}

$progressLeft: 48px;
.progress-wrap {
  ul {
    padding-left: $progressLeft;
  }
  li {
    @extend %border-b;
    &:last-child {
      border: none;
      .line {
        display: none;
      }
    }
  }
  dl {
    margin-left: -$progressLeft;
  }
  dt {
    position: relative;
    width: $progressLeft;
    min-height: 60px;
  }
  .line {
    position: absolute;
    height: 100%;
    top: 50%;
    left: 50%;
    @extend %border-r;
  }
  .c-icon {
    position: relative;
    z-index: 1;
    margin-top: 40%;
  }
  .text {
    font-size: $fontL;
    color: $light;
  }
  .time {
    font-size: $fontM;
    color: $light;
  }
  .c-tl {
    overflow: initial !important;
    text-overflow: initial !important;
    white-space: initial !important;
    padding: 10px 14px 10px 0;
  }
  li:first-child {
    .text {
      color: $textColor;
    }
    .time {
      color: $gray;
    }
  }
}
</style>
