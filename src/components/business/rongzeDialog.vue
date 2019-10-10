<template>
    <Popup :value="isShow">
        <div class="rongze-dialog" slot="content">
            <img v-if="data && data.imgurl" class="el-full-img" :src="data.imgurl"
                 v-sina-ads="{
            currEvent: stat_diversion.diversion.dialog.btnClick,
            currentEventParams:{
                url: data.url
            }
        }" @click="openJump">
            <div class="el-close" @click="isShow = !isShow"
                 v-sina-ads="{
                currEvent: stat_diversion.diversion.dialog.hideClick,
                currentEventParams:{
                    url: data.url,
                }
            }"
            >
                <img src="~@/assets/images/diversion/close.png">
            </div>
        </div>
    </Popup>
</template>
<script>
    import Popup from "@/components/view/popup";
    import {Toast, Indicator, MessageBox} from "@/utils/helper";
    import helper from "@/utils/helper";
    import api from "@/services/api.js";
    import { mapState} from "vuex";
    import AppBridge from "@/services/AppBridge.js";

    export default {
        name: "rongze-dialog",
        components: {
            Popup
        },

        computed: {
            ...mapState([
                'driver'
            ]),

            finished() {
                if (this.selectedValue) {
                    return true;
                }

                if (this.area != null && this.area.text.trim() != "") {
                    return true;
                }
                return false;
            }
        },

        props: {
            visibility: {
                type: Boolean,
                default: false
            },
            data: {}
        },

        data() {
            return {
                isShow: false,
            };
        },

        mounted() {
            window.removeRongzeCacheKey = (key) => {
                helper.remove(key || 'rongzeDialog-visibility');
                console.log('清除缓存成功')
            }
        },

        methods: {

            openJump(){

                this.sinaAds.click({currEvent: this.stat_diversion.diversion.dialog.btnClick,}, () => {});

                //联合登录
                this.beforeDriver(this.driver.xm_driverPopConfig.unloginUrl)

                this.driver.xm_driverPopConfig.url && AppBridge.activityView({
                    type: "open",
                    url: this.driver.xm_driverPopConfig.url,
                    open_inner: this.driver.xm_driverPopConfig.type==1,
                });
              //  this.$root.openUrl(this.data.url)
            },

            close(flag) {
                this.$emit("close", flag);
            },
            close() {
                this.isShow = false;

                if (process.env.NODE_ENV != "production") { //为了测试
                    helper.remove('rongzeDialog-visibility');
                    console.log('清除缓存成功')
                }
            },
            show() {
                this.isShow = true;
                //this.sinaAds.show({ //show currEvent为当前页面地址，且不会显示currEventParams
                this.sinaAds.popover({
                    currEvent: this.stat_diversion.diversion.dialog.show,
                    currEventParams: {
                        url: this.data.url,
                        title: '显示'
                    }
                });
            },
            replaceTrim(str) {
                return str.replace(/^\s+|\s+$/g, "");
            }
        },
        watch: {
            visibility() {
                if (this.visibility) {

                    helper.get('rongzeDialog-visibility').then((res) => {
                        if (res) {
                            let tipCount = this.data.tipCount;
                            let time = 86400 * 1000;
                            let newTime = new Date().getTime();
                            //let newTime = 1561723328495;

                            //当前时间 减去 缓存的时间，如果大于1天/ 1/2天 1/3天，显示
                            if ((newTime - res) >= time / tipCount) {
                                this.show();
                            }
                        } else {
                            this.show();
                        }
                        helper.set("rongzeDialog-visibility", new Date().getTime());
                    })

                }
            }
        }
    };
</script>


<style lang="scss">
    .flex {
        display: flex;
    }

    .rongze-dialog {
        width: 275px;

        .el-full-img {
            width: 100%;
        }

        .el-close {
            width: 24px;
            height: 24px;
            display: block;
            margin: 10px auto;

            img {
                width: 100%;
            }
        }

    }
</style>
