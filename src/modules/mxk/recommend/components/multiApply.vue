<template lang="html">
    <!-- 一键申请 -->
    <div class="multi-apply-wrap" v-if="data && data.length">
        <p class="c-list-title" :class="titleColor">获取更多额度</p>
        <swiper :options="swiperOption" ref="mySwiper">
            <!-- slides -->
            <swiper-slide v-for="item in data"  :key="item.id">
                <div class="swipe-item" v-sina-ads="{
            currEvent:stat.recommend.multiApply.openSingle,
            currentEventParams:{
              name:item.name
            }
          }" @click="apply">
                    <p class="title"><img class="c-financing-logo" :src="item.iconurl" alt="">{{item.name}}</p>
                    <p class="desc">
                        <span>{{item.label01}}</span>
                        <span>{{item.label02}}</span>
                    </p>

                    <div class="gap">
                        <div class="line"></div>
                        <div class="circle-left"></div>
                        <div class="circle-right"></div>
                    </div>

                    <div class="tag-wrap">
                        <div class="tag">
                            <span v-if="item.label03">{{item.label03}}</span>
                            <span v-else>最高{{item.maxamount | amount}}额度</span>
                        </div>
                    </div>
                </div>
            </swiper-slide>

            <swiper-slide>
                <div class="swipe-item item-more" v-sina-ads="stat.recommend.multiApply.openSingle" @click="apply">
                    <p class="title"><img class="c-icon icon-more" src="~@/assets/images/recommend/Other@2x.png" alt="">更多精彩</p>
                    <p class="desc">更多产品上线…</p>

                    <div class="gap">
                        <div class="line"></div>
                        <div class="circle-left"></div>
                        <div class="circle-right"></div>
                    </div>

                    <div class="tag-wrap gray">
                        <div class="tag">
                            敬请期待
                        </div>
                    </div>
                </div>
            </swiper-slide>
        </swiper>
        <mt-button type="primary" size="large" v-sina-ads="stat.recommend.multiApply.open"  class="btn-round btn-lg apply-button" @click.native="apply">一键申请</mt-button>
    </div>

</template>

<script>
    import "swiper/dist/css/swiper.css";
    import { swiper, swiperSlide } from "vue-awesome-swiper";
    import helper from "@/utils/helper";

    export default {
        props: ["resdata"],
        data() {
            return {
                swiperOption: {
                    slidesPerView: "auto",
                    freeMode: true,
                    slidesOffsetAfter: 0,  //动态计算右侧的偏移量  数量+1 *10
                }
            };
        },
        computed: {
            data() {

                if(this.resdata.resecondproducts){

                    let len = this.resdata.resecondproducts.length

                    if (len) {
                        this.swiperOption.slidesOffsetAfter = (len + 1) * 10
                    }
                }
                return this.resdata.resecondproducts;
            },
            url() {
                return this.resdata.onekeyapplypage;
            },
            titleColor() {
                let { newcards, applyproducts } = this.resdata;
                return (!newcards || !newcards.length) &&
                (!applyproducts || !applyproducts.length)
                    ? "white"
                    : "";
            }
        },
        components: {
            swiper,
            swiperSlide
        },
        methods: {
            apply() {
                this.$root.openUrl(this.url, this.resdata);
            }
        },
        mounted() {
            if(this.resdata.resecondproducts){
                helper.set(
                    "productlist",
                    JSON.stringify(this.resdata.resecondproducts)
                );
            }
        },
        filters: {
            amount(value) {
                if (value < 10000) {
                    return value;
                } else {
                    value = (value / 10000).toFixed(1).replace(".0", "");
                    return value + "万";
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    .c-list-title {
        &.white {
            color: white;
        }
    }
    .multi-apply-wrap {
        padding: 0 $gap;
        padding-bottom: 30px;
        overflow: hidden;
        // background: white;
    }
    .swiper-container {
        overflow: visible;
    }
    .swiper-slide {
        width: 125px;
        box-sizing: content-box;
        padding-right: 12px;
    }
    .swipe-item {
        width: 125px;
        height: 140px;
        background: white;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
        border-radius: 4px;

        padding: 20px 12px;

        .title {
            line-height: 20px;
            margin-top: 2px;
            @include center-flex(y);
            .c-icon {
                margin-right: 4px;
            }
        }
        .desc {
            margin-top: 8px;

            font-size: 12px;
            line-height: 17px;
            color: $gray;
            white-space: nowrap;
            letter-spacing: -0.27px;

            span {
                &::after {
                    content: "|";
                    color: #979797;
                    padding: 0 3px;
                }
                &:last-child::after {
                    display: none;
                }
            }
        }
    }

    .gap {
        margin: 10px -12px 8px;

        position: relative;
        overflow: hidden;
        padding: 5px 0;

        .line {
            border-top: 1px dashed #e6e6e6;
            margin: 0 5px;
        }
        .circle-left,
        .circle-right {
            @include circle(10px);
            background: rgba(0, 0, 0, 0.05);
            position: absolute;
            top: 0;
        }
        .circle-left {
            left: -5px;
        }
        .circle-right {
            right: -5px;
        }
    }

    .tag-wrap {
        background-image: linear-gradient(90deg, #bd8730 0%, #edc173 97%);
        border-radius: 2px;
        width: 93px;
        height: 26px;
        padding: 2px;
        margin: 0 auto;
        &.gray {
            background: #d8d8d8;
        }
        .tag {
            border: 1px solid rgba(255, 255, 255, 0.52);
            border-radius: 2px;
            color: white;
            font-size: 12px;
            height: 22px;
            line-height: 22px;
            text-align: center;
        }
    }

    .item-more {
        .title {
            color: $gray;
            padding: 0 4px;
        }
        .desc {
            color: $light;
            padding: 0 4px;
        }
    }

    .apply-button {
        background-image: linear-gradient(90deg, #e72427 0%, #fe4c35 100%);
        box-shadow: 0 2px 10px 0 rgba(236, 44, 42, 0.3);
        border-radius: 100px;
        margin-top: 20px;
    }

    .icon-more {
        @include size(18px);
    }
</style>
