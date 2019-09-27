<template>
    <div>
        <!-- 借还记录 -->
        <div class="record-wrap" v-if="data && data.length > 0">
            <p class="list-title">待提现</p>
          <redBagBox :res="resdata.welfareInfo" style="padding: 0 12px;background: #ffffff;box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);"></redBagBox>

          <div class="list-wrap">
                <div class="list-center">
                    <div class="list-center-bg">
                        <div class="list-content">
                            <div class="list" v-for="(item, i) in data" :key="i">


                                <div class="el-rongze-badge"
                                     :style="driverIcon(item)"
                                     v-if="item.xmdriver && item.xmdriver == 1"
                                >{{computedXmdriver(item)}}
                                </div>

                                <div class="el-qsj-badge"
                                     :style="driverIcon(item)"
                                     v-if="item.xmdriver && item.xmdriver == 2"
                                >{{computedQSJdriver(item)}}
                                </div>


                                <div class="list-item c-flex-row">
                                    <div class="c-flex-item c-tl">
                                        <p class="title">
                                            <img class="c-financing-logo" :src="item.iconurl" alt>
                                            {{item.name}}
                                        </p>

                                        <p v-if="!item.isShowFeeText" class="number">{{item.maxamount |
                                            money2Fixed}}</p>
                                        <p class="number" v-else>{{item.isShowFeeText}}</p>
                                        <p class="desc" v-html="getLabel(item.copywrites, 1)+''"></p>
                                    </div>

                                    <div class="c-tr">
                                        <p class="state">
                                            <span v-html="getLabel(item.copywrites, 2)"></span>
                                        </p>
                                        <mt-button
                                            v-sina-ads="{
                                        currEvent:stat.recommend.records.openBtn,
                                        currEventParams:{
                                            name:item.name,
                                            productid:item.id,
                                            status:item.status
                                        }
                                    }"
                                            class="btn-round handle-button"
                                            :class="getClass(item.copywrites, 3)"
                                            size="normal"
                                            type="primary"
                                            plain
                                            @click.native="jump(item)"
                                        >
                                            <animation-item :data="item"
                                                            :label="getLabel(item.copywrites, 3)"></animation-item>
                                        </mt-button>
                                    </div>
                                </div>
                                <div class="c-welfare-info" v-if="item.isShowWelfareInfo">
                                    <img :src="item.icon">
                                    <span v-html="item.productlistdesc"></span>
                                </div>
                              <redCashBack :res="resdata.welfareInfo" :item="resdata.welfareInfo.listRelData&&resdata.welfareInfo.listRelData.find(e=>(e.productid == item.id))"></redCashBack>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="no-record-wrap" v-else>
            <img src="../../images/no-pass-panda.png">
            <p class="title">很抱歉！暂未匹配到更多可借放款机构～</p>
            <p class="sub-title">请保持关注，更多金融机构正在接入中…</p>
        </div>
    </div>
</template>

<script>
    import animationItem from "./animationItem";
    import qs from "qs";
    import api from "@/services/api";
    import helper from "@/utils/helper";
    import {Indicator} from "@/utils/helper";
    import redBagBox from "@/components/business/redEnvelopeCell.vue";
    import redCashBack from "@/components/business/redEnvelopeBottom.vue";

    export default {
        data() {
            return {
                isShowNodata: false,
                isUpDiversion: 0,
                isUpDiversionQsj:0,
            };
        },
        props: ["resdata"],
        computed: {
            data() {
                return this.resdata.withdrawProducts;
                /*
                      return this.resdata.applyproducts.filter((item) => {
                          return item.status == 10
                      })*/
            },
            titleColor() {
                let {newcards} = this.resdata;
                return !newcards || !newcards.length ? "white" : "";
            },
            titleColor() {
                let {newcards} = this.resdata;
                return !newcards || !newcards.length ? "white" : "";
            },
            computedXmdriver(item) {
                return item => {
                    if (item.xmdriver && item.xmdriver == 1 && this.isUpDiversion == 0) {
                        this.sinaAds.display(
                            {
                                currEvent: this.stat_diversion.diversion.recommend.show,
                                currEventParams: {
                                    url: item.nextpage.url
                                }
                            },
                            () => {
                                this.isUpDiversion = 1;
                            }
                        );
                    }
                    return "";
                };
            },

            computedQSJdriver(item) {
                return item => {
                    if (item.xmdriver && item.xmdriver == 2 && this.isUpDiversionQsj == 0) {
                        this.sinaAds.display(
                            {
                                currEvent: this.stat_diversion.diversion.recommend.showQsj,
                                currEventParams: {
                                    url: item.nextpage.url
                                }
                            },
                            () => {
                                this.isUpDiversionQsj = 1;
                            }
                        );
                    }
                    return "";
                };
            },

            driverIcon(item) {
                return item => {

                    if (!(item.xmdriver && item.xmdriverCornerMarker)) return {}

                    return {
                        background: `url(${item.xmdriverCornerMarker})  0% 0% / 100% 100% no-repeat scroll`,
                    }

                };
            }
        },
        components: {
            animationItem,
          redBagBox,
          redCashBack,
        },

        created() {

        },

        methods: {
            getLabel(value, type) {
                let content = value.filter(item => item.type == type)[0];
                return content ? content.content : "";
            },
            getClass(value, type) {
                let remark = value.filter(item => item.type == type)[0].remark;
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
            jump(item) {
                let url = item.nextpage.url;
                let search = url.split("?")[1] || "";
                let params = qs.parse(search);
                let {orderid, billid, productid: fundproductid} = params;
                let {xmdriver, nextpage, unloginUrl} = item;

                unloginUrl && this.beforeDriver(unloginUrl)

                if (xmdriver && (xmdriver == 1 || xmdriver == 2)) {
                    this.sinaAds.click(
                        {
                            currEvent: xmdriver == 1  ? this.stat_diversion.diversion.recommend.btnClick: this.stat_diversion.diversion.recommend.btnClickQSJ ,
                            currEventParams: {
                                url: item.nextpage.url,
                            }
                        },
                        () => {
                            this.$root.openUrl(nextpage.url);
                        }
                    );
                    return;
                }
                Indicator.open();
                api
                    .getRouterUrl({orderid, billid, fundproductid})
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
            "resdata.welfareInfo"() {
                let welfareInfoIds = [];
                if (this.resdata.welfareInfo && this.resdata.welfareInfo.length > 0) {
                    welfareInfoIds = this.resdata.welfareInfo.map(item => {
                        return item.productid;
                    });
                    let newApplyData = this.resdata.applyproducts.map(item => {
                        if (welfareInfoIds.includes(item.id)) {
                            //有福利红包
                            let welfareData = this.resdata.welfareInfo.filter(wfItem => {
                                return wfItem.productid == item.id;
                            });
                            if (welfareData && welfareData.length > 0) {
                                return Object.assign(item, {
                                    isShowWelfareInfo: true,
                                    icon: welfareData[0].icon,
                                    productlistdesc: welfareData[0].productlistdesc
                                });
                            } else {
                                return item;
                            }
                        } else {
                            return item;
                        }
                    });
                    this.resdata.applyproducts = newApplyData;
                }
            }
        }
    };
</script>

<style lang="scss" scoped>

    .pub-badge {
        position: absolute;
        top: -3px;
        left: -3px;
        height: 40px;
        width: 40px;
    }

    .record-wrap {
        padding: 0 $gap;
        overflow: hidden;
        position: relative;
        background-color: #fff;

        .el-rongze-badge {
            @extend .pub-badge;
            background: url("~@/assets/images/diversion/jiaobiao.png") 0% 0% / 100% 100% no-repeat scroll;
        }

        .el-qsj-badge {
            @extend .pub-badge;
            background: url("~@/assets/images/diversion/wumenkan.png") 0% 0% / 100% 100% no-repeat scroll;
        }
    }

    .c-financing-logo {
        border: 0;
        border-radius: 50%;
    }

    .record-warp-nodata {
        position: relative;
        background: #fff;
        background-image: url("../../images/record-nodata.png");
        background-repeat: no-repeat;
        background-size: 100% 260px;
        overflow: hidden;
        height: 260px;

        .no-data-content {
            position: absolute;
            bottom: 0;
            width: 94%;
            margin: 0 13px;
            height: 80px;
            line-height: 80px;
            background-color: white;
            text-align: center;
            border-radius: 4px;
            color: #666;
        }
    }

    .list-title {
        line-height: 25px;
        font-size: 18px;
        padding: 18px 0;
        text-align: left;
        font-weight: 600;

        &.white {
            color: white;
        }
    }

    .list-wrap {
        margin: 0 (-$gap);
    }

    .list-content {
        padding: 0 16px;
    }

    .list {
        position: relative;
        padding: 16px 12px;
        background: #ffffff;
        box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);
        border-radius: 4px;
        margin-bottom: 14px;

        .c-welfare-info {
            display: flex;
            align-items: center;
            background: #f5f5f5;
            border-radius: 2px;
            padding: 2px 5px;
            margin-top: 4px;
            margin-left: 20px;

            img {
                width: 12px;
                height: 12px;
            }

            span {
                font-size: 12px;
                color: #333333;
                margin-left: 4px;
            }
        }
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


    }
    .handle-button {
      margin-top: 16px;
      width: 86px !important;
      height: 32px !important;
      font-size: 14px !important;
      position: relative;
      overflow: hidden;

      /deep/ &.red {
        background: #019aff;
        box-shadow: 0 3px 13px 0 rgba(0, 91, 250, 0.24);
        border-radius: 20px;
        color: white;
      }

      /deep/ &.blue {
        color: #659ffc;
        border-color: #659ffc;
      }
    }
    /deep/ .handle-button {
      height: 32px !important;
      label {
        font-size: 14px;
      }
    }

    .no-record-wrap {
        background-color: #fff;
        text-align: center;

        img {
          height: 100px;
          margin: 35px auto 16px auto;
        }

        .title {
          font-size: 16px;
          color: #333333;
          letter-spacing: 0;
          text-align: center;
        }

        .sub-title {
          padding: 14px 0 38px 0;
          font-size: 14px;
          color: #5a6275;
          letter-spacing: 0;
          text-align: center;
        }
      }
</style>
