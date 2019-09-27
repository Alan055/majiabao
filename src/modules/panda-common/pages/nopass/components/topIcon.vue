<template lang="html">
    <!-- 顶部4个tab -->
    <div class="model topIcon-wrap c-flex-row" v-if="data && data.length > 0">
        <div class="c-col-25" v-for="(item, i) in data" :key="i">
            <div 
                class="icon-content" 
                @click="handleOpenUrl(item.jumplink, item.title)"
                v-sina-ads="{
                    currEvent: adsInfo.home.clickTopIcon,
                    currEventParams:{
                        jumplink: item.jumplink
                    }
                }"
            >
                <img :src="item.imgurl"/>
                <p>{{item.icontext}}</p>
            </div>
        </div>
    </div>
</template>

<script>
import api from "@/services/api";
import helper from "@/utils/helper";
import AppBridge from "@/services/AppBridge.js";
export default {
    props: ["data"],
    data() {
        return {

        }
    },
    computed: {},
    created() {
        
    },
    mounted() {
        console.log('this.data', this.data)
        if(this.data && this.data.length > 0) {
            this.data.forEach(element => {
                this.sinaAds.display({
                    currEvent: this.adsInfo.home.showTopIcon,
                    currEventParams: {
                        jumplink: element.jumplink
                    }
                });
            });
        }
    },
    methods: {
        handleOpenUrl(url, title) {
            AppBridge.activityView({
                url: url,
                title: title
            })
        },
    },
    watch: {
    }
};
</script>

<style lang="scss" scoped>
.topIcon-wrap {
  padding: 14px 16px;
  
  .icon-content {
      img {
          height: 40px;
          width: 40px;
          content: normal !important;
      }
  }
}

.c-flex-row {
    justify-content: start !important;
}
</style>
