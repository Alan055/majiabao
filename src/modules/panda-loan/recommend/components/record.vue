<template>
  <div>
    <div class="record-wrap">
      <div class="no-record" v-if="isShowNodata">
        <h1>Hi~</h1>
        <div class="title">当前暂无可借款机构，请保持关注。</div>
        <div class="sub-title">更多金融机构正在接入中···</div>
        <div class="triangle-border-down">
            <span></span>
        </div>
      </div>
      <div class="has-record" v-else>
        <!-- <div class="wait-loan" @click="$root.openUrl(repayUrl)">待还款</div>
        <div class="cricle-half">
          <p class="half-title">已获额度(元)</p>
          <p class="half-sub-title">{{countMoney}}</p>
        </div> -->
        <div class="list-title2">提现</div>
        <div class="list-wrap">
          <div class="list-center">
            <div class="list-center-bg">
              <div class="list-content">
                <div class="list" v-for="(item, i) in data" :key="i">
                  <div class="list-item c-flex-row">
                    <div class="c-flex-item c-tl">
                      <p class="title">
                        <img class="c-financing-logo" :src="item.iconurl" alt>
                        {{item.name}}
                      </p>

                      <p v-if="!item.isShowFeeText" class="number">{{item.maxamount | money2Fixed}}</p>
                      <p class="number" v-else>{{item.isShowFeeText}}</p>
                      <p class="desc" v-html="getLabel(item.copywrites, 1)+''"></p>
                    </div>

                    <div class="c-tr">
                      <p class="state">
                        <span v-html="getLabel(item.copywrites, 2)"></span>
                      </p>
                      <mt-button
                        v-sina-ads="{
                                        currEvent:stat.recommend.records.openBtn,
                                        currEventParams:{
                                            name:item.name,
                                            productid:item.id,
                                            status:item.status
                                        }
                                    }"
                        class="btn-round handle-button"
                        :class="getClass(item.copywrites, 3)"
                        size="normal"
                        type="primary"
                        plain
                        @click.native="jump(item.nextpage.url)"
                      >
                        <animation-item :data="item" :label="getLabel(item.copywrites, 3)"></animation-item>
                      </mt-button>
                    </div>
                  </div>
                  <div class="c-welfare-info" v-if="item.isShowWelfareInfo">
                    <img :src="item.icon">
                    <span v-html="item.productlistdesc"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import animationItem from "./animationItem";
import qs from "qs";
import api from "@/services/api";
import helper from "@/utils/helper";
import { Indicator } from "@/utils/helper";

export default {
  data() {
    return {
      isShowNodata: false,
      countMoney: 0,
      repayUrl: process.env.kingPath + "/pages/panda/#/recommend/repayList" //还款列表
    };
  },
  props: ["resdata"],
  computed: {
    data() {
      this.isShowNodata =
        this.resdata.apiFinish &&
        this.resdata.withdrawProducts &&
        this.resdata.withdrawProducts.length <= 0;

      return this.resdata.withdrawProducts;
    },
    thirdproducts() {
        console.log("是否有三级商户", this.resdata.thirdproducts)
        return this.resdata.thirdproducts;
    },
    titleColor() {
      let { newcards } = this.resdata;
      return !newcards || !newcards.length ? "white" : "";
    }
  },
  components: {
    animationItem
  },

  created() {},
  methods: {
    getLabel(value, type) {
      return value.filter(item => item.type == type)[0].content;
    },
    getClass(value, type) {
      let remark = value.filter(item => item.type == type)[0].remark;
      if (remark == 1) {
        return "red";
      }
      if (remark == 2) {
        return "blue";
      }
      if (remark == 3) {
        return "black";
      }
      if (remark == 4) {
        return "gray";
      }
    },
    jump(url) {
      let search = url.split("?")[1] || "";
      let params = qs.parse(search);
      let { orderid, billid, productid: fundproductid } = params;

      Indicator.open();
      api
        .getRouterUrl({ orderid, billid, fundproductid })
        .then(res => {
          if (helper.isSuccess(res)) {
            let url = res.data.forwardItemBeans[0].url;
            this.$root.openUrl(url, this.resdata);
          }
        })
        .finally(Indicator.close);
    }
  },
  watch: {
    data() {
      let count = 0;
      this.data.forEach(item => {
        count += item.maxamount;
      });
      this.countMoney = count;
    },
    "resdata.welfareInfo"() {
      let welfareInfoIds = [];
      if (this.resdata.welfareInfo && this.resdata.welfareInfo.length > 0) {
        welfareInfoIds = this.resdata.welfareInfo.map(item => {
          return item.productid;
        });
        let newApplyData = this.resdata.applyproducts.map(item => {
          if (welfareInfoIds.includes(item.id)) {
            //有福利红包
            let welfareData = this.resdata.welfareInfo.filter(wfItem => {
              return wfItem.productid == item.id;
            });
            if (welfareData && welfareData.length > 0) {
              return Object.assign(item, {
                isShowWelfareInfo: true,
                icon: welfareData[0].icon,
                productlistdesc: welfareData[0].productlistdesc
              });
            } else {
              return item;
            }
          } else {
            return item;
          }
        });
        this.resdata.applyproducts = newApplyData;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.record-wrap {
  .no-record {
    background: #ffffff;
    text-align: left;
    padding: 16px 26px;

    background: url("../../images/card_shawde@2x.png") no-repeat;
    background-size: 100%;
    height: 180px;
    h1 {
        font-size: 24px;
        color: #333333;
        letter-spacing: -0.28px;
        font-weight: bold;
    }

    .title {
        text-align: left;
        margin-bottom: 4px;
        font-size: 16px;
        letter-spacing: 0.89px;
        margin-top: 16px;
        font-weight: bold;
    }
    .sub-title {
        text-align: left;
        font-size: 14px;
        letter-spacing: 0.89px;
        opacity: 0.86;
        margin-top: 12px;
        font-weight: bold;
    }
  }
  .has-record {
    box-shadow: 0 -6px 10px 0 rgba(0,0,0,0.05);
    padding: 10px 16px;
    position: relative;
    .list-title2 {
        font-size: 20px;
        color: #333333;
        letter-spacing: 0.5px;
        margin-bottom: 12px;
        margin-top: 10px;
    }
    .wait-loan {
      position: absolute;
      display: inline-block;
      background: rgba(255, 255, 255, 0.23);
      border: 1px solid #ffffff;
      border-radius: 16px;
      font-size: 14px;
      color: #ffffff;
      letter-spacing: 1.67px;
      text-align: center;
      padding: 6px 0;
      width: 72px;
      right: 0;
      top: -10px;
    }
    .cricle-half {
      height: 140px;
      width: 279px;
      background: url("../../images/cricle-half.png") no-repeat;
      background-size: 100%;
      margin: 0 auto;

      .half-title {
        padding-top: 33px;
        opacity: 0.85;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #ffffff;
        letter-spacing: 0;
        text-align: center;
      }

      .half-sub-title {
        padding-top: 6px;
        font-size: 40px;
        color: #ffffff;
        letter-spacing: 1.67px;
        text-align: center;
      }
    }
  }
  .record-list {
    padding: 10px 16px;
    background: #ffffff;
    box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.1);
    border-radius: 6px;

    .title {
      font-size: 18px;
      color: #353241;
      letter-spacing: 0.5px;
    }

    .moeny {
      font-family: PingFangSC-Medium;
      font-size: 24px;
      color: #dec371;
      letter-spacing: 1px;
      text-align: left;
      margin-top: 10px;
      margin-bottom: 4px;
      margin-left: -4px;
    }

    .desc {
      font-size: 14px;
      color: #535370;
      letter-spacing: 0.78px;
      text-align: left;
    }

    .step3 {
      margin-top: 17px;
      background: #f5f7fc;
      border-radius: 4px;
      height: 40px;

      img {
        height: 16px;
        width: 16px;
        display: inline-block;
        vertical-align: text-bottom;
      }
    }

    .mint-button--primary {
      background: #dec371;
      box-shadow: 0 1px 6px 0 rgba(208, 162, 82, 0.34);
      border-radius: 16px;
      color: #fff;
      height: 32px;
      width: 72px;
      font-size: 14px;
      letter-spacing: 0.78px;
      margin-top: 24px;
    }
  }
}
.c-financing-logo {
  border: 0;
  border-radius: 50%;
}

.list-title {
  line-height: 25px;
  font-size: 18px;
  padding: 18px 0;
  text-align: left;
  font-weight: 600;
  &.white {
    color: white;
  }
}
.list-wrap {
  margin: 0 (-$gap);
}
.list-content {
  padding: 0 13px;
}
.list {
  position: relative;
  padding: 16px 12px;
  background: #F8F8F8;
    border-radius: 8px;
  margin-bottom: 14px;


  .c-welfare-info {
    display: flex;
    align-items: center;
    background: #f5f5f5;
    border-radius: 2px;
    padding: 2px 5px;
    margin-top: 4px;
    margin-left: 20px;

    img {
      width: 12px;
      height: 12px;
    }
    span {
      font-size: 12px;
      color: #333333;
      margin-left: 4px;
    }
  }
}
.list-item {
  &:last-child {
    border: none;
  }
  .title {
    //color: $gray;
    font-size: 15px;
    @include center-flex(y);
    .c-icon {
      margin-right: 4px;
    }
  }
  .number {
    font-size: 24px;
    margin-top: 8px;
    margin-left: 20px;
  }
  .desc {
    font-size: 12px;
    color: $light;
    margin-left: 20px;
  }
  .state {
    font-size: 12px;
    color: $light;
    margin-top: 3px;
    white-space: nowrap;
  }
  .handle-button {
    margin-top: 16px;
    width: 86px;
    height: 32px;
    font-size: 14px;
    position: relative;
    overflow: hidden;

    &.red {
      background: #EB242A;
      box-shadow: 0 1px 6px 0 rgba(208, 162, 82, 0.34);
      border-radius: 16px;
      color: #fff;
      border: none;
    }
    &.blue {
      color: #EB242A;
      background: #fff;
      border: 1px solid #EB242A;
      border-radius: 16px;
    }
  }
}
</style>
