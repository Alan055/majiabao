<template>
    <div class="view c-view-gay">
        <div class="c-layer">
            <div class="pull-down-bg" :style='{height: activeHeight}'></div>
        </div>

        <div class="c-layer header-layer">
            <c-header ref="transparentHeader" class="header transparent" :style="`background: rgba(255, 255, 255, ${headerRgba}); color: black;`" title="发现" :show="true">
                <span slot="right" v-sina-ads='stat.recommend.message.mess' @click="$root.openUrl(messageUrl);redIcon=false;" class="posi-r">
                        <mt-button><img class="c-icon icon_a" src="~@/assets/images/my/home/an_ao@2x.png"/></mt-button>
                </span>
            </c-header>
        </div>

        <div class="c-view-content">
            <div id="blockHeaderContent" class="block-header" ref="transparentBlock"></div>
                <div class="c-module">
                    <div class="title">借款攻略</div>
                    <div class="sub-title">借款只是，成就贷款达人</div>
                    <mt-button class="btn-round handle-button"
                        size="normal"
                        type="primary"
                        @click.native="handleGotoMore"
                    >更多</mt-button>
                    <div class="c-flex-row">
                        <div class="c-flex-item" @click="handleInfoClick(0)">
                            <img class="c-full-img" src="../images/card_blue@2x.png"/>
                            <p class="title">#哪种还款方式更划算#</p>
                        </div>
                        <div class="c-flex-item" @click="handleInfoClick(1)">
                            <img class="c-full-img" src="../images/card_red@2x.png"/>
                            <p class="title">#征信知多少#</p>
                        </div>
                    </div>
                </div>

                <div class="c-module">
                    <div class="title">行业资讯</div>
                    <div class="sub-title">精选资讯，洞悉行业动态</div>
                    <div class="news-list" @click="handleInfoClick(item)" v-for="(item, i) in informationData.infoList" :key="i">
                        <div class="list-left">
                        <div class="list-title">{{item.title}}</div>
                        <div class="list-time">{{item.createtime.substr(0,10)}}</div>
                        </div>
                        <div class="list-right">
                        <div class="list-img" :style="`background-image: url(${item.iconurl})`"></div>
                        </div>
                    </div>
                </div>
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
                informationData: {
                    topInfo: [],
                    infoList: [],
                    /*"topInfo": [
                    {
                        "through": 1000000003,
                        "topType": null,
                        "createtime": "2018-11-26 19:07:26",
                        "orderno": 1,
                        "productid": "2001",
                        "subhead": null,
                        "remark": "",
                        "source": "",
                        "title": "#哪种还款方式更划算#",
                        "type": 4,
                        "content": null,
                        "businesstype": "0000",
                        "createby": "wake",
                        "openlink": "http://static.sinawallent.com/v1.1.0/pages/#/info/detail",
                        "releasetime": "2018-11-21 00:00:00",
                        "updateby": "wake",
                        "iconurl": "",
                        "id": "2019032123010006",
                        "updatetime": "2019-05-13 11:16:48",
                        "status": 1
                    },
                    {
                        "through": 1000000003,
                        "topType": null,
                        "createtime": "2018-11-26 19:07:26",
                        "orderno": 1,
                        "productid": "2001",
                        "subhead": null,
                        "remark": "",
                        "source": "",
                        "title": "#征信知多少#",
                        "type": 4,
                        "content": null,
                        "businesstype": "0000",
                        "createby": "wake",
                        "openlink": "http://static.sinawallent.com/v1.1.0/pages/#/info/detail",
                        "releasetime": "2018-11-21 00:00:00",
                        "updateby": "wake",
                        "iconurl": "",
                        "id": "2019032123010007",
                        "updatetime": "2019-05-13 11:16:50",
                        "status": 1
                    }
                    ],
                    "infoList": [
                    {
                        "through": 1000000003,
                        "topType": null,
                        "createtime": "2018-11-26 19:07:26",
                        "orderno": 1,
                        "productid": "2001",
                        "subhead": null,
                        "remark": "",
                        "source": "",
                        "title": "信用卡积分和额度快速提升攻略",
                        "type": 5,
                        "content": null,
                        "businesstype": "0000",
                        "createby": "wake",
                        "openlink": "http://static.sinawallent.com/v1.1.0/pages/#/info/detail",
                        "releasetime": "2018-11-21 00:00:00",
                        "updateby": "wake",
                        "iconurl": "http://static.sinawallent.com/king/imgs/xiongmaopuhui_p3.png",
                        "id": "2019032123010008",
                        "updatetime": "2019-05-13 14:06:03",
                        "status": 1
                    },
                    {
                        "through": 1000000003,
                        "topType": null,
                        "createtime": "2018-11-26 19:07:26",
                        "orderno": 1,
                        "productid": "2001",
                        "subhead": null,
                        "remark": "",
                        "source": "",
                        "title": "家庭理财的几大错误，一定要谨记！",
                        "type": 5,
                        "content": null,
                        "businesstype": "0000",
                        "createby": "wake",
                        "openlink": "http://static.sinawallent.com/v1.1.0/pages/#/info/detail",
                        "releasetime": "2018-11-21 00:00:00",
                        "updateby": "wake",
                        "iconurl": "http://static.sinawallent.com/king/imgs/xiongmaopuhui_p4.png",
                        "id": "2019032123010009",
                        "updatetime": "2019-05-13 14:06:04",
                        "status": 1
                    },
                    {
                        "through": 1000000003,
                        "topType": null,
                        "createtime": "2018-11-26 19:07:26",
                        "orderno": 1,
                        "productid": "2001",
                        "subhead": null,
                        "remark": "",
                        "source": "",
                        "title": "银行是怎么判断信用卡套现的？",
                        "type": 5,
                        "content": null,
                        "businesstype": "0000",
                        "createby": "wake",
                        "openlink": "http://static.sinawallent.com/v1.1.0/pages/#/info/detail",
                        "releasetime": "2018-11-21 00:00:00",
                        "updateby": "wake",
                        "iconurl": "http://static.sinawallent.com/king/imgs/xiongmaopuhui_p5.png",
                        "id": "2019032123010010",
                        "updatetime": "2019-05-13 14:06:05",
                        "status": 1
                    },
                    {
                        "through": 1000000003,
                        "topType": null,
                        "createtime": "2018-11-26 19:07:26",
                        "orderno": 1,
                        "productid": "2001",
                        "subhead": null,
                        "remark": "",
                        "source": "",
                        "title": "2019年信用卡新规 卡奴一年比一年难",
                        "type": 5,
                        "content": null,
                        "businesstype": "0000",
                        "createby": "wake",
                        "openlink": "http://static.sinawallent.com/v1.1.0/pages/#/info/detail",
                        "releasetime": "2018-11-21 00:00:00",
                        "updateby": "wake",
                        "iconurl": "http://static.sinawallent.com/king/imgs/xiongmaopuhui_p6.png",
                        "id": "2019032123010011",
                        "updatetime": "2019-05-13 14:06:06",
                        "status": 1
                    }
                    ]*/
                },
                moreLink: process.env.staticPath + "/pages/panda-larger-welfare/#/news/more", //更多资讯
                // detailLink: process.env.staticPath + "/pages/panda-larger-welfare/#/news/detail", //资讯详情
                detailLink:  "http://192.168.30.189:8081/pages/panda-larger-welfare/#/news/detail", //资讯详情
            };
        },
        computed: {

        },
        methods: {
            handleGotoMore() {
                this.$root.openUrl({
                    url: this.moreLink,
                    title: '更多资讯'
                })
            },
            getInfomationList() {
                api.mxk.getInfomationList({
                    toptype: 4,
                    type: 5
                }).then(res => {
                    if (!helper.isSuccess(res)) return;
                    if(res.data){
                        console.log('res.data', res.data)
                        this.informationData.topInfo = res.data.topInfo;
                        this.informationData.infoList = res.data.infoList;
                    }
                });

              // api.pandaNews.getInformationList({
              //   pageIndex: 1,
              //   type: 4,
              // }).then(res => {
              //   if (!helper.isSuccess(res)) return;
              //   if (res.data) {
              //     console.log('res.data', res.data)
              //     this.informationData.topInfo = res.data.topInfo;
              //     this.informationData.infoList = res.data.informations;
              //   }
              // });
            },
            handleInfoClick(item) {
                console.log('item', item)
              if(item.openlink && item.openlink.includes('XM=0')){
                this.$root.openUrl({
                  type: "open",
                  url: item.openlink,
                  isFull: false,
                  open_inner: true,
                });
                return
              }
                if(item == 0 || item == 1) {
                    item = this.informationData.topInfo[item]
                }
                console.log('item2', item)
                this.$root.openUrl({
                    url: this.detailLink + '?id=' + item.id,
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
    .c-module {
        position: relative;
        padding: 0 16px;

        .mint-button {
            position: absolute;
            right: 16px;
            top: 2px;
            font-size: 12px;
            width: 44px;
            padding: 0;
            height: 24px;
        }
        .mint-button--primary.is-plain {
            border: 1px solid #999;
            background-color: transparent;
            color: #999;
        }
        & + .c-module {
            border-top: 8px solid #f8f8f8;
        }
        .title {
            margin-top: 12px;
            font-size: 20px;
            color: #333333;
        }
        .sub-title {
            margin-top: 2px;
            margin-bottom: 12px;
            font-size: 12px;
            color: #999999;
            letter-spacing: 0;
        }

        .c-flex-row {
            margin-left: -10px;
            margin-right: -10px;

            .c-flex-item {
                position: relative;
            }

            .title {
                position: absolute;
                top: 10px;
                left: 20px;
                color: #fff;
                font-size: 14px;
            }
        }


    }

    .news-list {
        @extend %border-t;
        padding: 10px 0;
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
        height: 68px;
        @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
            height: 68px;
        }
        @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
            height: 88px;
        }
    }

</style>
