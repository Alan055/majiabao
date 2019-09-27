<template lang="html">
    <!-- 专属推荐 -->
    <div class="recommend-wrap" v-if="data && data.length">
        <van-swipe class="swipe-content" :autoplay="3000"
                   :show-indicators="false" indicator-color="white">
            <van-swipe-item v-for="(item, i) in data" :key="i"
                            @click="open(item)">
                <img style="width: 100%; height: 100%;" :src="item"/>
            </van-swipe-item>
        </van-swipe>
    </div>
</template>

<script>
    import {
        swiper,
        swiperSlide
    } from "vue-awesome-swiper";
    import {mapMutations, mapState} from "vuex";

    export default {
        props: ["resdata"],
        data() {
            return {
                swiperOption: {
                    // loop : true,
                    slidesPerView: "auto",
                    centeredSlides: true,
                    autoplay: true,
                    observer: true,//修改swiper自己或子元素时，自动初始化swiper
                    observeParents: true,//修改swiper的父元素时，自动初始化swiper
                    pagination: {
                        el: ".swiper-pagination",
                        clickable: true,
                        bulletActiveClass: "bullet-active"
                    }
                }
            };
        },
        computed: {

            ...mapState([
                'driver'
            ]),

            data() {
                return this.resdata.newcards;
            },
            xmNewCards() {
                return this.resdata.xm_newcardsconfig || "";
            }
        },
        components: {
            swiper,
            swiperSlide
        },
        methods: {

            open(item) {

                //联合登录
                console.log(this.driver.xm_newcardsconfig);
                if (this.driver.xm_newcardsconfig && this.driver.xm_newcardsconfig.unloginUrl) {
                    this.beforeDriver(this.driver.xm_newcardsconfig.unloginUrl)
                }
                if (this.xmNewCards) {
                    this.sinaAds.click(
                        {
                            currEvent: this.stat_diversion.diversion.newcards.btnClick
                        },
                        () => {
                            this.$root.openUrl(this.xmNewCards.url);
                        }
                    );
                    return;
                }
                this.$root.openUrl(this.resdata.onekeyapplypage, this.resdata);
            }
        },

        mounted() {
            if (this.xmNewCards != "") {
                this.sinaAds.display({
                    currEvent: this.stat_diversion.diversion.newcards.show,
                    currEventParams: {
                        url: this.xmNewCards.url
                    }
                }, () => {
                    console.error('埋点发送完成', this.stat_diversion.diversion.newcards.show);
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "swiper/dist/css/swiper.css";

    .recommend-wrap {
        margin: $gap;
        max-width: 100%;
        overflow: hidden;
    }

    .swipe-content,
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

    .van-swipe-item {
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }

    .van-swipe__indicators {
        display: none !important;
    }
</style>
