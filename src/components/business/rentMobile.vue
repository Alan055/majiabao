<template lang="html">
<div class="mobile-wrap" v-if="data && data.bannerContext">
    <div class="title">{{data.bannerHeader || '分期商城'}}</div>
    <div class="sub-title">{{data.bannerTitle || '一元起租，千款新机随心选'}}</div>
    <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide v-for="item in data.bannerContext" :key="item.code">
            <div class="swipe-item" v-sina-ads="{
                        currEvent: stat.rentmobile.recommend.mobileClick,
                        currentEventParams: {
                            name: item.name,
                            code: item.code
                        }
                    }" @click="handleMobileClick">
                <div class="el-badge">
                    <img :src="item.imgUrl2">
                </div>
                <div class="el-mobile">
                    <img :src="item.imgUrl1">
                </div>
                <div class="el-mobile-name">{{item.name}}</div>
                <div class="el-mobile-price">{{item.desc}}</div>
            </div>
        </swiper-slide>
    </swiper>
</div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import helper from "@/utils/helper";
import qs from "qs";
import api from "@/services/api";
import { Indicator } from "@/utils/helper";

export default {
  props: ["resdata"],
  data() {
    return {
      swiperOption: {
        slidesPerView: "auto",
        freeMode: true,
        slidesOffsetAfter: 0, //动态计算右侧的偏移量  数量+1 *10
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true //修改swiper的父元素时，自动初始化swiper
      }
    };
  },
  computed: {
    data() {
      return this.resdata.driver_product_config;
    },
    productData() {
      return this.resdata.driver_product;
    }
  },
  components: {
    swiper,
    swiperSlide
  },
  methods: {
    handleMobileClick() {
      let url = this.productData.nextpage.url;
      let search = url.split("?")[1] || "";
      let params = qs.parse(search);
      let { orderid, billid, productid: fundproductid } = params;

      Indicator.open();
      api
        .getRouterUrl({
          orderid,
          billid,
          fundproductid
        })
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
    "data.bannerContext"() {
      console.log("data.bannerContext");
      if (this.data.bannerContext.length > 0) {
        this.sinaAds.display({
          currEvent: this.stat.rentmobile.recommend.show
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.mobile-wrap {
  padding: 0 $gap;
  padding-bottom: 30px;
  overflow: hidden;
  background: white;

  .title {
    padding-top: 20px;
    font-size: 20px;
    color: #333333;
  }

  .sub-title {
    font-size: 14px;
    color: #666666;
    margin-top: 6px;
    margin-bottom: 17px;
  }
}

.swiper-container {
  overflow: visible;
}

.swiper-slide {
  width: 88px;
  box-sizing: content-box;
  padding-right: 14px;
}

.swipe-item {
  position: relative;
  width: 88px;
  //height: 140px;
  background: white;

  .el-badge {
    position: absolute;
    top: 0;
    right: 0;
    width: 30px;

    img {
      width: 100%;
    }
  }

  .el-mobile {
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    padding: 7px 12px;
    height: 88px;
    width: 88px;
    overflow: hidden;

    img {
      width: 100%;
    }
  }

  .el-mobile-name {
    font-size: 12px;
    color: #333333;
    margin-top: 6px;
  }

  .el-mobile-price {
    font-size: 12px;
    color: #e72427;
    margin-top: 3px;
  }
}
</style>
