<template>
    <div>
        <div class="refuseList-warp c-bg-gray">
            <bannerCard :isShow="isBannerShow" :list="bannerList" v-if="bannerList.length>0"/>
            <div class="c-border-b refuse-list">
                <li
                    class="c-border-b item"
                    v-sina-ads="{
                    currEvent:stat.recommend.refuse.click,
                    currentEventParams:{
                        name:item.name,
                    }
                    }"
                    v-for="(item,index) in refuseList"
                    :key="index"
                    @click="handleClick(item)"
                >
                    <div class="item-title">
                        <p class="name">
                            <img class="icon-bank" :src="item.iconurl"/>
                            <span class>{{item.name}}{{computedXmdriver(item)}}</span>
                        </p>
                        <!-- cai 不下发富文本  修改日期 2019-06-27 -->
                        <p class="text color-gary" v-html="item.text2[0] && item.text2[0].content"></p>
                    </div>
                    <div class="item-info">
                        <div class="info">
                            <h3>{{item.maxamount | money2Fixed}}</h3>
                            <p>{{item.text1[0] && item.text1[0].content}}</p>
                        </div>
                        <div class="link">
                            <span>{{item.text3[0] && item.text3[0].content}}</span>
                        </div>
                    </div>
                </li>
            </div>
        </div>
        <!--无数据-->
        <div class="c-view-content refuse-noList c-absolute c-bg-white" v-if="noRefuseData">
            <div class="refuse-noList-img c-aspectratio w-180-140">
                <div class="c-aspectratio-content2">
                    <img style="width: 100px;" src="~@/assets/images/bill-nodata.png"/>
                </div>
            </div>
            <div class="refuse-noList-text c-tc c-font-l">您暂时没有拒件记录</div>
        </div>
    </div>
</template>

<script>
    import api from "@/services/api.js";
    import qs from "qs";
    import util from "@/utils/index.js";
    import storage from "@/utils/storage";
    import {Indicator, Toast} from "@/utils/helper.js";
    import helper from "@/utils/helper.js";
    import bannerCard from "./components/bannerCard";
    import {mapMutations, mapState} from "vuex";

    export default {
        name: "refuseList",
        data() {
            return {
                bannerList: [],
                isBannerShow: false,
                refuseList: [],
                noRefuseData: false
            };
        },
        components: {
            bannerCard
        },

        computed: {

            ...mapState([
                'driver'
            ]),
            computedXmdriver(item) {
                return item => {
                    //   if (item.xmdriver && item.xmdriver == 1) {

                    if (item.xmdriver && (item.xmdriver == 1 || item.xmdriver == 2)) {
                        this.sinaAds.display({
                            currEvent: this.stat_diversion.diversion.refuse.show,
                            currEventParams: {
                                url: item.nextpage.url
                            }
                        });

                    }
                    return "";
                };
            },

        },
        methods: {
            ...mapMutations(['setDriverConfig',]),

            parseDriver(data) {
                let list = {}, i = 0
                data.map(item => {
                    item[`id`] = `id_${i}`
                    if (item.unloginUrl) {
                        list[`id_${i}`] = item.unloginUrl
                    }
                    i++
                })
                this.setDriverConfig({key: 'refuseList', data: list})
            },

            fetchData() {
                api.loan
                    .getRejectedItems()
                    .then(res => {

                      //  res= this.mock.refuse

                        if (res.code == 200) {
                            if (res.data && res.data.length > 0) {

                                this.parseDriver(res.data)
                                this.renderData(res.data);

                            } else {
                                this.noRefuseData = true;
                            }
                        } else {
                            //拒件记录为空
                            Toast("服务器繁忙，请稍后再试");
                        }
                    })
                    .finally(this.$root.loadingClose);
            },
            renderData(data) {
                data &&
                data.map(item => {
                    let obj = item;
                    obj.text1 = item.copywrites.filter(i => i.type == 1);
                    obj.text2 = item.copywrites.filter(i => i.type == 2);
                    obj.text3 = item.copywrites.filter(i => i.type == 3);
                    this.refuseList.push(obj);
                });
                this.$root.loadingClose();
                console.log("this.refuseList", this.refuseList);
            },
            handleClick(option) {
                // 灰显不点击
                // return false;
                //修改原因，下发地址是中转页面

                let url = option.nextpage.url;
                let search = url.split("?")[1] || "";
                let params = qs.parse(search);
                let submitData = {
                    orderid: params.orderid || "",
                    billid: params.billid || "",
                    fundproductid: params.productid || ""
                };

                if (this.driver.refuseList[option.id]) {
                    this.beforeDriver(this.driver.refuseList[option.id])
                }

                if (option.xmdriver && (option.xmdriver == 1 || option.xmdriver == 2)) {
                    this.sinaAds.click({currEvent: this.stat_diversion.diversion.refuse.btnClick}, () => {
                        this.$root.openUrl(url);
                    });
                    return;
                }
                if (url.toLowerCase().indexOf("getnextpage") > -1) {
                    Indicator.open();
                    api
                        .getRouterUrl(submitData)
                        .then(res => {
                            // res = getRouterData;
                            if (helper.isSuccess(res)) {
                                let url = res.data.forwardItemBeans[0].url;
                                this.$root.openUrl(url, this.resdata);
                            }
                        })
                        .finally(Indicator.close);
                } else {
                    this.$root.openUrl(url, {
                        title: "拒件记录"
                    });
                }
            },
            getBannerInfo() {
                api.activity
                    .getApprovaling({
                        pageid: "1019",
                        token: util.getParams("token") || storage.get("token") || ""
                    })
                    .then(res => {
                        if (res.code == 200) {
                            console.log(res.data.pagedata);
                            if (res.data.pagedata && res.data.pagedata.refusedetail) {
                                this.bannerList = res.data.pagedata.refusedetail.pagedata;
                                if (this.bannerList) {
                                    this.isBannerShow = true;
                                }
                            }
                        } else {
                            Toast(res.msg);
                        }
                    });
            }
        },

        created() {
            this.fetchData();
            this.getBannerInfo();
            this.$root.setWebAttribute({
                title: "拒件记录",
                refresh: true
            });
        }
    };
</script>

<style lang="scss" scoped>
    .c-aspectratio-content2 {
        text-align: center;

        img {
            width: 100px;
        }
    }

    // 无数据
    .refuse-noList {
        top: 20%;
        left: 50%;
        transform: translate(-50%, -50%);
        /*展示图片样式*/
        .refuse-noList-img {
            width: 100%;

            img {
                width: 100%;
            }
        }

        /*占位符*/
        .w-180-140 {
            aspect-ratio: "180:140";
        }

        /*展示文字样式*/
        .refuse-noList-text {
            color: #666;
        }
    }

    .refuse-list {
        background: #fff;
        padding-left: 16px;

        .text {
            &.color-gary {
                color: #999;
            }
        }

        li {
            height: 118px;
            padding: 20px 20px 20px 0;

            &:last-child {
                border: none;
            }

            .item-title {
                height: 20px;
                line-height: 20px;
                display: flex;
                justify-content: space-between;

                p.name {
                    display: flex;
                    align-items: center;

                    img {
                        width: 16px;
                        height: 16px;
                        margin-right: 4px;
                    }

                    span {
                        color: #666;
                        font-size: 14px;
                    }
                }

                p.text {
                    font-size: 12px;
                }
            }

            .item-info {
                height: 58px;
                display: flex;
                justify-content: space-between;

                .info {
                    h3 {
                        height: 33px;
                        line-height: 33px;
                        font-size: 24px;
                        color: #333;
                    }

                    p {
                        height: 25px;
                        line-height: 25px;
                        color: #999;
                        font-size: 12px;
                    }
                }

                .link {
                    height: 58px;
                    display: flex;
                    align-items: center;

                    span {
                        width: 86px;
                        height: 32px;
                        line-height: 32px;
                        text-align: center;
                        box-sizing: border-box;
                        color: #2980ff;
                        border: 1px solid #2980ff;
                        border-radius: 16px;
                        font-size: 14px;
                        // color: #ccc;
                        // border:1px solid #ccc;
                    }
                }
            }
        }
    }
</style>
