<template>
    <Popup :value="isShow">
        <div class="market-dialog" slot="content">
            <div
                class="el-close"
                @click="isShow = !isShow"
                v-sina-ads="{
                    currEvent: stat_market.market.recommend.closeClick,
                    currentEventParams: {
                        jumplink: marketInfoData.jumplink,
                    }
                }"
            >
                <img src="~@/assets/images/diversion/close.png" />
            </div>
            <img
                    v-if="marketInfoData.jumplink"
                    class="el-full-img"
                    :src="marketInfoData.jumplink"
                    @click="openJump"
            />
        </div>
    </Popup>
</template>
<script>
import Popup from "@/components/view/popup";
import helper from "@/utils/helper";
import util from "@/utils";
import api from "@/services/api.js";
import AppBridge from "@/services/AppBridge.js";

export default {
  name: "market-dialog",
  components: {
    Popup
  },
  data() {
    return {
        isShow: false,
        marketInfoUrl: process.env.staticPath + '/v1.1.0/king/pages/panda/#/marketInfo',
        marketInfoData: {
            icontext: null,
            isshield: 0,
            jumplink: "",
            marketUserStatsus: "",
            positionid: ""
        }
    }
  },

  mounted() {
    window.removeMarketDialogCacheKey = key => {
      helper.remove(key || "marketDialog-visibility");
      console.log("清除缓存成功");
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
        return new Promise((resolve, reject) => {
            api.activity
                .getAppMarketInfo({
                    pageid: "1031",
                    productId: "2001",
                    token: util.getParams("token")
                })
                .then(res => {
                    if (res.code == 200 && res.data) {
                        this.marketInfoData = res.data;

                        console.log('marketInfoData', this.marketInfoData)
                    }
                    resolve(res);
                });
        })
    },
    openJump() {
        this.sinaAds.click({ 
          currEvent: this.stat_market.market.recommend.btnClick 
        });
        this.$root.openUrl(this.marketInfoUrl)

        setTimeout(() => {
            this.close()
        }, 2000);
    },

    close() {
      this.isShow = false;

      if (process.env.NODE_ENV != "production") {
        //为了测试
        helper.remove("marketDialog-visibility");
        console.log("清除缓存成功");
      }
    },
    show() {
      this.isShow = true;
      this.sinaAds.popover({
        currEvent: this.stat_market.market.recommend.show,
        currEventParams: {
          url: this.marketInfoData.jumplink,
          title: "显示"
        }
      });
    },
    replaceTrim(str) {
      return str.replace(/^\s+|\s+$/g, "");
    }
  },
  watch: {
    "marketInfoData.jumplink"() {
      if (this.marketInfoData.jumplink) {
        helper.get("marketDialog-visibility").then(res => {
            //let tipCount = this.data.tipCount;
            let tipCount = 1;
            let newDate = new Date();
            let fullyear = newDate.getFullYear();
            let month = newDate.getMonth() + 1;
            let date = newDate.getDate();
            
            //每弹出一次
            let fulldate = String(fullyear) + String(month) + String(date);
            if (res) {
                if (fulldate != res) {
                this.show();
                }
            } else {
                this.show();
            }
            helper.set("marketDialog-visibility", fulldate);
            console.log('当前写入的缓存日期，' + fulldate)
        });
      }
    }
  }
};
</script>


<style lang="scss">
.flex {
  display: flex;
}

.market-dialog {
  width: 275px;

  .el-full-img {
    width: 100%;
  }

  .el-close {    
    position: absolute;
    right: 0;
    width: 24px;
    height: 24px;
    display: block;
    margin: 10px auto;

    img {
      width: 100%;
    }
  }
}
</style>
