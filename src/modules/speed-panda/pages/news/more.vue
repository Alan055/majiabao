<template>
    <div class="view c-view-gay">
        <div class="c-view-content">
                <div class="c-module">
                    <div class="title">借款攻略</div>
                    <div class="sub-title">借款只是，成就贷款达人</div>
                    <div class="news-list" @click="handleInfoClick(item)" v-for="(item, i) in informationData1" :key="i">
                        <div class="list-left">
                        <div class="list-title">{{item.title}}</div>
                        <div class="list-time">阅读：{{item.through > 100000 ? '10万+' : item.through}}</div>
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
                topInfo: [],
                informationData1: [],
                informationData2: [],
                informationData3: []
            };
        },
        computed: {

        },
        methods: {
            handleGotoMore() {
                
            },
            getInfomationList() {
                api.mxk.getInfomationList({
                    toptype: 4, 
                    type: 5
                }).then(res => {
                    if (!helper.isSuccess(res)) return;
                    if(res.data){
                        console.log('res.data', res.data)
                        if(res.data){
                            this.informationData1 = res.data.topInfo;
                        }
                    }
                });
            },
            handleInfoClick(item) {
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
            margin-top: 4px;
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
        height: 64px;
    }

</style>
