<template lang="html">
  <div class="bill-item" :class="{'state-done': state==2 || state==4}" @click="$router.push({name: 'billDetail', params: item})">
  <!-- <div class="bill-item" :class="{'state-done': state==2 || state==4}" @click="$root.nextTitle=`第${item.period}期账单详情`;$router.push({name: 'billDetail', params: item})"> -->
    <dl class="c-flex-row c-v-center c-border-b title-row">
      <dd class="c-tl title" v-if="isNotShowProid" >第{{item.period}}期</dd>
      <dd class="c-tr state gray" v-if="state==0"><img class="c-icon icon_a" src="~@/assets/images/my/bill/ao_ac@2x.png" alt="normal">未开始</dd>
      <dd class="c-tr state green" v-if="state==1"><img class="c-icon icon_a" src="~@/assets/images/my/bill/ao_as@2x.png" alt="green">待还款</dd>
      <dd class="c-tr state" v-if="state==2"><img class="c-icon icon_a" src="~@/assets/images/my/bill/ao_aj@2x.png" alt="gray">已结清</dd>
      <dd class="c-tr state red" v-if="state==3"><img class="c-icon icon_a" src="~@/assets/images/my/bill/ao_aq@2x.png" alt="red">已逾期</dd>
      <dd class="c-tr state" v-if="state==4"><img class="c-icon icon_a" src="~@/assets/images/my/bill/ao_aj@2x.png" alt="gray">逾期已结清</dd>
    </dl>
    <dl class="c-flex-row c-v-center detail-row">
      <dd class="c-tl">
        <p class="title">应还款日</p>
        <p class="number">{{item.paydate}}</p>
      </dd>
      <dt class="line"></dt>
      <dd class="c-tl">
        <p class="title">应还款金额(元)</p>
        <p class="number">{{item.dueamount}}</p>
      </dd>
    </dl>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isNotShowProid: true
    };
  },
  props: ["item"],
  computed: {
    state() {
      return this.item.status;
    }
  },
  mounted() {
    let isNotShowProIdArray = ["3000601", "3001301",'3001401','3001201'];
    if (!!isNotShowProIdArray.includes(this.item.productid)) {
      this.isNotShowProid = false;
    } else {
        //期数单位  1为天  2为期
        console.log('单位是=====>'+this.item.periodunit)
        if(this.item.periodunit && this.item.periodunit == 1){
          this.isNotShowProid = false;
        }else{
          this.isNotShowProid = true;
        }
    }


  }
};
</script>

<style lang="scss" scoped>
.bill-item {
  background: #ffffff;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin-bottom: 16px;
}

.title-row {
  padding: 0 16px;
  height: 46px;
  .title {
    position: relative;
    padding-left: 14px;
    &::before {
      position: absolute;
      top: 50%;
      content: "";
      left: 0;
      display: inline-block;
      height: 12px;
      margin-top: -8px;
      width: 0.3em;
      border-radius: 1em;
      background: $red;
      /*margin-right: 0.3em;*/
    }
  }
  .state {
    font-size: $fontS;
    .c-icon {
      margin-top: -3px;
      margin-right: 4px;
    }

    &.gray {
      color: $gray;
    }
    &.red {
      color: $red;
    }
    &.green {
      color: $green;
    }
  }
}

.detail-row {
  padding: 16px;
  padding-bottom: 13px;

  .title {
    font-size: $fontS;
    color: $gray;
    margin-bottom: 6px;
  }
  .number {
    font-size: $fontXXL;
  }
  .line {
    height: 40px;
    margin: 0 22px;
    @extend %border-r;
  }
}

.state-done {
  .title-row,
  .detail-row,
  .title {
    color: $light;
  }
  .title-row .title::before {
    background: $light;
  }
}
</style>
