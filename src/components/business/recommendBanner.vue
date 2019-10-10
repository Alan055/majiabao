<template>
  <mt-swipe class="recommend-banner" :auto="3000" :showIndicators="bannerList.length > 1">
    <mt-swipe-item v-for="(v,i) in bannerList" :key="i">
      <img :src="v.imgurl" @click="jump(v)" />
    </mt-swipe-item>
  </mt-swipe>
</template>

<script>
import util from "@/utils";
import helper from "@/utils/helper";

export default {
  props: {
    pageId: {
      type: String
    },
    attr: {
      type: String,
      default: "homepageBanner"
    }
  },
  data() {
    return {
      bannerList: [] // 广告数据
    };
  },
  computed: {},
  watch: {},
  methods: {
    // 获取广告位数据
    findData() {
      this.$api.activity
        .getApprovaling({
          pageid: this.pageId,
          mjbname: util.getParams("mjbname"),
          productId: 2001
        })
        .then(res => {
          if (helper.isSuccess(res)) {
            this.bannerList = res.data.pagedata[this.attr].pagedata;
            console.log("this.attr", this.attr);
            console.log("bannerList", this.bannerList);
          }
        });
    },
    // 跳转
    jump(v) {
      if (v.jumptype == 1) {
        // h5内置打开
        this.$root.openUrl(v.jumplink);
      } else if (v.jumptype == 2) {
        this.$AppBridge.activityView({
          type: "open",
          url: v.jumplink,
          isFull: false,
          open_inner: false
        });
      }
    },

    init() {
      this.findData();
    }
  },
  created() {
    this.init();
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.recommend-banner {
  padding: 0 16px;
  height: 120px;
  max-height: 120px;
  position: relative;
  overflow: hidden;
  background: #ffffff;

  img {
    width: 100%;
  }
}
</style>
