<template lang="html">
<div class="view c-bg-gray">

  <div class="c-view-content bill-detail">
    <p class="c-gap-title">账单明细</p>

    <div class="c-section detail-wrap">
      <p class="title">应还金额(元)</p>
      <p class="count">{{data.repayAmount}}</p>
      <dl class="c-flex-row detail-row" v-for="row in feeItem">
        <dd class="c-tl" v-for="item in row">{{item.desc}}：{{item.amount}}</dd>
      </dl>
    </div>
    <div class="c-section bank-wrap" v-if="progress.length">
      <dl class="c-flex-row">
        <dd class="c-tl title">还款账户</dd>
        <dd class="c-tr info">
          <img class="c-icon icon_c" :src="data.cardBankLogo" alt="">
          {{data.cardBank}}(尾号{{data.cardNoLast4}})
        </dd>
      </dl>
    </div>

    <div class="progress-wrap" v-if="progress.length">
      <p class="c-gap-title">还款进度</p>
      <ul class="c-section">
        <li v-for="(item, index) in progress">
          <dl class="c-table-row">
            <dt>
              <div class="line"></div>
              <img v-if="index==0" class="c-icon icon_c" src="~@/assets/images/my/bill/aj_ch@2x.png" alt="">
              <img v-else class="c-icon icon_g" src="~@/assets/images/my/bill/ac_gi@2x.png" alt="">
            </dt>
			<dd class="c-tl">
              <p class="text">{{item.content}}</p>
              <p class="time">{{item.createtime}}</p>
            </dd>
          </dl>
        </li>
      </ul>
    </div>

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
          if (row.length === 2 || (list[list.length - 1] === item)) {
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
          if (!helper.isSuccess(res)) {
            return;
          }
          this.$root.loadingClose();
          this.data = res.data;
        });
    },
    setTitle() {
      // 设置标题
      let isNotShowProIdArray = ["3000601", "3001301",'3001401','3001201'];
      if (!!isNotShowProIdArray.includes(this.routeParams.productid)) {
        this.$root.setWebAttribute({
          title: "账单详情"
        });
      } else {
        console.log('单位是=====>'+this.routeParams.periodunit)
        if(this.routeParams.periodunit && this.routeParams.periodunit == 1){
           this.$root.setWebAttribute({
                title: "账单详情"
           });
        }else{
           this.$root.setWebAttribute({
            title: `第${this.routeParams.period || " "}期账单详情`
           });
        }
      }
    }
  },
  created() {
    this.$root.getRouteData().then(params => {
      this.routeParams = params;
      this.setTitle();
      this.fetchData();
    });
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
.detail-wrap {
  .title {
    color: $gray;
    padding: 18px $gap 9px $gap;
  }
  .count {
    font-size: $fontXXL;
    padding: 0 $gap;
    padding-bottom: 17px;
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

.bank-wrap {
  padding: 13px $gap;
  .title {
    font-size: $fontL;
  }
  .info {
    color: $gray;
    line-height: 1.6;
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
