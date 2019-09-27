<template>
    <div class="view">
        <div class="c-layer">
            <div class="pull-down-bg" :style='{height: activeHeight}'></div>
        </div>

        <div class="c-layer header-layer">
            <c-header ref="transparentHeader" class="header transparent" :style="`background: rgba(255, 255, 255, ${headerRgba}); color: black;`" title="资讯" :show="true">
                <span slot="right" v-sina-ads='stat.recommend.message.mess' @click="$root.openUrl(messageUrl);redIcon=false;" class="posi-r">
                        <mt-button><img class="c-icon icon_a" src="~@/assets/images/my/home/an_ao@2x.png"/></mt-button>
                </span>
            </c-header>
        </div>

        <div class="c-view-content">
            <div id="blockHeaderContent" class="block-header" ref="transparentBlock"></div>

            <van-swipe class="swipe-content" :autoplay="3000" indicator-color="white">
                <van-swipe-item v-for="(item, i) in topInfo" :key="i"
                :style="`background: url(${item.iconurl})`"
                @click="handleInfoClick(item)"
                >
                    <p class="van-ellipsis">{{item.title}}</p>
                </van-swipe-item>
            </van-swipe>

            <van-tabs v-model="active">
                <van-tab title="热门资讯">
                    <div class="news-list" @click="handleInfoClick(item)" v-for="(item, i) in informationData1" :key="i">
                        <div class="list-left">
                        <div class="list-title">{{item.title}}</div>
                        <div class="list-time">{{item.createtime.substr(0,10)}}</div>
                        </div>
                        <div class="list-right">
                        <div class="list-img" :style="`background-image: url(${item.iconurl})`"></div>
                        </div>
                    </div>
                </van-tab>
                <van-tab title="政策时事">
                    <div class="news-list" @click="handleInfoClick(item)" v-for="(item, i) in informationData2" :key="i">
                        <div class="list-left">
                        <div class="list-title">{{item.title}}</div>
                        <div class="list-time">{{item.createtime.substr(0,10)}}</div>
                        </div>
                        <div class="list-right">
                        <div class="list-img" :style="`background-image: url(${item.iconurl})`"></div>
                        </div>
                    </div>
                </van-tab>
                <van-tab title="独家专栏">
                    <div class="news-list" @click="handleInfoClick(item)" v-for="(item, i) in informationData3" :key="i">
                        <div class="list-left">
                        <div class="list-title">{{item.title}}</div>
                        <div class="list-time">{{item.createtime.substr(0,10)}}</div>
                        </div>
                        <div class="list-right">
                        <div class="list-img" :style="`background-image: url(${item.iconurl})`"></div>
                        </div>
                    </div>
                </van-tab>
            </van-tabs>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import api from "@/services/api";
    import util from "@/utils";
    import helper from "@/utils/helper";

    export default {
        name: "nopass",
        data() {
            return {
                activeHeight: '40vh',
                headerRgba: 1,
                active: 0,
                topInfo: [],
                informationData1: [],
                informationData2: [],
                informationData3: []
            };
        },
        computed: {

        },
        methods: {
            getInfomationList() {
                api.mxk.getInfomationList({
                    //type: 2
                }).then(res => {
                    if (!helper.isSuccess(res)) return;
                    if(res.data){
                        console.log('res.data', res.data)
                        if(res.data.infoList){
                            res.data.infoList.forEach(element => {
                                if(element.type == 1) {
                                    this.informationData1.push(element);
                                }
                                if(element.type == 2) {
                                    this.informationData2.push(element);
                                }
                                if(element.type == 3) {
                                    this.informationData3.push(element);
                                }

                            });
                        }

                        this.topInfo = res.data.topInfo;
                    }
                });
            },
            handleInfoClick(item) {
              if(item.openlink && item.openlink.includes('XM=0')){
                this.$root.openUrl({
                  type: "open",
                  url: item.openlink,
                  isFull: false,
                  open_inner: true,
                });
                return
              }
                this.$root.openUrl({
                    url: item.openlink + '?id=' + item.id,
                    title: '详情'
                })
            }
        },
        created() {
            this.getInfomationList();
        },
        mounted () {
            this.$root.loadingClose();
        },
        onRefresh(tag, data) {
            if (tag == "refresh") {
                this.informationData1 = [];
                this.informationData2 = [];
                this.informationData3 = [];
                this.getInfomationList();
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
    .swipe-content {
        box-shadow: 0 2px 20px 0 rgba(0,0,0,0.20);
        border-radius: 8px;
        height: 160px;
        width: 343px;
        margin: 20px auto;

        /deep/ img {

        }
        /deep/ p {
            font-family: PingFangTC-Medium;
            font-size: 16px;
            color: #FFFFFF;
            margin-top: 116px;
            margin-left: 24px;
        }
        .van-swipe-item {
            background-size: 100% 100%;
            background-repeat:no-repeat;
        }
    }
    .van-tabs {
        /deep/ .van-tabs__line {
            background: #2967FF !important;
        }
        /deep/ {
            .van-tabs__nav {
                box-shadow: 0 2px 4px 0 rgba(0,0,0,0.05);
            }
        }
        .van-tab {
            span {
                font-family: PingFangSCMedium;
                font-size: 14px;
                color: #333333;
            }
        }
    }


    .news-list {
        @extend %border-t;
        padding: 10px 16px;
        display: flex;
        align-items: center;

    .list-left {
        width: 75%;
        .list-title {
            font-size: 16px;
            color: #333;
            letter-spacing: 0.12px;
            padding: 5px 0;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
        .list-time {
                font-size: 12px;
                color: #999;
                letter-spacing: 0.12px;
            }
        }
        .list-right {
            width: 25%;
            text-align: right;
            .list-img {
                display: inline-block;
                margin-top: 4px;
                width: 74px;
                height: 54px;
                background-repeat: no-repeat;
                background-size: 100% 100%;
            }
        }
    }

    .header {
        background: #FFFFFF;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,0.05);
    }
    .block-header {
        display: block;
        background: transparent;
        height: 64px;
    }

</style>
