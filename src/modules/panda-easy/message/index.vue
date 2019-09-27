<template lang="html">
    <div class="view">
        <div class="c-view-content">
            <div class="message-list" ref="wrapper">
                <div class="system-message" @click="goSystem">
                    <span>系统消息</span>
                    <span class="c-fr">
                        <span class="message-red" v-if="systemMessageCount > 0">{{systemMessageCount}}</span>
                        <c-icon type="arrowRight" />
                    </span>
                </div>
                <mt-loadmore :bottom-method="loadBottomb" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoadedb" :bottomPullText='bottomText' ref="loadmoreb">
                    <div :class="['message-item']" v-for="item in list2"  v-sinaAds="adsInfo.message.index.clickActMsgList" @click="goDetail(item, 'messageItemTwo')" :id="'messageItemTwo' + item.id">
                        <div class="card">
                            <p class="title">
                            <span v-if="item.readflag != 1" class="red-dot"></span>
                            {{item.msgtitle}}</p>
                            <p class="time">{{item.createtime | localTime}}</p>
                            <p class="content">{{item.msgcontent}}</p>
                            <p class="img-wrap" v-if="item.msgimgurl">
                                <img :src="item.msgimgurl" alt="">
                            </p>
                        </div>
                    </div>

                </mt-loadmore>
                <div v-if="nomoreShowb && !list2NoData" class="no-more">{{noMore}}</div>

                <!--暂无活动消息-->
                <div class="no-data" v-if="list2NoData">
                    <img src="../images/message-nodata.png" />暂无活动消息
                </div>
            </div>
        </div>
        <div class="more-height"></div>
    </div>
</template>

<script>
import api from "@/services/api";
import helper from "@/utils/helper";
import { Loadmore } from "mint-ui";
import { Toast, Indicator } from "@/utils/helper";
import AppBridge from "@/services/AppBridge.js";
export default {
    data() {
        return {
            fixedNav:false,
            nomoreShowa: false,
            nomoreShowb: false,
            noMore: "数据已加载完",
            pageSize: 10,
            selected: "1",
            list1: [],
            list1NoData: false,
            list2: [],
            list2NoData: false,
            productId: 2001,
            token: "",
            redDota: "",
            redDotb: "",
            redTypea: "",
            redIda: "",
            redTypeb: "",
            redIdb: "",
            messageType: "",
            dotTaba: true,
            dotTabb: true,
            pageNoa: 0, //more
            pageNob: 0,
            bottomText: "上拉加载更多...",
            allLoadeda: false,
            allLoadedb: false,
            bottomStatus: "",
            wrapperHeight: 0,
            systemMessageCount: 0
        };
    },
    onRefresh(tag, data) {
        if (tag == "message" || tag == "refresh") {
            this.fetchSysData();
        }
    },
    methods: {
        goSystem() {
            this.$router.replace({
                name: "system"
            });
        },
        goDetail(item, type) {
            this.readyFlag(item).then(() => {
                setTimeout(() => {
                    item.readflag = 1;
                    //document.getElementById(type + item.id).classList.add("read");
                }, 500)
            });

            var item1 = JSON.stringify(item);
            if (item.openurl) {
                this.$root.openUrl(item.openurl);
            }
            else {
                this.$router.replace({
                    name: "messageDetail",
                    query: {
                        item: item1,
                        productid: this.productId
                        // token: this.token //本地调试需显示，上线app环境需隐藏
                    }
                });
            }
        },
        readyFlag(item) {
            console.log('item.id', item.id)
            console.log('this.productid', this.productid || '2001')
            console.log('this.token', this.token)
            return new Promise((resolve, reject) => {
                api.user.message.ready({
                    messageId: item.id, //站内信id
                    productId: this.productid || '2001',
                    token: this.token
                }).then(res => {
                    if(!helper.isSuccess(res)) return
                    console.log('已经阅读 index' + item.id)
                    resolve();

                })
            })
        },
        fetchSysData() {
            this.token = this.$route.query.token;

            return new Promise((resolve, reject) => {
                api.user.message
                .lists({
                    msgType: 0, //系统消息
                    pageNum: this.pageNoa,
                    pageSize: 1000000,
                    productId: this.productId || '2001',
                    token: this.token
                })
                .then(res => {
                    if (!helper.isSuccess(res)) return;
                    if(res.data.pageData){
                        console.log('systemMessageCount', this.systemMessageCount)
                        let data = res.data.pageData.filter((item) => {
                            return item.readflag != 1;
                        })
                        this.systemMessageCount = data.length;
                    }

                    resolve(res)

                });
            })
        },
        fetchActData() {
            api.user.message
            .lists({
                msgType: 1, //活动消息
                pageNum: this.pageNob,
                pageSize: this.pageSize,
                productId: this.productid || '2001',
                token: this.token
            })
            .then(res => {
                if (!helper.isSuccess(res)) return;
                console.log('this.pageNob', this.pageNob)
                console.log('fetchData this.list2', res.data.pageData)
                this.list2 = res.data.pageData;
                if(res.data.pageData){
                    this.fixedNav = true
                }
            });
        },
        fetchData() {
            console.log('fetchData')

            this.fetchSysData();
            this.fetchActData();
        },
        fetchRedDot() {
            //红点查询
            api.user.message
                .redDot({
                    pageCode: 2001004, //活动消息
                    productId: this.productId,
                    token: this.token
                })
                .then(res => {
                    if (!helper.isSuccess(res)) return;
                    console.log("开始红点查询");
                    if (res.data[0]) {
                        if (res.data[0].positioncode == "2001004001") {
                            this.redTypea = res.data[0].redtype;
                            this.redIda = res.data[0].id;
                            this.redDota = res.data[0].positioncode;
                        } else if (res.data[0].positioncode == "2001004002") {
                            this.redTypeb = res.data[0].redtype;
                            this.redIdb = res.data[0].id;
                            this.redDotb = res.data[0].positioncode;
                        } else {
                        }
                    }
                    if (res.data[1]) {
                        if (res.data[1].positioncode == "2001004001") {
                            this.redTypea = res.data[1].redtype;
                            this.redIda = res.data[1].id;
                            this.redDota = res.data[1].positioncode;
                        } else if (res.data[1].positioncode == "2001004002") {
                            this.redTypeb = res.data[1].redtype;
                            this.redIdb = res.data[1].id;
                            this.redDotb = res.data[1].positioncode;
                            } else {
                        }
                    }
                })
        },
        handleBottomChange(status) {
            this.bottomStatus = status;
        },
        loadBottomb() {
            this.pageNob = this.pageNob + 1;
            setTimeout(() => {
                //活动消息数据
                api.user.message
                .lists({
                    msgType: 1, //活动消息
                    pageNum: this.pageNob,
                    pageSize: this.pageSize,
                    productId: this.productId,
                    token: this.token
                })
                .then(res => {
                    if (!helper.isSuccess(res)) return;
                    if (res.data.totalSize > this.list2.length) {
                        if (res.data.pageData) {
                            this.fixedNav = true;
                            this.list2 = this.list2.concat(res.data.pageData);
                            console.log('活动消息', this.list2)
                        } else {
                            this.allLoadedb = true;
                            this.nomoreShowb = true;
                        }
                    }else {
                        this.allLoadedb = true;
                        this.nomoreShowb = true;
                    }

                    this.$refs.loadmoreb.onBottomLoaded();
                });
            }, 100);
        },
        setTitle() {
            this.$root.setWebAttribute({
                title: "消息中心"
            });
        },
        setTitleAttr() {
            AppBridge.setWebTitleAttribute({
                btnType: 'text',
                btnVal: '一键已读'
            }, () => {
                this.handleReadClick();
            })
        },
        handleReadClick() {

            Indicator.open();
            api.user.message
                .readyPage({
                    productId: this.productId,
                    token: this.token,
                    msgType: 0
                })
                .then(res => {
                    console.log('msgType', 0)

                    this.fetchSysData().then(() => {
                        Indicator.close();
                    });
                })
        }
    },
    watch: {
        deep: true,
        list1() {
            console.log('change list1')
            if(this.list1.length <= 0){
                this.list1NoData = true
            }
        },
        list2() {
            console.log('change list2')
            if(this.list2.length <= 0){
                this.list2NoData = true
            }
        }
    },
    created () {
        this.fetchData();
        //this.fetchRedDot();
        this.setTitle();
        this.setTitleAttr();
    },

    mounted() {
        this.token = this.$route.query.token;

        setTimeout(() => {
            this.$root.loadingClose();

        }, 2000)
    }
};
</script>

<style lang="scss" scoped>
.view {
  overflow: auto !important;
  background-color: #f4f4f4;
}

.fixed-nav {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
}

.top-height {
  height: 43px;
}

.c-view-content {
  height: 100%;
}



.message-list {
  padding: 10px 10px;
}
.message-item {
  margin-top: 16px;
  .red-dot {
    display: inline-block;
    @include circle(6px);
    background: $red;
    position: relative;
    top: -3px;
  }
  .time {
    text-align: left;
    font-size: 12px;
    color: #999999;
    margin: 2px 0;
  }
  .card {
    padding: 10px 20px;
    background: white;
    box-shadow: 0 0 20px 0px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
  .content {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #666666;
    letter-spacing: -0.26px;
    text-align: justify;
    margin-bottom: 16px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .title {
    position: relative;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    font-size: 16px;
    color: #2D2F44;
  }
  .img-wrap {
    img {
      display: block;
      width: 100%;
      height: 150px;
    }
  }
  .desc {
    line-height: 1.4;
    max-height: 2.8em;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .line {
    margin: 8px 0;
    @extend %border-b;
  }
  .bottom {
    font-size: $fontS;
  }
}

.mint-navbar .mint-tab-item.is-selected {
  border-bottom: solid 0px #fff !important;
}

.ready-icon {
  position: absolute;
  right: 50px;
  top: 13px;
  display: block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #ff0000;
}

.no-data {
  color: #666;
  font-size: 14px;
  text-align: center;
  margin-top: 40%;
  img {
    width: 100px;
    display: block;
    margin: auto;
  }
}
.system-message {
    font-size: 16px;
    color: #171517;
    background: #FFFEFF;
    border-radius: 8px;
    height: 48px;
    line-height: 48px;
    margin-bottom: 16px;
    padding: 0 16px;

    .message-red {
        background: #E72427;
        height: 15px;
        width: 15px;
        color: white;
        border-radius: 50%;
        font-size: 12px;
        padding: 1px 6px;
    }
}
.no-more {
  text-align: center;
  font-size: 12px;
  color: #666;
  line-height: 40px;

}
</style>
