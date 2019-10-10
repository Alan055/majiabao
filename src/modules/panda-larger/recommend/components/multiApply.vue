<template lang="html">
    <div class="multi-apply-wrap" v-if="countMoney > 0">
        <div class="multi-title">
            <p>待申请额度{{countMoney.toFixed(2)}}元</p>
            <div class="multi-sub-title">您还以下金额待申请</div>
        </div>
        <div class="list-wrap">
            <div class="list-content">
                <div class="list" v-for="item in data" :key="item.id+item.status+item.prestatus">
                    <div class="list-item c-flex-row">
                        <div class="c-flex-item c-tl">
                            <p class="title"><img class="c-financing-logo" :src="item.iconurl" alt="">{{item.name}}</p>

                            <p v-if="!item.isShowFeeText" class="number">{{item.maxamount | money2Fixed}}</p>
                            <p class="number" v-else>{{item.isShowFeeText}}</p>
                            <p class="desc" v-html="getLabel(item.copywrites, 1)+''"></p>
                        </div>

                        <div class="c-tr">
                            <p class="state">
                                <span v-html="getLabel(item.copywrites, 2)"></span>
                            </p>
                            <mt-button v-sina-ads="{
                                currEvent:stat.recommend.records.openBtn,
                                currEventParams:{
                                    name:item.name,
                                    productid:item.id,
                                    status:item.status
                                }
                            }" class="btn-round handle-button" :class="getClass(item.copywrites, 3)" size="normal" type="primary" plain @click.native="jump(item.nextpage.url)">
                                <span v-html="getLabel(item.copywrites, 3)"></span>
                            </mt-button>
                        </div>
                    </div>
                </div>

                <div class="list" v-for="item in data2" :key="item.id+item.status+item.prestatus">
                    <div class="list-item c-flex-row">
                        <div class="c-flex-item c-tl">
                            <p class="title"><img class="c-financing-logo" :src="item.iconurl" alt="">{{item.name}}</p>

                            <p v-if="!item.isShowFeeText" class="number">{{item.maxamount | money2Fixed}}</p>
                            <p class="number" v-else>{{item.isShowFeeText}}</p>
                            <p class="desc" >授信额度（元）</p>
                        </div>

                        <div class="c-tr">
                            <p class="state">
                                <span>{{item.desc}}</span>
                            </p>
                            <mt-button v-sina-ads="{
                                currEvent:stat.recommend.records.openBtn,
                                currEventParams:{
                                    name:item.name,
                                    productid:item.id,
                                    status:item.status
                                }
                            }" class="btn-round handle-button" :class="getClass(item.copywrites, 3)" size="normal" type="primary" plain @click.native="jump2">
                                <span>立即申请</span>
                            </mt-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import helper from "@/utils/helper";
    import qs from "qs";
    import api from "@/services/api";
    import { Indicator } from "@/utils/helper";

    export default {
        props: ["resdata"],
        data() {
            return {
                data: [],
                data2: [],
                countMoney: 0
            };
        },
        computed: {
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
            
        },
        methods: {
            getLabel(value, type) {
                return value ? value.filter(item => item.type == type)[0].content : '';
            },
            getClass(value, type) {
                let remark = value ? value.filter(item => item.type == type)[0].remark : '';
                if (remark == 1) {
                    return "red";
                }
                if (remark == 2) {
                    return "blue";
                }
                if (remark == 3) {
                    return "black";
                }
                if (remark == 4) {
                    return "gray";
                }
            },
            jump2() {
                this.$root.openUrl(this.url);
            },
            jump(url) {
                let search = url.split("?")[1] || "";
                let params = qs.parse(search);
                let { orderid, billid, productid: fundproductid } = params;

                Indicator.open();
                api
                    .getRouterUrl({ orderid, billid, fundproductid })
                    .then(res => {
                        if (helper.isSuccess(res)) {
                            let url = res.data.forwardItemBeans[0].url;
                            this.$root.openUrl(url, this.resdata);
                        }
                    })
                    .finally(Indicator.close);
            },
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
        },
        watch: {
            "resdata.otherProducts"() {
                let data = [];
                let data2 = [];
                let countMoney = 0;
                this.resdata.otherProducts.forEach(item => {
                    countMoney += item.maxamount;
                    if(item.isOneProduct){
                        data.push(item)
                    }else{
                        data2.push(item)
                    }
                });

                this.data = data;
                this.data2 = data2;
                this.countMoney = countMoney;
            }
        },
    };
</script>

<style lang="scss" scoped>
    .multi-title {
        position: relative;
        background: #FFF;
        background: url("../../images/tuijian.png") no-repeat;
        background-size: 100% 82px;
        min-height: 82px;
        padding: 16px 14px 0 16px;
        p {
            font-family: PingFangSC-Medium;
            font-size: 18px;
            color: #333333;
            letter-spacing: -0.41px;
            margin-bottom: 6px;
        }

        .multi-sub-title {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #5A6275;
            letter-spacing: -0.32px;
        }
    }
    .c-list-title {
        &.white {
            color: white;
        }
    }
    .multi-apply-wrap {
        overflow: hidden;
        background: white;

        .multi-apply-img {
            height: 110px;
            width: 100%;

            img {
                width: 100%;
                height: auto;
            }
        }
    }

    .list-wrap {
        
    }
    .list-content {
        padding: 0 13px;
    }
    .list {
        position: relative;
        padding: 16px 12px;
        background: #F5FAFD;
        border-radius: 6px;
        box-shadow: 0 2px 16px 0 rgba(0,0,0,0.06);
        border-radius: 4px;
        margin-bottom: 14px;
    }
    .list-item {
        
        
        &:last-child {
            border: none;
        }
        .title {
            //color: $gray;
            font-size: 15px;
            @include center-flex(y);
            .c-icon {
                margin-right: 4px;
            }
        }
        .number {
            font-size: 24px;
            margin-top: 8px;
            margin-left: 20px;
        }
        .desc {
            font-size: 12px;
            color: $light;
            margin-left: 20px;
        }
        .state {
            font-size: 12px;
            color: $light;
            margin-top: 3px;
            white-space: nowrap;
        }
        .handle-button {
            margin-top: 16px;
            width: 86px !important;
            height: 32px !important;
            font-size: 14px !important;
            position: relative;
            overflow: hidden;

            &.red {
                background: #019AFF;
                box-shadow: 0 3px 13px 0 rgba(0,91,250,0.24);
                border-radius: 20px;
                color: white;
            }
            &.blue {
                color: #659FFC;
                border-color: #659FFC;
            }
        }
    }
    
</style>
