<template lang="html">
    <!-- 跑马灯 -->
    <div class="model broadcast-wrap" v-if="data && data.length > 0">
        <img src="../../images/laba@2x.png"/>
        <div class="header-swiper ">
            温馨提示：谨防诈骗！
            <!-- <van-swipe :show-indicators="false" :autoplay="3000" vertical>
                <van-swipe-item v-for="(item, i) in data" :key="i">{{item.name}}</van-swipe-item>
            </van-swipe> -->
        </div>
    </div>
</template>

<script>
import api from "@/services/api";
import helper from "@/utils/helper";
export default {
  props: ["resdata"],
  data() {
    return {
      data: []
    };
  },
  computed: {},
  created() {
    this.feedKing();
  },
  methods: {
    //获取跑马灯数据
    feedKing() {
      let data = {};
      data.productId = "2001";
      return new Promise((resolve, reject) => {
        api.activity.feedKing(data).then(res => {
          if (helper.isSuccess(res)) {
            this.data = res.data || [];
          }
          resolve(res);
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.broadcast-wrap {
  margin: 16px;
  padding: 6px 0;
  background: rgba(255,214,39, 0.1);
  border-radius: 20px;
  display: flex;
  align-items: center;
  vertical-align: middle;
  img {
    height: 16px;
    width: 16px;
    float: left;
    margin: 0px 4px 0px 16px;
  }
  .header-swiper {
    //height: 16px;
    align-items: center;

    /deep/ .van-swipe {
      height: 100%;
      font-size: 12px;
      letter-spacing: 0.14px;
      text-align: left;
    }
  }
}
</style>
