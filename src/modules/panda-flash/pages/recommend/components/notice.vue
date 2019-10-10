<template lang="html">
    <div class="model notice-wrap" v-if="mainpackage_hrl_download_ios" >
        <img src="~@/assets/images/home/cb_ct@2x.png"/>
        <div 
            v-html="mainpackage_hrl && mainpackage_hrl.content"
            class="header-swiper" 
            v-sina-ads="{
                currEvent: adsInfo.diversionXmLoan.homeTopclick
            }"
            @click="handlePopupBtnClick(mainpackage_hrl_download_ios)"
            >
        </div>
    </div>
</template>

<script>
import api from "@/services/api";
import helper from "@/utils/helper";
import AppBridge from "@/services/AppBridge.js";
export default {
  props: ["mainpackage_hrl", "mainpackage_hrl_download_ios"],
  data() {
    return {
        
    };
  },
  methods: {
    handlePopupBtnClick(url) {
        // "type": "1", //1 内联 2外联打开
        AppBridge.activityView({
            type: "open",
            url: url,
            open_inner: false,
        });
        //this.$root.openUrl(url)
    }
  }
};
</script>

<style lang="scss" scoped>
.notice-wrap {
    display: flex;
    align-items: center;
    background: #FFF7D4;
    padding: 6px 0;
    img {
        width: 16px;
        float: left;
        margin: 0px 4px 0px 16px;
    }

    .header-swiper {
        span {
            color: #F5A623;
        }
    }
  
}
</style>
