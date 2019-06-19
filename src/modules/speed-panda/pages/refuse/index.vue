<template>
  <div class="refuseList-warp" v-if="!noRefuseData">
    <bannerCard :isShow="isBannerShow" :list="bannerList" v-if="bannerList.length>0"/>
    <div class="refuse-list">
      <li
        class="item"
        v-sina-ads="{
                    currEvent:stat.recommend.refuse.click,
                    currentEventParams:{
                        name:item.name,
                    }
                    }"
        v-for="(item,index) in refuseList"
        :key="index"
        @click="handleClick(item.nextpage)"
      >
            <p class="c-flex-row c-v-center title-row">

                <span class="c-flex-item c-tl title">
                    <img class="c-icon" :src="item.iconurl" alt="">
                    {{item.name}}
                </span>

                <span class="c-flex-item c-tr">
                    <span class="state">申请未通过</span>
                </span>
            </p>

            <p class="c-flex-row c-v-center count-row">
                <span class="c-flex-item c-tl count">
                    <p class="sub-title">申请金额(元)</p>
                    <p class="sub-content">{{item.maxamount | money2Fixed}}</p>
                </span>

                <span class="c-flex-item c-tr">
                    <span class="link">{{item.text3[0].content}}</span>
                </span>
            </p>
      </li>
    </div>
  </div>
  <no-data
    :imgUrl="require('@/modules/panda-loan/images/no-bill@2x.png')"
    text="您暂时没有拒件记录"
    v-else
  ></no-data>
</template>

<script>
import api from "@/services/api.js";
import qs from "qs";
import util from "@/utils/index.js";
import storage from "@/utils/storage";
import { Indicator, Toast } from "@/utils/helper.js";
import helper from "@/utils/helper.js";
import bannerCard from "./components/bannerCard";
import noData from "@/components/common/noData";

export default {
  name: "refuseList",
  data() {
    return {
      bannerList: [],
      isBannerShow: false,
      refuseList: [],
      noRefuseData: false
    };
  },
  components: {
    bannerCard,
    noData
  },
  
  methods: {
    fetchData() {
      api.loan
        .getRejectedItems()
        .then(res => {
          if (res.code == 200) {
            if (res.data && res.data.length > 0) {
              this.renderData(res.data);
              this.noRefuseData = false;
            } else {
              this.noRefuseData = true;
            }
          } else {
            //拒件记录为空
            Toast("服务器繁忙，请稍后再试");
          }
        })
        .finally(this.$root.loadingClose);
    },
    renderData(data) {
      data &&
        data.map(item => {
          let obj = item;
          obj.text1 = item.copywrites.filter(i => i.type == 1);
          obj.text2 = item.copywrites.filter(i => i.type == 2);
          obj.text3 = item.copywrites.filter(i => i.type == 3);
          this.refuseList.push(obj);
        });
      this.$root.loadingClose();
      console.log("this.refuseList", this.refuseList);
    },
    handleClick(option) {
      // 灰显不点击
      // return false;
      //修改原因，下发地址是中转页面

      let url = option.url;
      let search = url.split("?")[1] || "";
      let params = qs.parse(search);
      let submitData = {
        orderid: params.orderid || "",
        billid: params.billid || "",
        fundproductid: params.productid || ""
      };

      if (url.toLowerCase().indexOf("getnextpage") > -1) {
        Indicator.open();
        api
          .getRouterUrl(submitData)
          .then(res => {
            // res = getRouterData;
            if (helper.isSuccess(res)) {
              let url = res.data.forwardItemBeans[0].url;
              this.$root.openUrl(url, this.resdata);
            }
          })
          .finally(Indicator.close);
      } else {
        this.$root.openUrl(option.url, {
          title: "被拒账单"
        });
      }
    },
    getBannerInfo() {
      api.activity
        .getApprovaling({
          pageid: "1019",
          token: util.getParams("token") || storage.get("token") || ""
        })
        .then(res => {
          if (res.code == 200) {
            console.log(res.data.pagedata);
            if (res.data.pagedata && res.data.pagedata.refusedetail) {
              this.bannerList = res.data.pagedata.refusedetail.pagedata;
              if (this.bannerList) {
                this.isBannerShow = true;
              }
            }
          } else {
            Toast(res.msg);
          }
        });
    }
  },
  created() {
    this.fetchData();
    this.getBannerInfo();
    this.$root.setWebAttribute({
      title: "被拒账单",
      refresh: true
    });
  }
};
</script>

<style lang="scss" scoped>
.c-aspectratio-content2 {
  text-align: center;
  img {
    width: 100px;
  }
}
// 无数据
.refuse-noList {
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  /*展示图片样式*/
  .refuse-noList-img {
    width: 100%;
    img {
      width: 100%;
    }
  }
  /*占位符*/
  .w-180-140 {
    aspect-ratio: "180:140";
  }
  /*展示文字样式*/
  .refuse-noList-text {
    color: #666;
  }
}
.refuse-list {
  background: #fff;
  padding: 12px 16px 0 16px;
  box-sizing: border-box;
  .item {
    background: #FFFFFF;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,0.10);
    border-radius: 4px;
    margin-bottom: 16px;
  }

  .title-row {
    @extend %border-b;
    padding-bottom: 14px;
    .state {
        color: #999;
    }
    .title {
        font-size: 20px;
        .c-icon {
            @include size(16px);
        }
    }
}
.link {
    width: 86px;
    height: 36px;
    line-height: 36px;
    padding: 8px 12px;
    text-align: center;
    box-sizing: border-box;
    color: #999999;
    border: 1px solid #999999;
    border-radius: 16px;
    font-size: 14px;
}

.count-row {
    margin: 14px 0 4px 0px;
    .count-title {
        font-size: $fontL;
    }
    .sub-title {
        font-size: 12px;
        color: #999999;
    }
    .sub-content {
        font-size: 20px;
        color: #666666;
    }
    .count {
        font-size: $fontXL;
        @extend %border-r;
    }
}
  li {
    height: 118px;
    padding: 12px;
    &:last-child {
      border: none;
    }
    .item-title {
      height: 20px;
      line-height: 20px;
      display: flex;
      justify-content: space-between;
      p.name {
        display: flex;
        align-items: center;
        img {
          width: 16px;
          height: 16px;
          margin-right: 4px;
        }
        span {
          color: #666;
          font-size: 14px;
        }
      }
      p.text {
        font-size: 12px;
      }
    }
    .item-info {
      height: 58px;
      display: flex;
      justify-content: space-between;
      .info {
        h3 {
          height: 33px;
          line-height: 33px;
          font-size: 24px;
          color: #333;
        }
        p {
          height: 25px;
          line-height: 25px;
          color: #999;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
