<template lang="html">
  <!-- 专属推荐 -->
  <div class="recommend-wrap" v-if="data && data.length">
    <swiper :options="swiperOption" ref="mySwiper">
      <!-- slides -->
      <swiper-slide v-for="item in data" :key="item">
        <div
            class="swipe-item"
            :style="`background-image: url(${item})`"
            v-sina-ads="stat.recommend.newCard.click"
            @click="open(item)"
        ></div>
      </swiper-slide>
      <!-- Optional controls -->
      <div class="swiper-pagination" slot="pagination" v-if="data.length > 1"></div>
    </swiper>
  </div>

</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";

export default {
	props: ["resdata"],
	data() {
		return {
			swiperOption: {
				// loop : true,
				slidesPerView: "auto",
				centeredSlides: true,
				autoplay: true,
				pagination: {
					el: ".swiper-pagination",
					clickable: true,
					bulletActiveClass: "bullet-active"
				}
			}
		};
	},
	computed: {
		data() {
			return this.resdata.newcards;
		}
	},
	components: {
		swiper,
		swiperSlide
	},
	methods: {
		open(item) {
			this.$root.openUrl(this.resdata.onekeyapplypage, this.resdata);
		}
	}
};
</script>

<style lang="scss" scoped>
@import "swiper/dist/css/swiper.css";

.recommend-wrap {
	margin: $gap;
}
.swiper-container {
	overflow: visible;
	height: 180px;
}
.swipe-item {
	transform: scale(0.9533, 0.8889);
	transition: transform 0.3s;
	height: 100%;

	background-image: linear-gradient(90deg, #ff3037 0%, #ff7863 100%);
	background-size: 100% 100%;
	box-shadow: 0 6px 30px 0 rgba(255, 80, 82, 0.1);
	border-radius: 8px;
	color: white;
	text-align: center;
}
.swiper-slide-active {
	.swipe-item {
		transform: scale(1);
	}
}
.p1 {
	padding-top: 40px;
	font-size: 12px;
}
.p2 {
	margin-top: 9px;
	font-size: 24px;
}
.apply-button {
	margin-top: 20px;
	border: none;
	background: white;
	width: 150px;
	height: 32px;
	border-radius: 100px;
	font-size: 14px;
	color: #e72427;
}

.swiper-pagination {
	bottom: 10px;
	line-height: 0;
}
</style>
