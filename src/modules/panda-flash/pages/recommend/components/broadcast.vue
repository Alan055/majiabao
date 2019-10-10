<template lang="html">
    <!-- 跑马灯 -->
    <div class="model broadcast-wrap" v-if="data && data.length > 0">
        <img src="../../../assets/images/laba@2x.png"/>
        <div class="header-swiper ">
            <van-swipe :show-indicators="false" :autoplay="3000" vertical>
                <van-swipe-item v-for="(item, i) in data" :key="i">{{item.name}}</van-swipe-item>
            </van-swipe>
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
  margin: 14px auto;
  img {
    height: 14px;
    width: 14px;
    float: left;
    margin: 0px 4px 0px 16px;
  }
  .header-swiper {
    height: 17px;
    line-height: 17px;

    /deep/ .van-swipe {
      height: 100%;
      font-size: 12px;
      color: #dde6ff;
      letter-spacing: 0.14px;
      text-align: left;

      .van-swipe-item {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
