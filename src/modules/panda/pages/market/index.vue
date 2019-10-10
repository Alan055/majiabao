<template>
    <div class="view">
        <div class="c-view-content" :style="{'background-color': marketInfoData.icontext}">
            <div class="m-banner">
                <img :src="marketInfoData.imgurl" />
            </div>
            <div class="m-market" v-if="iframeUrl">
                <c-market class="section iframe-section" id="iframeSection" :iframeUrl="iframeUrl"/>
            </div>
        </div>
    </div>
</template>

<script>
    import api from "@/services/api.js";
    import util from "@/utils/index.js";
    import helper from "@/utils/helper.js";
    import cMarket from '@/components/view/cMarket';

    export default {
        name: "marketInfo",
        data() {
            return {
                iframeUrl: '',
                approvalingInfo: {

                },
                marketInfoData: {
                    icontext: "#fff",
                    imgurl: "",
                    title: '',
                }
            };
        },
        components: {
            cMarket
        },

        methods: {
            getApprovaling() {
                return new Promise((resolve, reject) => {
                    api.activity
                        .getApprovaling({
                            pageid: "1032",
                            productId: "2001",
                            token: util.getParams("token")
                        })
                        .then(res => {
                            if (res.code == 200 && res.data) {
                                if(res.data.pagedata && res.data.pagedata.marketPopLandingBanner) {
                                    if(res.data.pagedata.marketPopLandingBanner.pagedata[0]){
                                        this.marketInfoData = res.data.pagedata.marketPopLandingBanner.pagedata[0]

                                        if(this.marketInfoData.title) {
                                            this.$root.setWebAttribute({
                                                title: this.marketInfoData.title
                                            });
                                        }
                                    }
                                }
                                console.log('marketInfoData', this.marketInfoData)
                            }
                            resolve(res);
                        })
                })
            },
            getAppMarketInfo() {
                return new Promise((resolve, reject) => {
                    api.activity
                        .getAppMarketInfo({
                            pageid: "1032",
                            productId: "2001",
                            token: util.getParams("token")
                        })
                        .then(res => {
                            if (res.code == 200 && res.data) {
                                this.iframeUrl = res.data.jumplink;

                                console.log('marketInfoData', this.marketInfoData)
                            }
                            resolve(res);
                        });
                })
            }
        },

        created() {
            this.getApprovaling();
            this.getAppMarketInfo();
        }
    };
</script>

<style lang="scss" scoped>
    .m-banner {
        img {
            width: 100%;
        }
    }
    .m-market {
        padding: 10px;
    }
</style>
