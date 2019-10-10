<template lang="html">
	<div>
		<div class="view" :class="selected==1?(list1NoData?'white':''):(list2NoData?'white':'')">
      <div class="view_head">
        <mt-navbar v-model="selected" class='fixed-nav' v-if="fixedNav" >
          <mt-tab-item id="2" v-sinaAds="adsInfo.message.index.clickActMsg" @click.native="redMoveb()">
            系统公告 <span v-if="dotTabb"> <span v-if="redDotb=='2001004002'" class="ready-icon"></span></span>
          </mt-tab-item>
          <mt-tab-item id="1" v-sinaAds="adsInfo.message.index.clickSysMsg" @click.native="redMovea()">
            我的消息 <span v-if="dotTaba"><span v-if="redDota=='2001004001'" class="ready-icon"></span></span>
          </mt-tab-item>

        </mt-navbar>
      </div>

			<div class="top-height"></div>
			<!-- tab-container -->
			<mt-tab-container v-model="selected" :swipeable="true" class="c-view-block">
				<mt-tab-container-item id="1">
					<div class="c-view-content">
						<div class="message-list" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
              <mt-loadmore :bottom-method="loadBottoma" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoadeda" :bottomPullText='bottomText' ref="loadmorea">
                  <!-- <div class="message-item" v-for="item in list1" :class="{'read': !!item.readflag}" v-sinaAds="adsInfo.message.index.clickSysMsgList" @click="goDetail(item)"> -->
                  <div :class="['message-item', (item.readflag && item.readflag == 1) ? 'read': '']" v-for="item in list1"  v-sinaAds="adsInfo.message.index.clickSysMsgList" @click="goDetail(item, 'messageItemOne')" :id="'messageItemOne' + item.id">
                      <p class="time">{{item.createtime | localTime}}</p>
                      <div class="card">
                          <p class="title">{{item.msgtitle}}</p>
                          <p class="img-wrap" v-if="item.msgimgurl">
                              <img :src="item.msgimgurl" alt="">
                          </p>
                          <p class="desc">{{item.msgsummary}}</p>
                          <p class="bottom">
                            <span>{{item.updatetime}}</span>
                            <span class="detail">查看详情</span>
                          </p>
                      </div>
                  </div>
              </mt-loadmore>

							<!--<div v-if="nomoreShowa" class="no-more">{{noMore}}</div>-->
							<!--暂无数据-->
							<!--<div class="no-data" v-if="list1NoData">-->
								<!--<img src="../../assets/images/message.png" />暂无消息记录-->
							<!--</div>-->
              <no-data :imgUrl="require('../../assets/images/message.png')" text="暂无消息记录" v-if="list1NoData"></no-data>
						</div>
					</div>
				</mt-tab-container-item>
				<mt-tab-container-item id="2">
					<div class="c-view-content">
						<div class="message-list" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">

							<!--more-->
							<mt-loadmore :bottom-method="loadBottomb" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoadedb" :bottomPullText='bottomText' ref="loadmoreb">
								<!-- <div class="message-item" v-for="item in list2" :class="{'read': !!item.readflag}" v-sinaAds="adsInfo.message.index.clickActMsgList" @click="goDetail(item)"> -->
								<div :class="['message-item', (item.readflag && item.readflag == 1) ? 'read': '']" v-for="item in list2"  v-sinaAds="adsInfo.message.index.clickActMsgList" @click="goDetail(item, 'messageItemTwo')" :id="'messageItemTwo' + item.id">
									<p class="time">{{filterTime(item.createtime || localTime)}}</p>
									<div class="card">
										<p class="title">{{item.msgtitle}}</p>
										<p class="img-wrap" v-if="item.msgimgurl">
											<img :src="item.msgimgurl" alt="">
										</p>
										<p class="desc">{{item.msgsummary}}</p>
										<p class="bottom">
                      <span>{{item.updatetime}}</span>
											<span class="detail">查看详情</span>
										</p>
									</div>
								</div>

							</mt-loadmore>
							<!--<div v-if="nomoreShowb" class="no-more">{{noMore}}</div>-->

							<!--暂无数据-->
							<!--<div class="no-data" v-if="list2NoData">-->
								<!--<img src="" />暂无消息记录-->
							<!--</div>-->
              <no-data :imgUrl="require('../../assets/images/message.png')" text="暂无消息记录" v-if="list2NoData"></no-data>

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
import noData from "@/components/common/noData";


export default {
  components: {noData},
  data() {
    return {
      fixedNav: false,
      nomoreShowa: false,
      nomoreShowb: false,
      noMore: "数据已加载完",
      pageSize: 10,
      selected: "2",
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
    filterTime(v){
      return  moment(v).format('MM-DD HH:mm')
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
              if (res.data.messageType == 1) {
                this.redMoveb();
                //this.readyFunction(1);

                console.log(this.redIdb + "活动消息去红点");
              } else if (res.data.messageType == 0) {
                this.redMovea();
                //this.readyFunction(0);
                console.log(this.redIa + "系统消息去红点");
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
                this.noMore = "";
              }
            } else {
              console.log("数据没有总数多");
              this.allLoadeda = true;
              this.nomoreShowa = true;

              this.noMore = !this.list1.length ? "" : "数据已加载完";
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
                this.noMore = "";
              }
            } else {
              this.allLoadedb = true;
              this.nomoreShowb = true;
              this.noMore = !this.list2.length ? "" : "数据已加载完";
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
  background: #f7f7f7;
  &.white{
    background: #fff;
  }
  .view_head{
    height: 50px;
    background: #fff;
  }
}

.fixed-nav {
  width: 90%;
  position: fixed;
  top: 0;
  left: 5%;
}

.top-height {
  display: none;
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

  /deep/ .read {
    color: #999;
  }
}

.message-item {
  /*margin-bottom: 12px;*/
  .time {
    font-size: 12px;
    color: #999999;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .card {
    background: white;
    box-shadow: 0 0 20px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 18px;
    padding-bottom: 0px;
    .detail{
      color: #659FFC;
    }
  }
  .title {
    font-size: $fontXL;
    margin: 0 0 8px;
    position: relative;
    height: 25px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    color: #333;
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
    box-sizing: padding-box;
    line-height: 1.4;
    height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    font-size: $fontM;
    color: #666;
    height: 40px;
  }

  .line {
    margin: 8px 0;
    @extend %border-b;
  }
  .bottom {
    margin-top: 8px;
    border-top: 1px solid #e6e6e6;
    font-size: $fontS;
    height: 38px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.mint-navbar {
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #333333;
  height: 32px;
  margin: 8px 0;
  .mint-tab-item {
    padding: 6px 0;
    margin: 0;
    &.is-selected {
      background: #333333;
      color: #fddcc3;

      &:after {
        height: 0;
      }
    }
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
  color: #666;
  font-size: 14px;
  text-align: center;
  margin-top: 40%;
  img {
    width: 230px;
    display: block;
    margin: auto;
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
  margin: 0 16px;
}
</style>
