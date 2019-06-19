<template>

 <!-- -->
  <div class="billIndex" :style="BillStyle">

    <vue-seamless-scroll
      :data="listData"
      :class-option="optionLeft"
      class="scrollTips"
       v-if="dataList.length && listData.length"
    >
      <ul class="item">
        <li v-for="item in listData">{{item}}</li>
      </ul>
    </vue-seamless-scroll>


    <div v-show="dataList.length" class="tip2">
      <p>请确保您的银行卡余额充足，避免影响您的还款</p>
    </div>

    <div class="record-wrap newEdition">
      <div class="list-wrap">
        <div class="list">
          <div v-if="isInit" class="model">
            <div class="box">
              正在加载数据
              <span class="dotting"></span>
            </div>
          </div>

          <div
            v-if="!isInit && dataList.length"
            class="list-item c-flex-row"
            v-for="item in dataList"
            :key="item.id+item.status+item.prestatus"
          >
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

              <p
                @click="jump(item.nextpage.url)"
                class="BtnLabel"
                v-sina-ads="{
                                    currEvent:adsInfo.bill.awaitRepayment.repaymentBtn,
                                    currEventParams:{
                                        name:item.name,
                                        productid:item.id,
                                        statusurl:item.statusurl,
                                        btnText:getLabel(item.copywrites, 3),
                                    }
                                }"
              >
                <span :class="getClass(item.copywrites, 3)">{{getLabel(item.copywrites, 3)}}</span>
                <c-icon class="icon-enter" type="enter"/>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--无数据-->
    <div v-if="!isInit && !dataList.length" class="bill-noList c-absolute">
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
import qs from "qs";
import api from "@/services/api";
import helper from "@/utils/helper";
import { Indicator } from "@/utils/helper";
import { Toast } from "@/utils/helper";
import AppBridge from "@/services/AppBridge.js";
import vueSeamlessScroll from 'vue-seamless-scroll'




export default {
  data() {
    return {
      dataList: [],
      isInit: true,

      optionLeft: {
        direction: 2,
        limitMoveNum: 1,
        openTouch:false,
        isSingleRemUnit:true
      },
        listData: []
    };
  },
  computed: {
    BillStyle() {
      return {
        background: this.dataList.length ? "#f7f7f7" : "#fff",
      };
    }
  },
  components: {
    vueSeamlessScroll,
  },

  created() {
    /*  setTimeout(()=>{
      this.listData= ['页面配置文案','页面配置文案']
    },1000) */
    AppBridge.getInitData({}, res => {
      //console.error('val==》', res.data.config.app_content);

      if (res.code == "200" && res.data.config && res.data.config.app_content) {
        //  this.listData=[res.data.config.app_content,res.data.config.app_content]

       // this.scrollText=res.data.config.app_content

      //  console.error(res.data.config.app_content);

          this.listData.push(res.data.config.app_content);
          this.listData.push(res.data.config.app_content);
      }
    });
    this.sinaAds.click({
      currEvent: this.adsInfo.bill.awaitRepayment.page,
      currEventParams: {
        pageName: "全部待还款"
      }
    });

    this.$root.setWebAttribute({
      title: "全部待还款"
    });

    try {
      api.home
        .getHomePage()
        .then(res => {
          this.isInit = false;

          console.error("getHomePage.applyproducts", res);

          if (!helper.isSuccess(res)) {
            Toast(res.msg);
            return;
          }
          if (
            res.data &&
            res.data.applyproducts &&
            res.data.applyproducts.length
          ) {
            //this.dataList = res.data;

            let { applyproducts } = res.data;

            console.error("getHomePage.applyproducts===>", applyproducts);

            let flagList = applyproducts || [],
              settleStatus = [16, 17, 18, 19, 20, 21, 22, 25, 26, 27, 31],
              tempArr = [];

            flagList.map((item, index) => {
              if (settleStatus.indexOf(item.statusurl) != -1) {
                console.log("val====>", item);

                tempArr.push(item);
              }
            });

             // this.dataList = flagList
            this.dataList = tempArr;
          }
        })
        .catch(e => {
          console.error("api.home.getHomePage===>", e);

          Toast(e);
        })
        .finally(() => this.$root.loadingClose());
    } catch (e) {
      this.$root.loadingClose();
    }
  },
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
  }
};
</script>



<style lang="scss" scoped>


.scrollTips {
  background: #e1f5ff;
  font-size: 14px;
  color: #659ffc;
  letter-spacing: -0.27px;
  padding: 6px;
  height: 25.8px;
  overflow: hidden;
  line-height:100%;
  position: relative;


  ul.item {
    padding-left: 16px;

    li {
      float: left;
      width: 100%;
      height: 28px;
      line-height:28px;
      overflow: hidden;
      margin-right: 10px;
      margin-top:-5px
    }
  }
}

.model {
  display: flex;
  justify-content: center;
  padding-top: 20%;
  align-items: Center;
}
.box {
  text-align: center;
}

.dotting {
  display: inline-block;
  min-width: 2px;
  min-height: 2px;
  box-shadow: 2px 0 currentColor, 6px 0 currentColor, 10px 0 currentColor;
  -webkit-animation: dot 4s infinite step-start both;
  animation: dot 4s infinite step-start both;
}

.tip2 {
  font-size: 14px;
  font-size: 13px;
  color: #666666;
  letter-spacing: -0.29px;
  margin: 14px 0 8px 0;

  p {
    padding-left: 16px;
  }
}

.billIndex {
  background: #f7f7f7;
  overflow: auto;
  position: relative;
  //height: 110%;
  // padding-bottom: 30px;
}

.record-wrap {
  padding: 0 $gap;
  // overflow: hidden;
  position: relative;
  //border: 1px solid;
}

.c-list-title {
  padding: 5px 0 12px 0;
  &.white {
    color: white;
  }
}

.list-wrap {
  margin: 0 (-$gap);
}

.list {
  /* padding: 0 ($gap + 10px);
         margin: -16px 0;*/
  padding: 0 $gap;
}

.list-item {
  position: relative;
  padding: $gap;
  margin-bottom: 10px;
  background: #ffffff;
  border-radius: 4px;

  &:last-child {
    border: none;
  }
  .title {
    color: $gray;
    @include center-flex(y);
    .c-icon {
      margin-right: 4px;
    }
  }
  .number {
    font-size: 24px;
    color: #333333;
    letter-spacing: 0.5px;
    margin-top: 8px;
  }
  .desc {
    font-size: 12px;
    color: $light;
    margin-left: 2px;

    span {
      font-size: 13px;
      color: #e72427;
      letter-spacing: -0.2px;
      text-align: right;
    }
  }

  .BtnLabel {
    margin-top: 26px;
    text-align: right;
    letter-spacing: -0.29px;

    .icon-enter {
      @include size(12px);
      margin-top: -2px;
    }
    span.red {
      color: $red;
    }
    span.blue {
      color: $blue;
    }
  }
  .state {
    font-size: 12px;
    color: $light;
    margin-top: 3px;
    white-space: nowrap;
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
