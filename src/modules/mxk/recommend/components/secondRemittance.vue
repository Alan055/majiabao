<template>
    <!--秒下款-->
    <div class="section secondContainer" @click="btnEvent">
        <p class="c-list-title white">秒下款专区</p>
        <div class="con-item">
            <p class="label"></p>
            <div>
                <p class="secondTitleBar" v-html="resData.content_plan1.pvalue"></p>
                <p class="desc">{{resData.content_plan2.pvalue}} </p>
            </div>
            <div>
                <mt-button type="primary" @click="btnEvent" size="normal" class="btn-round btn-empty handle-button">
                    {{resData.btn_plan.pvalue}}
                </mt-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "secondRemittance",
        props: {
            resData: {
                type: Object,
               /* default: () => {
                    return {

                        "btn_plan": {
                            "pcode": "btn_plan",
                            "pname": "秒下款申请按钮文案",
                            "pdesc": "申请按钮文案",
                            "pvalue": "申请放款",
                            "porder": 2
                        },
                        "content_plan2": {
                            "pcode": "content_plan2",
                            "pname": "秒下款文案二",
                            "pdesc": "秒下款文案二",
                            "pvalue": "绿色通道，金额直接入账银行卡",
                            "porder": 2
                        },
                        "content_plan1": {
                            "pcode": "content_plan1",
                            "pname": "秒下款文案一",
                            "pdesc": "秒下款文案一",
                            "pvalue": "<span>额度范围：</span><span>1000～20000元</span>",
                            "porder": 1
                        },
                        "url": {
                            "pcode": "url",
                            "pname": "秒下款访问url",
                            "pdesc": "秒下款访问url",
                            "pvalue": "www.baidu.com",
                            "porder": 2
                        }
                    }
                }*/
            }
        },

        methods: {
            btnEvent() {
 		this.sinaAds.click(this.stat.miaodai.recommendIndex.open);
                this.$root.openUrl(this.resData.url.pvalue);
            }
        }
    }
</script>


<style>
    p.secondTitleBar span:nth-child(1) {
        color: #333333;
        font-weight: 600;
    }

    p.secondTitleBar span:nth-child(2) {
        color: #E72427;
    }
</style>

<style lang="scss" scoped>

    //秒下款
    div.secondContainer {
        background: #FFF;
        margin: 8px auto;
        padding: 0 $gap;
        position: relative;
        .con-item {
            display: flex;
            height: 80px;
            margin-bottom: 30px;
            padding: 10px;
            padding-right: 20px;
            background: #f8f8f8;
            align-items: center;
            position: relative;
            margin-top: -6px;
            p.label {
                width: 48px;
                height: 48px;
                top: -2px;
                right: -2px;
                position: absolute;
                background: url("~@/assets/images/home/recommend_label@3x.png") no-repeat;
                background-size: 100%;
            }
            div {
                &:nth-child(1) {
                    flex: 2;
                    p.secondTitleBar {
                        font-family: PingFangSC-Medium;
                        font-size: 16px;
                        margin-top: -5px;
                        line-height: 26px;
                        // font-weight: 600;
                    }
                }
                .desc{
                    color: #999;
                    font-size: 12px;
                    margin-top: 5px;
                }
                &:nth-child(2) {
                    flex: 1;
                    color: #999;

                }
            }
        }
    }
    /deep/ .handle-button {
        width: 86px;
        height: 32px;
        font-size: 14px;
        position: relative;
        overflow: hidden;
    }
</style>




