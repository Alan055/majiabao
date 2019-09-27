<template>
    <Popup :value="isShow">
        <div class="diversion-xmLoan-dialog" slot="content">
            <div class="el-content">
                <div class="el-icon">
                    <img :src="resdata.mainpackage_bill_notice.icon" />
                </div>
                <div class="el-close" @click="isShow = !isShow" 
                                    v-sina-ads="{
                                        currEvent: statdata.close
                                    }">
                    <img src="~@/assets/images/icon/icon-close.png" />
                </div>
                <div class="el-title">{{resdata.mainpackage_bill_notice.title}}</div>
                <div class="el-subtitle" v-html="resdata.mainpackage_bill_notice.content"></div>

                <mt-button
                        class="btn-round handle-button"
                        size="normal"
                        type="primary"
                        plain
                        @click.native="openJump(resdata.mainpackage_bill_download_ios)"
                      >
                      
                      {{resdata.mainpackage_bill_notice.button}}
                      </mt-button>
            </div>
        </div>
    </Popup>
</template>
<script>
import Popup from "@/components/view/popup";
import helper from "@/utils/helper";
import util from "@/utils";
import api from "@/services/api.js";
import AppBridge from "@/services/AppBridge.js";

export default {
    props: ["resdata", "statdata", "cachkey"],
    name: "diversionXmLoan-dialog",
    components: {
        Popup
    },
    data() {
        return {
            isShow: false
            
        }
    },

    mounted() {
        window.removeDiversionXmLoanCommonCacheKey = key => {
            helper.remove(key || this.cachkey + "diversionXmLoanCommon-visibility");
            console.log("清除缓存成功");
        };

        if (this.resdata.mainpackage_bill_notice) {
            helper.get(this.cachkey + "diversionXmLoanCommon-visibility").then(res => {
                let tipCount = 1;
                let newDate = new Date();
                let fullyear = newDate.getFullYear();
                let month = newDate.getMonth() + 1;
                let date = newDate.getDate();
                
                //每弹出一次
                let fulldate = String(fullyear) + String(month) + String(date);
                if (res) {
                    if (fulldate != res) {
                    this.show();
                    }
                } else {
                    this.show();
                }
                helper.set(this.cachkey + "diversionXmLoanCommon-visibility", fulldate);
                console.log('当前写入的缓存日期，' + fulldate)
            });
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            return new Promise((resolve, reject) => {
                api.activity
                    .getAppMarketInfo({
                        pageid: "1031",
                        productId: "2001",
                        token: util.getParams("token")
                    })
                    .then(res => {
                        if (res.code == 200 && res.data) {
                            this.marketInfoData = res.data;

                            console.log('marketInfoData', this.marketInfoData)
                        }
                        resolve(res);
                    });
            })
        },
        openJump(url) {
            this.sinaAds.click({ 
                currEvent: this.statdata.click
            });
            //this.$root.openUrl(url)

            // "type": "1", //1 内联 2外联打开
            AppBridge.activityView({
                type: "open",
                url: url,
                open_inner: false,
            });

            setTimeout(() => {
                this.close()
            }, 2000);
        },

        close() {
            this.isShow = false;

            if (process.env.NODE_ENV != "production") {
                helper.remove(this.cachkey + "diversionXmLoanCommon-visibility");
                console.log("清除缓存成功");
            }
        },
        show() {
            this.isShow = true;
            this.sinaAds.popover({
                currEvent: this.statdata.popover, 
                currEventParams: {
                    
                }
            });
        },
        replaceTrim(str) {
            return str.replace(/^\s+|\s+$/g, "");
        }
    },
    watch: {
    }
};
</script>

<style lang="scss" scoped>
.diversion-xmLoan-dialog {
    width: 278px;

    .el-content {
        position: relative;
        background-color: #fff;
        border-radius: 12px;
        padding: 30px 35px;
        text-align: center;
        color: #333333;
        .el-icon {
            width: 107px;
            margin: -80px auto auto auto;

            img {
                width: 100%;
            }
        }

        .el-close {
            position: absolute;
            top: 4px;
            right: 4px;
            padding: 6px;
            img {
                width: 10px;
            }

        }
        .el-title {
            font-size: 20px;
            color: #333333;
            font-weight: bold;
            margin-top: 6px;
        }
        .el-subtitle {
            color: #333333;
            margin: 16px 0 31px 0;
        }

        .handle-button {
            background-image: linear-gradient(-134deg, #6E89FF 0%, #5C77FA 100%);
            box-shadow: 0 2px 11px 0 rgba(95,122,251,0.51);
            border-radius: 100px;
            font-size: 16px;
            color: #FFFFFF;
            border: 0;
            margin-top: 6px;            
            width: 208px;
        }
    }
}
</style>
