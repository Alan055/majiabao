<template lang="html">
	<div>
		<div class="view">
			<mt-navbar v-model="selected" class='fixed-nav' v-if="fixedNav" >
				<!-- <mt-tab-item id="1">系统消息<i class="red-dot"></i></mt-tab-item> -->

				<mt-tab-item id="2" v-sinaAds="adsInfo.message.index.clickActMsg" @click.native="redMoveb()">
					活动 <span v-if="dotTabb"> <span v-if="redDotb=='2001004002'" class="ready-icon"></span></span>
				</mt-tab-item>
				<mt-tab-item id="1" v-sinaAds="adsInfo.message.index.clickSysMsg" @click.native="redMovea()">
					通知 <span v-if="dotTaba"><span v-if="redDota=='2001004001'" class="ready-icon"></span></span>
				</mt-tab-item>
			</mt-navbar>
			<div class="top-height"></div>
			<!-- tab-container -->
			<mt-tab-container v-model="selected" :swipeable="true" class="c-view-block">

				<mt-tab-container-item id="2">
					<div class="c-view-content" v-min-height>
						<div class="message-list" ref="wrapper">

							<!--more-->
							<mt-loadmore :bottom-method="loadBottomb" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoadedb" :bottomPullText='bottomText' ref="loadmoreb">
								<!-- <div class="message-item" v-for="item in list2" :class="{'read': !!item.readflag}" v-sinaAds="adsInfo.message.index.clickActMsgList" @click="goDetail(item)"> -->
								<div :class="['message-item', (item.readflag && item.readflag == 1) ? 'read': '']" v-for="item in list2"  v-sinaAds="adsInfo.message.index.clickActMsgList" @click="goDetail(item, 'messageItemTwo')" :id="'messageItemTwo' + item.id">
									<!-- <p class="time">{{item.createtime | localTime}}</p> -->
									<div class="card">
										<p class="title">{{item.msgtitle}}</p>
										<p class="line"></p>
										<p class="img-wrap" v-if="item.msgimgurl">
											<img :src="item.msgimgurl" alt="">
										</p>
										<p class="desc">{{item.msgsummary}}</p>
										<p class="line"></p>
										<p class="bottom">
											<span>查看详情</span>
											<span class="c-fr">
                                            <c-icon type="arrowRight" />
                                            </span>
										</p>
									</div>
								</div>

							</mt-loadmore>
							<div v-if="nomoreShowb" class="no-more">{{noMore}}</div>

							<!--暂无数据-->
							<div class="no-data" v-if="list2NoData">
								<img src="../images/message-nodata2.png" />暂无消息记录
							</div>
						</div>
					</div>
				</mt-tab-container-item>
                <mt-tab-container-item id="1">
					<div class="c-view-content" v-min-height>
						<div class="message-list" ref="wrapper">

							<!--more-->
							<mt-loadmore :bottom-method="loadBottoma" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoadeda" :bottomPullText='bottomText' ref="loadmorea">
								<!-- <div class="message-item" v-for="item in list1" :class="{'read': !!item.readflag}" v-sinaAds="adsInfo.message.index.clickSysMsgList" @click="goDetail(item)"> -->
								<div :class="['message-item', (item.readflag && item.readflag == 1) ? 'read': '']" v-for="item in list1"  v-sinaAds="adsInfo.message.index.clickSysMsgList" @click="goDetail(item, 'messageItemOne')" :id="'messageItemOne' + item.id">
									<!-- <p class="time">{{item.createtime | localTime}}</p> -->
									<div class="card">
										<p class="title">{{item.msgtitle}}</p>
										<p class="line"></p>
										<p class="img-wrap" v-if="item.msgimgurl">
											<img :src="item.msgimgurl" alt="">
										</p>
										<p class="desc">{{item.msgsummary}}</p>
										<p class="line"></p>
										<p class="bottom">
											<span>查看详情</span>
											<span class="c-fr">
                                            <c-icon type="arrowRight" />
                                            </span>
										</p>
									</div>
								</div>
							</mt-loadmore>
							<div v-if="nomoreShowa" class="no-more">{{noMore}}</div>
							<!--暂无数据-->
							<div class="no-data" v-if="list1NoData">
								<img src="../images/message-nodata2.png" />暂无消息记录
							</div>
						</div>
					</div>
				</mt-tab-container-item>
			</mt-tab-container>
			<div class="more-height"></div>
		</div>
	</div>
</template>

<script>
import api from "@/services/api";
import helper from "@/utils/helper";
import { Indicator, Loadmore } from "mint-ui";
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
            wrapperHeight: 0
        };
    },
    onRefresh(tag, data) {
        if (tag == "message" || tag == "refresh") {
            //this.fetchData();
        }
    },
    methods: {
        goDetail(item, type) {
            this.readyFlag(item).then(() => {
                setTimeout(() => {
                    document.getElementById(type + item.id).classList.add("read");
                }, 500)
                /*
                if(type == 2){
                    this.fetchData();
                }*/
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
        fetchData() {
            this.token = this.$route.query.token;

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
                this.$root.loadingClose();
            });

            api.user.message
            .lists({
                msgType: 0, //系统消息
                pageNum: this.pageNoa,
                pageSize: this.pageSize,
                productId: this.productId || '2001',
                token: this.token
            })
            .then(res => {
                if (!helper.isSuccess(res)) return;
                console.log('this.pageNoa', this.pageNoa)
                console.log('fetchData this.list1', res.data.pageData)
                this.list1 = res.data.pageData;
                if(res.data.pageData){
                    this.fixedNav = true
                }
                this.$root.loadingClose();
            });
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
                    //最新一条消息类型tab默认
                    api.user.message
                        .msgType({
                            productId: this.productId,
                            token: this.token
                        })
                        .then(res => {
                            if (!helper.isSuccess(res)) return;
                                this.messageType = res.data.messageType;
                            if (res.data.messageType == 0) {
                                this.selected = "1";
                                this.redMovea();
                                //this.readyFunction(0);
                                console.log(this.redIa + "系统消息去红点");
                            } else if (res.data.messageType == 1) {
                                this.selected = "2";
                                this.redMoveb();
                                //this.readyFunction(1);

                                console.log(this.redIdb + "活动消息去红点");
                            } else {

                            }
                        });
                    });
        },
        readyFunction(mtype) {
            return;
            //已读页面
            api.user.message
                .readyPage({
                    productId: this.productId,
                    token: this.token,
                    msgType: mtype
                })
                .then(res => {
                    if(mtype == 0){
                        console.log("0页面已读");
                    }else{
                        console.log("1页面已读");
                    }
                })
        },
        redMovea() {
            return;
            //红点消除a
            console.log("aa");

            this.dotTaba = false;
            if (this.redIda) {
                api.user.message
                .redMove({
                    productId: this.productId,
                    token: this.token,
                    redType: this.redTypea,
                    id: this.redIda
                })
                .then(res => {
                    if (!helper.isSuccess(res)) return;
                    console.log("取消红点a");
                    //this.readyFunction(0);
                });
            }
        },
        redMoveb() {
            return;
            //红点消除
            this.dotTabb = false;
            if (this.redIdb) {
                api.user.message
                .redMove({
                    productId: this.productId,
                    token: this.token,
                    redType: this.redTypeb,
                    id: this.redIdb
                })
                .then(res => {
                    if (!helper.isSuccess(res)) return;
                    console.log("取消红点b");
                    //this.readyFunction(1);
                });
            }
        },
        //more
        handleBottomChange(status) {
            this.bottomStatus = status;
        },
        loadBottoma(type) {
            this.pageNoa = this.pageNoa + 1;

            setTimeout(() => {
                //系统消息数据
                api.user.message
                .lists({
                    msgType: 0, //系统消息
                    pageNum: this.pageNoa,
                    pageSize: this.pageSize,
                    productId: this.productId,
                    token: this.token
                })
                .then(res => {
                    if (!helper.isSuccess(res)) return;
                    if (res.data.totalSize > this.list1.length) {
                        this.fixedNav = true;
                        if (res.data.pageData) {
                            this.list1 = this.list1.concat(res.data.pageData);
                            console.log("系统消息", this.list1);
                        } else {
                            this.allLoadeda = true;
                            this.nomoreShowa = true;
                        }
                    }else {
                        console.log("数据没有总数多");
                        this.allLoadeda = true;
                        this.nomoreShowa = true;
                    }

                    this.$refs.loadmorea.onBottomLoaded();
                });
                //end
            }, 100);
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
        this.fetchRedDot();
        this.setTitle();
    },

    mounted() {
        this.token = this.$route.query.token;

        this.wrapperHeight =
        document.documentElement.clientHeight -
        this.$refs.wrapper.getBoundingClientRect().top;
    }
};
</script>

<style lang="scss" scoped>
.view {
  overflow: auto !important;
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

.red-dot {
  display: inline-block;
  @include circle(8px);
  background: $red;
  position: relative;
  top: -7px;
}

.message-list {
  padding: 10px 10px;

  /deep/ .read {
    color: #999;
  }
}

.message-item {
  /*margin-bottom: 12px;*/
  .time {
    text-align: center;
    font-size: 12px;
    color: #999999;
    padding: 8px;
  }
  .card {
    background: white;
    box-shadow: 0 0 20px 0px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 8px;
  }
  .title {
    font-size: $fontL;
    //padding: 0 9px;
    margin-bottom: 8px;
    position: relative;
  }
  .img-wrap {
    margin: 0 -8px;
    margin-bottom: 8px;
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
    font-family: PingFangSC-Medium;
    color: #333333;
    text-align: center;
}

.mint-navbar .mint-tab-item.is-selected:after {
    background: #26a2ff;
    left: 33.7%;
    right: 32.7%;
    height: 2px;
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
    width: 46%;
    display: block;
    margin: auto;
    margin-bottom: 10px;
  }
}

.no-more {
  text-align: center;
  font-size: 12px;
  color: #666;
  line-height: 40px;
}
</style>
<style lang="scss">
.message-item .card {
  margin: 6px 14px 12px 14px;
}
</style>
