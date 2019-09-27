<template lang="html">
    <div class="message">
        <div class="view">
            <c-header ref="transparentHeader" :style="`color: #000;`" class="header" :title="'消息'" :show="true">
                <span slot="left" class="posi-l">
                <c-icon type="back" @click.native="handleBack"/>
            </span>
            </c-header>
            <mt-navbar v-model="selected" class='fixed-nav '  v-if="fixedNav">
                <mt-tab-item id="1" v-sinaAds="adsInfo.message.index.clickSysMsg" @click.native="redMovea()">
                    我的消息 <span v-if="dotTaba"><span v-if="redDota=='2001004001'" class="ready-icon"></span></span>
                </mt-tab-item>
                <mt-tab-item id="2" v-sinaAds="adsInfo.message.index.clickActMsg" @click.native="redMoveb()">
                    系统公告 <span v-if="dotTabb"> <span v-if="redDotb=='2001004002'" class="ready-icon"></span></span>
                </mt-tab-item>
            </mt-navbar>
            <!-- tab-container -->
            <mt-tab-container v-model="selected" :swipeable="true" class="c-view-block">
                <mt-tab-container-item id="1">
                    <div class="c-view-content" :class="list1.length?'gray':''">
                        <!--bottom-method 设置为undefine 是为了去掉加载成时下方的下拉刷新的文案 因为加载完成时是不允许在刷新了的-->
                        <mt-loadmore :auto-fill="false" :bottom-method="!allLoadeda?loadBottoma:undefined"
                                     @bottom-status-change="handleBottomChange"
                                     :bottom-all-loaded="allLoadeda" :bottomPullText='bottomText' ref="loadmorea">
                            <div class="message-list" ref="wrapper">
                                <div class="message-item" v-for="item in list1"
                                     v-sinaAds="adsInfo.message.index.clickSysMsgList"
                                     @click="goDetail(item, 'messageItemOne')" :id="'messageItemOne' + item.id">
                                    <div class="card">
                                        <div class="top">
                                            <div class="left"><i><em v-if="!item.readflag"></em></i><span>{{item.msgtitle}}</span>
                                            </div>
                                            <div class="right">{{item.createtime.substring(0,10)}}</div>
                                        </div>
                                        <div class="cardContent">
                                            <span>{{item.msgsummary}}</span>
                                        </div>
                                    </div>
                                </div>

                                <!--暂无数据-->
                                <div class="no-data" v-if="list1NoData">
                                    <img src="../../assets/images/message.png"/>
                                    <p style="padding-left: 20px;">暂无消息！</p>
                                </div>
                                <div v-if="nomoreShowa" class="no-more">{{noMore}}</div>

                            </div>
                        </mt-loadmore>
                    </div>
                </mt-tab-container-item>
                <mt-tab-container-item id="2" >
                    <div class="c-view-content" :class="list2.length?'gray':''">
                        <mt-loadmore :auto-fill="false" :bottom-method="!allLoadedb?loadBottomb:undefined"
                                     @bottom-status-change="handleBottomChange"
                                     :bottom-all-loaded="allLoadedb" :bottomPullText='bottomText' ref="loadmoreb">
                            <div class="message-list" ref="wrapper">
                                <div class="message-item" v-for="item in list2"
                                     v-sinaAds="adsInfo.message.index.clickActMsgList"
                                     @click="goDetail(item, 'messageItemTwo')" :id="'messageItemTwo' + item.id">
                                    <div class="card">
                                        <div class="top">
                                            <div class="left"><i><em v-if="!item.readflag"></em></i><span>{{item.msgtitle}}</span>
                                            </div>
                                            <div class="right">{{item.createtime.substring(0,10)}}</div>
                                        </div>
                                        <div class="cardContent">
                                            <span>{{item.msgsummary}}</span>
                                        </div>
                                    </div>
                                </div>
                                <!--暂无数据-->
                                <div class="no-data" v-if="list2NoData">
                                    <img src="../../assets/images/message.png"/>
                                    <p style="padding-left: 20px;">暂无消息！</p>
                                </div>
                                <div v-if="nomoreShowb" class="no-more">{{noMore1}}</div>

                            </div>
                        </mt-loadmore>
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
	import {Indicator, Loadmore} from "mint-ui";

	export default {
		data() {
			return {
				fixedNav: false,
				nomoreShowa: false,
				nomoreShowb: false,
				noMore: "数据已加载完",
				noMore1: "数据已加载完",
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
			handleBack() {
				this.$AppBridge.activityView({
					type: "close"
				});
			},
			goDetail(item, type) {
				this.readyFlag(item).then(() => {
					setTimeout(() => {
						document.getElementById(type + item.id).classList.add("read");
					}, 500);
					/*
                            if(type == 2){
                                this.fetchData();
                            }*/
				});

				var item1 = JSON.stringify(item);
				if (item.openurl) {
					this.$root.openUrl(item.openurl);
				} else {
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
				console.log("item.id", item.id);
				console.log("this.productid", this.productid || "2001");
				console.log("this.token", this.token);
				return new Promise((resolve, reject) => {
					api.user.message
						.ready({
							messageId: item.id, //站内信id
							productId: this.productid || "2001",
							token: this.token
						})
						.then(res => {
							if (!helper.isSuccess(res)) return;
							console.log("已经阅读 index" + item.id);
							resolve();
						});
				});
			},
			fetchData() {
				this.token = this.$route.query.token;

				api.user.message
					.lists({
						msgType: 1, //活动消息
						pageNum: this.pageNob,
						pageSize: this.pageSize,
						productId: this.productid || "2001",
						token: this.token
					})
					.then(res => {
						if (!helper.isSuccess(res)) return;
						console.log("this.pageNob", this.pageNob);
						console.log("fetchData this.list2", res.data.pageData);
						this.list2 = res.data.pageData;
						if (res.data.pageData) {
							this.fixedNav = true;
						}
						if( res.data.totalSize >= this.list2.length){ // 请求的数据大于总数  已加载完成
							this.allLoadedb = true;
							this.nomoreShowb = true;
							this.noMore1 = ''
						}

						this.$root.loadingClose();
					});

				api.user.message
					.lists({
						msgType: 0, //系统消息
						pageNum: this.pageNoa,
						pageSize: this.pageSize,
						productId: this.productId || "2001",
						token: this.token
					})
					.then(res => {
						if (!helper.isSuccess(res)) return;
						console.log("this.pageNoa", this.pageNoa);
						console.log("fetchData this.list1", res.data.pageData);
						this.list1 = res.data.pageData;
						if (res.data.pageData) {
							this.fixedNav = true;
						}
						if( res.data.totalSize >= this.list2.length){ // 请求的数据大于总数  已加载完成
							this.allLoadeda = true;
							this.nomoreShowa = true;
							this.noMore = ''
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
						if (mtype == 0) {
							console.log("0页面已读");
						} else {
							console.log("1页面已读");
						}
					});
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
									this.noMore = ''
								}
							} else {
								console.log("数据没有总数多");
								this.allLoadeda = true;
								this.nomoreShowa = true;


								this.noMore = (!this.list1.length) ? '' : '数据已加载完'
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
									console.log("活动消息", this.list2);
								} else {
									this.allLoadedb = true;
									this.nomoreShowb = true;
									this.noMore1 = ''
								}
							} else {
								this.allLoadedb = true;
								this.nomoreShowb = true;
								this.noMore1 = (!this.list2.length) ? '' : '数据已加载完'
							}

							this.$refs.loadmoreb.onBottomLoaded();
						});
				}, 100);
			},
			setTitle() {
				this.$root.setWebAttribute({
					title: "消息"
				});
			}
		},
		watch: {
			deep: true,
			list1() {
				console.log("change list1");
				if (this.list1.length <= 0) {
					this.list1NoData = true;
				}
			},
			list2() {
				console.log("change list2");
				if (this.list2.length <= 0) {
					this.list2NoData = true;
				}
			}
		},
		created() {
			this.fetchData();
			this.fetchRedDot();
			this.setTitle();
			// 隐藏原生头部
			this.$root.setWebAttribute({isFull: true});
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
    .message {
        background: #fff;
        .view {
            height: 100%;
            overflow: auto !important;
            display: flex;
            flex-direction: column;
            .header {
                background: #fff;
                /deep/ .mint-header {
                    border: none;
                }
            }
            .mint-navbar {
                height: 60px;
                box-shadow: none;
                a {
                    color: #999;
                    padding: 0;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    &.is-selected{
                        color: #4E67FF;
                    }
                    &:after {
                        left: calc(50% - 11px);
                        bottom: 15%;
                        width: 22px;
                        height: 4px;
                        background: #4E67FF;
                        border-radius: 2px;
                    }
                    .ready-icon{
                        display: inline-block;
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        background: #E72427;
                        vertical-align: super;
                    }
                }
            }

            /deep/ .mint-tab-container {
                /*height: calc(100% - 104px);*/
            }
        }
        /deep/ .gray{
            background: #f7f7f7;
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
        }
    }

    .fixed-nav {
        width: 100%;
        height: 60px;
        overflow: hidden;
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
    /deep/ .mint-loadmore {
        overflow: unset;
        height: auto;
        min-height: 100% !important;
        position: relative;
        /deep/ .mint-loadmore-content {
            height: 100%;

        }
        /deep/ .mint-loadmore-bottom {
            margin-bottom: -13.333vw;
            bottom: 0;
            text-align: center;
            width: 100%;
        }
    }

    .message-list {
        height: 100%;
        padding: 16px;
        .message-item {
            margin-top: 16px;
            width: 100%;
            background: #fff;
            border-radius: 4px;
            &:first-child {
                margin-top: 0;
            }
            .card {
                background: white;
                box-shadow: 0 0 20px 0px rgba(0, 0, 0, 0.1);
                border-radius: 4px;
                padding-top: 20px;
                height: 122px;
                .top {
                    display: flex;
                    width: 100%;
                    justify-content: space-between;
                    align-items: center;
                    height: 22px;
                    .right {
                        font-size: 12px;
                        color: #999999;
                        width: 80px;
                        padding-right: 16px;
                    }
                    .left {
                        width: calc(100% - 100px);
                        overflow: hidden;
                        justify-content: left;
                        align-items: center;
                        display: flex;
                        i {
                            width: 16px;
                            display: flex !important;
                            justify-content: center;
                            align-items: center;
                            em {
                                width: 8px;
                                height: 8px;
                                background: #E72427;
                                border-radius: 50%;
                            }
                        }
                        span {
                            flex: 0.9;
                            font-size: 16px;
                            color: #333333;
                            text-wrap: normal;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }

                }
                .cardContent {
                    span {
                        margin-top: 14px;
                        font-size: 14px;
                        color: #666666;
                        padding: 0 16px;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                        overflow: hidden;
                    }
                }

            }
        }
        /deep/ .no-more {
            text-align: center;
            font-size: 12px;
            color: #666;
            line-height: 40px;
        }
    }

    .mint-navbar .mint-tab-item {
        color: #999;
    }

    .mint-navbar .mint-tab-item.is-selected {
        border-bottom: solid 0px #fff !important;
        font-size: 16px;
        color: #4E67FF;

        &:after {
            left: calc(50% - 11px);
            background: #4E67FF !important;
            border-radius: 2px;
            width: 22px;
            height: 4px;
        }
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
        font-size: 14px;
        color: #999999;
        text-align: center;
        margin-top: 40%;
        img {
            width: 120px;
            display: block;
            margin: auto;
        }
    }


</style>
