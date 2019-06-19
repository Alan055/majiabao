<template>
    <div class="view">
        <div class="c-layer">
            <div class="pull-down-bg" :style='{height: activeHeight}'></div>
        </div>

        <div class="c-layer header-layer">
            <c-header ref="transparentHeader" class="header transparent" :style="`color: black;`" :title="appName" :show="true">
                <span slot="right" v-sinaAds="adsInfo.card.index.clickMessage" @click="$root.openUrl(messageUrl);redIcon=false;" class="posi-r">
                        <mt-button><img class="c-icon icon_a" src="../images/message-blue.png"/></mt-button>
                        <span v-if="redIconShow" :class="['red-icon', ['red-icon-one', 'red-icon-two', 'red-icon-three'][redIconCount.length - 1]]">{{redIconCount}}</span>
                </span>
            </c-header>
        </div>

        <div class="c-view-content">

            <div class="content-main">
                <img src="../images/no-pass-panda.png" alt="">
                
                <p class="title">抱歉！您未匹配到额度～</p>
                <p class="sub-title">您的申请资料暂未匹配到借款机构，建议您保持良好信用，半年后重新尝试~</p>
            </div>

            <div class="content-bottom">
                <div class="section kefu-content" v-sinaAds="adsInfo.card.index.clickKefu" @click="$root.openUrl({url: onlineServiceUrl, title: '在线客服'})">
                    <img src="../images/kefu-banner.png" alt="">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import api from "@/services/api";
    import util from "@/utils";
    import AppBridge from "@/services/AppBridge.js";
    import helper from "@/utils/helper";

    export default {
        name: "nopass",
        data() {
            return {
                messageUrl: process.env.path + "/v1.1.0/king/pages/panda-larger/#/message", //消息中心
                onlineServiceUrl: '',
                redIconShow: false,
                redIconCount: '0',
                pullDown: true,
                headerOpacity: 1,
                headerRgba: 0,
                activeHeight: "50vh",
            };
        },
        computed: {

        },
        created() {
            this.getOnlineService();
            this.redData();
        },
        methods: {
            // 获取在线客服地址
            getOnlineService () {
                AppBridge.getVisitUrl({
                    pageName: 'ONLINESERVICE'
                },res => {
                    if(!res || !res.data) return
                    let data = res.data
                    if(typeof data == 'string') {
                        data = JSON.parse(data)
                    }

                    if (data && data.url) {
                        this.onlineServiceUrl = data.url;
                    }

                })
            },
            //消息红点查询
            redData() {
                return new Promise((resolve, reject) => {
                    api.user.message
                        .redDot({
                            pageCode: 2001004, //活动消息
                            productId: 2001,
                            token: util.getParams("token") || storage.get("token") || ""
                        })
                        .then(res => {
                            if (!helper.isSuccess(res)) return;
                            if (res.data.messageCenterTotal && res.data.messageCenterTotal > 0) {
                                this.redIconShow = true;
                                if (res.data.messageCenterTotal > 99) {
                                    this.redIconCount = '99+'
                                } else {
                                    this.redIconCount = String(res.data.messageCenterTotal)
                                }
                            }else{
                                this.redIconShow = false;
                            }
                            resolve(res)
                        });
                })
            }
        }
    };
</script>

<style lang="scss" scoped>
    .pull-down-bg {
        background-image: #fff;
        position: absolute;
        z-index: -1;
        width: 100%;
    }
    .header-layer {
        position: relative;
        z-index: 1;
    }
    .content-bg {
        img {
            width: 100%;
        }
    }

    .content-main {
        position: relative;
        background: #FFFFFF;
        background: url("../images/nopass@2x.png") no-repeat;
        background-size: 100% 158px;
        box-shadow: 0 8px 20px 0 rgba(0,0,0,0.09);
        border-radius: 8px;
        width: 343px;
        height: 281px;
        margin-left: 4.3%;
        top: 69px;
        text-align: left;
        padding: 0 20px;

        img {
            width: 82px;
            height: 90px;
            margin-top: 50px;
            margin-left: 4px;
        }
        .title {
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #333333;
            letter-spacing: 0;
            margin-top: 21px;
        }
        .sub-title {
            color: #5A6275;
            font-size: 14px;
            margin-top: 12px;
        }
    }

    .content-bottom {
        margin-top: 88px;
        display: flex;
        justify-content: center;

        .kefu-content {
            background-color: white;
            padding: 10px 13px;

            img {
                width: 100%;
            }
        }
    }
    
    .posi-r {
        position: relative;
    }
    .red-icon {
        font-family: PingFangSC-Regular;
        font-size: 18px;
        color: #FFFFFF;
        position: absolute;
        display: inline-block;
        text-align: center;
        background-color: #e72427;
        transform: scale(0.5);
    }

    .red-icon-one {
        padding: 2px 8px 3px 6px;
        top: -11px;
        right: -10px;
        border-radius: 50%;
    }

    .red-icon-two {
        padding: 2px 9px 3px 6px;
        border-radius: 36px;
        top: -10px;
        right: -18px;
    }

    .red-icon-three {
        padding: 2px 9px 3px 6px;
        border-radius: 40px;
        top: -13px;
        right: -22px;
    }

</style>
