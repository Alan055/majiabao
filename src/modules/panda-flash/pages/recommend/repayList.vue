<template>
    <div class="view">
        <div class="c-view-content" v-if="data.length">
            <div class="list-wrap">
                <div class="list-center">
                <div class="list-center-bg">
                    <div class="list-content">
                    <div class="list" v-for="item in data" :key="item.id+item.status+item.prestatus">
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
                            <span v-html="getLabel(item.copywrites, 3)"></span>
                            </mt-button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
        <diversionXmLoan 
            v-if="mainPackageBillDriverConfig" 
            cachkey="repayList"
            :resdata="mainPackageBillDriverConfig" 
            :statdata="{
                click: adsInfo.diversionXmLoan.repayclick,
                close: adsInfo.diversionXmLoan.repayclickclose,
                popover: adsInfo.diversionXmLoan.repaypopover
            }">
        </diversionXmLoan>
        <no-data
            :imgUrl="require('../../assets/images/no-bill@2x.png')"
            text="当前无待还账单"
            v-else-if="isFinsh && !data.length"
        ></no-data>
    </div>
</template>

<script>
import qs from "qs";
import api from "@/services/api";
import helper from "@/utils/helper";
import { Indicator } from "@/utils/helper";
import noData from "@/components/common/noData";
import diversionXmLoan from "../../components/diversionXmLoan";

export default {
  data() {
    return {
      data: [],
      isFinsh: false,
      mainPackageBillDriverConfig: '',
      isNoList: null
    };
  },
  components: {
    noData,
    diversionXmLoan
  },
  computed: {
    titleColor() {
      let { newcards } = this.resdata;
      return !newcards || !newcards.length ? "white" : "";
    }
  },

  created() {
    this.$root.setWebAttribute({
      title: "待还账单"
    });
    this.getApplyList();

    return;
    let self = this;
    helper.get("homeData-repayProducts").then(item => {
      if (item) {
        try {
          self.data = JSON.parse(item);

          this.isNoList = self.data.length === 0;
        } catch (error) {
          this.isNoList = true;
        }
      } else {
        this.isNoList = true;
      }
    });
  },
  methods: {
    //获取还款记录
    getApplyList() {
      return new Promise((resolve, reject) => {
        api.home.getApplyList().then(res => {
          this.isFinsh = true;
          if (helper.isSuccess(res)) {
            let repayArray = [16, 17, 18, 19, 20, 21, 22, 25, 26, 27, 31];
            if (res.data.applyproducts && res.data.applyproducts.length > 0) {
              this.data = res.data.applyproducts.filter(item => {
                return repayArray.includes(item.status);
              });
              this.isNoList = this.data.length === 0;
            } else {
              this.isNoList = true;
            }

            if(res.data.mainPackageBillDriverConfig) {
                this.mainPackageBillDriverConfig = res.data.mainPackageBillDriverConfig;
                console.log('this.mainPackageBillDriverConfig', this.mainPackageBillDriverConfig)
            }
            resolve(res);
          }
        });
      });
    },
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
      console.log("this.data", this.data);
    }
  }
};
</script>

<style lang="scss" scoped>
.c-view-content {
  padding: 0 $gap;
  position: relative;
  background-color: #fff;
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
  margin-top: 14px;
}
.list {
  position: relative;
  padding: 16px 12px;
  background: #ffffff;
  box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);
  border-radius: 4px;
  margin-bottom: 14px;
}

.c-aspectratio:before {
  padding-top: 0 !important;
}
.c-aspectratio-content {
  text-align: center;
  position: relative;
}
.card-noList {
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  /*展示图片样式*/
  .card-noList-img {
    width: 100px;
    img {
      width: 100%;
    }
  }
  /*占位符*/
  .w-180-140 {
    aspect-ratio: "180:140";
  }
  /*展示文字样式*/
  .card-noList-text {
    color: #666;
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
    width: 86px !important;
    height: 32px !important;
    font-size: 14px !important;
    position: relative;
    overflow: hidden;
    background: #EB242A;
    border-radius: 16px;
    color: #fff;
    border: none;
  }
}
</style>
