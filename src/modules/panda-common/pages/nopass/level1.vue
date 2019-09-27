<template lang="html">
    <div class="view">

        <div class="c-layer">
            <div class="pull-down-bg" :style='{height: "20vh"}'></div>
        </div>

        <div class="c-view-content">
            <div class="nopass-content">
                <div id="blockHeaderContent" class="block-header" ref="transparentBlock"></div>

                <div class="header-content">
                    <span class="center">
                        <img src="../../assets/images/header-logo@2x.png"/>
                    </span>
                </div>

                <div class="m-norecord">
                    <div class="left">
                        <h1>{{searchData.floattext}}</h1>
                        <div class="sub-title">{{searchData.icontext}}</div>
                    </div>
                    <div class="right">
                        <mt-button
                            class="btn-round handle-button"
                            size="normal"
                            type="primary"
                            plain
                            @click.native="handleOpenUrl(searchData.jumplink, searchData.title)"
                        >去查询
                      </mt-button>
                    </div>
                </div>
            </div>

            <div class="m-huabei">
                <div class="title">为您推荐</div>
                <div class="el-content">
                    <van-swipe indicator-color="white" :autoplay="3000" :height="90">
                        <van-swipe-item v-for="(item, i) in recommendData" :key="i">
                            <div class="el-img">
                                <img :src="item.imgurl" @click="handleOpenUrl(item.jumplink, item.title)"/>
                            </div>
                        </van-swipe-item>
                    </van-swipe>
                </div>
            </div>
            <div class="m-welfare">
                <div class="title">限时福利</div>
                <div class="el-content">
                    <div class="el-left">
                        <div class="el-img">
                            <img :src="welfare.left" @click="handleOpenUrl(welfare.leftclick, welfare.leftclickTitle)"/>
                        </div>
                    </div>
                    <div class="el-right">
                        <div class="el-img">
                            <img class="el-img-one" :src="welfare.righttop" @click="handleOpenUrl(welfare.righttopclick, welfare.righttopclickTitle)" />
                            <img class="el-img-two" :src="welfare.rightbottom" @click="handleOpenUrl(welfare.rightbottomclick, welfare.rightbottomclickTitle)" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import newcards from "./components/newcards";
    import storage from "@/utils/storage";
    import helper from "@/utils/helper";
    import util from "@/utils";
    import api from "@/services/api";
    import EventBus from "@/services/EventBus";
    import {Toast, Indicator} from "@/utils/helper";

    import AppBridge from "@/services/AppBridge.js";

    export default {
        data() {
            return {
                searchData: {
                    floattext: '',
                    icontext: '',
                    jumplink: '',
                    title: ''
                },
                recommendData: [],
                welfare: {
                    left: '',
                    leftclick: '',
                    leftclickTitle: '',
                    righttop: '',
                    righttopclick: '',
                    righttopclickTitle: '',
                    rightbottom: '',
                    rightbottomclick: '',
                    rightbottomclickTitle: ''
                }
            };
        },
        components: {
            
        },

        methods: {
            fetchData() {
                return new Promise((resolve, reject) => {
                    api.activity
                        .getApprovaling({
                            pageid: "1033",
                            productId: "2001",
                            token: util.getParams("token")
                        })
                        .then(res => {
                            if (res.code == 200 && res.data) {
                                if(res.data.pagedata.blackPageTop && res.data.pagedata.blackPageTop.pagedata) {
                                    this.searchData = res.data.pagedata.blackPageTop.pagedata[0];
                                    console.log('this.searchData', this.searchData)
                                }
                                if(res.data.pagedata.blackPageBanner && res.data.pagedata.blackPageBanner.pagedata) {
                                    this.recommendData = res.data.pagedata.blackPageBanner.pagedata;
                                    console.log('this.recommendData', this.recommendData)

                                }
                                if(res.data.pagedata.blackPageFuLi && res.data.pagedata.blackPageFuLi.pagedata) {
                                    this.welfare.left = res.data.pagedata.blackPageFuLi.pagedata[0].imgurl;
                                    this.welfare.leftclick = res.data.pagedata.blackPageFuLi.pagedata[0].jumplink;
                                    this.welfare.leftclickTitle = res.data.pagedata.blackPageFuLi.pagedata[0].title;

                                    this.welfare.righttop = res.data.pagedata.blackPageFuLi.pagedata[1].imgurl;
                                    this.welfare.righttopclick = res.data.pagedata.blackPageFuLi.pagedata[1].jumplink;
                                    this.welfare.righttopclickTitle = res.data.pagedata.blackPageFuLi.pagedata[1].title;

                                    this.welfare.rightbottom = res.data.pagedata.blackPageFuLi.pagedata[2].imgurl;
                                    this.welfare.rightbottomclick = res.data.pagedata.blackPageFuLi.pagedata[2].jumplink;
                                    this.welfare.rightbottomclickTitle = res.data.pagedata.blackPageFuLi.pagedata[2].title;
                                }
                            }
                            resolve(res);
                        });
                })
            },
            handleOpenUrl(url, title) {
                console.log('title', title)
                AppBridge.activityView({
                    url: url,
                    title: title
                })
            },
            // 获取在线客服地址
            getOnlineService() {
                AppBridge.getVisitUrl(
                    {
                        pageName: "ONLINESERVICE"
                    },
                    res => {
                        if (!res || !res.data) return;
                        let data = res.data;
                        if (typeof data == "string") {
                            data = JSON.parse(data);
                        }

                        if (data && data.url) {
                            this.onlineServiceUrl = data.url;
                        }
                    }
                );
            }
        },
        created() {
            this.fetchData();
            //this.getOnlineService();
          
        },
        mounted() {
            this.$nextTick(() => {
                this.$root.loadingClose();
            });
        },
        onRefresh(tag, data) {
            if (tag == "home" || tag == "refresh") {
                this.init(tag);
            }
        },
        watch: {}
    };
</script>

<style lang="scss" scoped>
    @-webkit-keyframes loadingRotate {
        0% {
            -webkit-transform: rotateZ(0deg);
        }
        100% {
            -webkit-transform: rotateZ(360deg);
        }
    }

    .view {
        transform: translateX(0);

        /deep/ .inner {
            margin-top: -22px !important;
            position: relative;
            min-height: 111vh;

            .pull-refresh {
                background-color: transparent !important;
                height: 24px !important;
                padding: 0 !important;
            }
        }

        .c-view-content {
            transition: all 0.5s;
            min-height: 100vh;
        }

        .nopass-content {
            background: url("../../assets/images/recommend-bg@2x.png") no-repeat;
            background-size: 100%;
            width: 100%;
            min-height: 230px;

            .header-content {
                text-align: center;

                .center {
                    display: inline-block;
                    width: 100px;

                    img {
                        width: 100%;
                    }
                }

                .right {
                    position: absolute;
                    right: 0;
                    margin-right: 16px;
                    margin-top: -4px;
                }

                .title {
                    text-align: left;
                    padding: 0 16px;
                    margin-bottom: 4px;
                    font-size: 16px;
                    color: #ffffff;
                    letter-spacing: 0.89px;
                    margin-top: 16px;
                }

                .sub-title {
                    text-align: left;
                    padding: 0 16px;
                    margin-bottom: 8px;
                    font-size: 14px;
                    color: #ffffff;
                    letter-spacing: 0.89px;
                    opacity: 0.86;
                    margin-top: 12px;
                }

                /*向下箭头*/
                .triangle-border-down {
                    width: 0;
                    height: 0;
                    border-width: 8px 8px 0;
                    border-style: solid;
                    border-color: #ffffff transparent transparent; /*灰 透明 透明 */
                    margin: 14px auto;
                    position: relative;
                    opacity: 0.84;
                }

                .no-thirdproducts {
                    position: relative;
                    z-index: 2;
                    margin: 0 auto;
                    background: #ffffff;
                    box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.1);
                    border-radius: 6px;
                    height: 246px;
                    width: 343px;
                    text-align: center;

                    img {
                        width: 131px;
                        height: 83px;
                        margin-top: 49px;
                    }

                    .title {
                        font-size: 16px;
                        color: #353241;
                        letter-spacing: 0.5px;
                        text-align: center;
                    }

                    .sub-title {
                        font-size: 14px;
                        color: #666666;
                        letter-spacing: 0.5px;
                        text-align: center;
                    }
                }
            }
        }
    }

    .no-thirdproducts-kefu {
        margin: 20px 16px;

        img {
            width: 100%;
        }
    }

    .bg {
        height: 100vh;
        background: white;
        position: relative;
        z-index: -1;

        img {
            display: block;
            width: 100%;
            position: relative;
            z-index: -1;
        }
    }

    .pull-down-bg {
        background-image: linear-gradient(-190deg, #7164cb 0%, #3961d6 100%);
        position: absolute;
        z-index: -1;
        width: 100%;
    }

    .header {
        position: relative;
        z-index: 1;
        // transition: background .3s;
        &.show {
            background: #514353 !important;
            color: white !important;
        }
    }

    .block-header {
        display: block;
        background: transparent;
        height: 54px;

        @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
            height: 68px;
        }
        @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
            height: 88px;
        }
    }

    .section + .section {
        border-top: 8px solid #f4f4f4;
    }

    .iframe-section {
        border-top: 0 !important;
    }

    .m-norecord {
        display: flex;
        background: #ffffff;
        box-shadow: 0 4px 18px 0 rgba(0,0,0,0.10);
        border-radius: 6px;
        text-align: left;
        padding: 16px 26px;
        margin: 34px 16px 0 16px;
        background-size: 100%;

        .left {
            flex: 1;

            h1 {
                font-size: 18px;
                color: #333333;
                letter-spacing: -0.28px;
            }

            .sub-title {
                text-align: left;
                font-size: 14px;
                letter-spacing: 0.89px;
                opacity: 0.86;
                margin-top: 12px;
            }
        }
        .right {
            width: 100px;
            text-align: right;
            padding-top: 50px;

            button {
                background: #5882FF;
                box-shadow: 0 1px 6px 0 rgba(88,130,255,0.40);
                border-radius: 16px;
                color: #fff;
                border: 0;
                font-size: 14px;
                padding: 8px 18px;
                height: auto;
            }
        }
    }

    .m-huabei {
        .title {
            margin: 30px 0 16px 16px;
            font-size: 16px;
            color: #333333;
            letter-spacing: 0.89px;
        }

        .el-content {
            padding: 0 16px;

            .el-img {
                width: 100%;
                height: 100%;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
    .m-welfare {
        .title {
            margin: 28px 0 7px 16px;
            font-size: 16px;
            color: #333333;
            letter-spacing: 0.89px;
        }
        .el-content {
            padding: 0 16px;    
            display: flex;
            .el-left {
                width: 50%;
                padding-right: 8px;
            }
            .el-right {
                width: 50%;
            }
            
            .el-img {
                img {
                    width: 100%;

                }
                .el-img-one {
                    margin-bottom: 2px;
                }
            }
        }
    }

</style>
