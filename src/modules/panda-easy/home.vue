<template lang="html">
<div class="view-home">

  <div class="header-wrap">
    <c-header class="header transparent" :style="`background: rgba(81, 67, 83, ${headerRgba}); opacity: ${headerOpacity}`" :title="appName">
      <span slot="left" @click="$root.openUrl(helpUrl)">
        <mt-button><img class="c-icon icon-logo" src="~@/assets/images/home/aa_ap@2x.png" /></mt-button>
      </span>
      <span slot="right" @click="$root.openUrl(messageUrl)">
        <mt-button><img class="c-icon icon_a" src="~@/assets/images/my/home/an_ao@2x.png" /></mt-button>
      </span>
    </c-header>
  </div>

  <scroller
        :on-refresh="refresh"
        :offset="120"
        :bounce="90"
        :maxScrollerHeight="140"
        :frequency="1000"
        :power="1.5"
        @refreshFinsh="refreshFinsh"
        @onScroll="onScroll"
        @onPulling="onPulling"
    >
    <div class="c-view-content">
        <c-header :transparent="true" :show="true" title=""></c-header>
        <div class="card-wrap">
            <div class="card">
                <p class="notice"><img class="c-icon icon-notice" src="~@/assets/images/home/cb_ct@2x.png" />用户张*成功借钱11000元</p>
                <p class="p1">最高可借额度(元)</p>
                <p class="p2">500000</p>
                <p class="p3"></p>
            </div>
        </div>

        <div class="form-wrap">
            <div class="input-wrap" v-if="!$root.isLogin">
                <input type="tel" v-model="mobile" maxlength="11">
                <img class="c-icon icon-mobile" src="~@/assets/images/home/ca_cj@2x.png" />
            </div>

            <div class="arc-layer">
                <div class="arc-wrap">
                <div class="arc"></div>
                </div>
            </div>
            <div class="button-wrap">
                <mt-button size="large" type="danger" @click.native="clickApplyBtn">立即借钱</mt-button>
                <p class="p1">点击立即借钱即同意<a  class="c-blue">{{'《' + appName}}用户注册协议》</a></p>
            </div>
            </div>

            <div class="icon-wrap">
                <dl class="c-flex-row">
                    <dd>
                    <img src="~@/assets/images/home/ca_er@2x.png" alt="">
                    <p>薅羊毛</p>
                    </dd>
                    <dd>
                    <img src="~@/assets/images/home/cc_er@2x.png" alt="">
                    <p>办信用卡</p>
                    </dd>
                    <dd>
                    <img src="~@/assets/images/home/cb_er@2x.png" alt="">
                    <p>邀请返现</p>
                    </dd>
                </dl>
            </div>

            <div class="banner-wrap" v-if="ads.length">
            <mt-swipe :auto="5000">
                <mt-swipe-item v-for="item in ads" :key="item.adverturl"  @click.native="clickAd(item)"><img :src="item.adverturl" /></mt-swipe-item>
            </mt-swipe>
            </div>

            <credit-card more="更多服务" :iframeUrl="iframeUrl" />
        </div>
        </scroller>
    </div>
</template>

<script>
import api from "@/services/api";
import util from "@/utils";
import storage from "@/utils/storage";
import helper from "@/utils/helper";
import { Toast, Indicator } from "@/utils/helper";
import { mapGetters, mapMutations } from "vuex";
import creditCard from "@/components/view/cMarket";
import appBridge from "@/services/AppBridge";

import scroller from "@/components/view/scroller";
import EventBus from "@/services/EventBus.js";

export default {
	name: "home",
	data() {
		return {
			data: {},
			ads: [],
			messageUrl: process.env.path + "/pages/my/index.html#/message", //消息中心
			helpUrl: process.env.path + "/pages/my/index.html#/help", //帮助中心
            headerOpacity: 1,
            headerRgba: 0,
            mobile: "",
			iframeUrl: ""
		};
	},
	computed: {
		...mapGetters([])
	},
	methods: {
		...mapMutations([]),
        //刷新
        async refresh(cb) {
            await this.fetchHomeData();
            console.log('数据刷新成功');
            setTimeout(() => {
                this.headerOpacity = 1;
                cb && cb()
            }, 1000)
        },
        //top 距离顶部的像素点
        onPulling(top) {
            console.log('距离顶部的像素点', top);
            if(top && top > 0){
                this.headerOpacity = 1 - top/50;
            }
        },
        //滚动中
        onScroll(e) {
            let scrollTop = e.target.scrollTop;
            console.log('scrollTop', scrollTop);
            this.floatimgRightPx = scrollTop + 300 + "px";
            if (scrollTop <= 100) {
                this.headerRgba = scrollTop / 100;
                //this.activeHeight = "40vh";
            } else {
                this.headerRgba = 1;
                this.headerOpacity = 1; //解决正在刷新时又上滑透明度不还原问题
                //this.activeHeight = "44px";
            }
        },
        refreshFinsh() {
            setTimeout(() => {
                this.headerOpacity = 1;
            }, 500)
        },

		// 立即借钱
		clickApplyBtn() {
			if (!this.$root.isLogin) {
				this.login();
				return;
			}

			if (this.data.nextpage) {
				this.$root.openUrl(this.data.nextpage, this.data);
			} else {
				this.fetchHomeData();
			}
		},

		// 点击广告
		clickAd(item) {
			console.log("click", JSON.stringify(item));
			if (item.openmode == 1 || item.openmode == 2) {
				this.$root.openUrl(item.opencontent);
			}
		},

		// 获取首页信息
		fetchHomeData() {
			Indicator.open();
			api.home
				.getHomePage()
				.then(res => {
					if (helper.isSuccess(res)) {
						let { userstatus } = res.data;
						if ([6, 10].indexOf(userstatus) > -1) {
							this.$root.replaceRoute({
								name: "recommend",
								params: res.data
							});
							this.$root.loadingClose();
						} else {
							// Todo
							// this.$root.replaceUrl(res.data.nextpage, res.data)
							this.$root.openUrl(res.data.nextpage, res.data);
						}
					}
				})
				.finally(Indicator.close);
		},

		// 登录
		login() {
			if (!this.mobile) {
				Toast("请输入手机号码");
				return;
			}
			if (!/1\d{10}/.test(this.mobile)) {
				Toast("请输入正确的手机号码");
				return;
			}
			// verify code
			this.sendSms();
		},

		// 验证短信
		sendSms() {
			Indicator.open();
			return api
				.loginCode({
					phone: this.mobile,
					type: 2 //快捷登录
				})
				.then(res => {
					if (helper.isSuccess(res)) {
						this.callCodeDialog();
					}
				})
				.finally(Indicator.close);
		},

		// 唤起APP验证码输入窗口
		callCodeDialog() {
			appBridge.showSmsView(
				{
					mobile: this.mobile,
					type: 2 //快捷登录
				},
				res => {
					this.loginRequest(res.data.smsCode);
				}
			);
		},

		// 登录请求
		loginRequest(code) {
			Indicator.open("正在登录");
			return api
				.login({
					username: this.mobile,
					code,
					devicefingeid: util.getParams("deviceId")
				})
				.then(res => {
					if (helper.isSuccess(res)) {
						// Todo: 登录成功

						this.fetchHomeData();
					}
				})
				.finally(Indicator.close);
		},
		getmarketinfo() {
			api.activity
				.getAppMarketInfo({
					pageid: "1001",
					token: util.getParams("token") || storage.get("token") || ""
				})
				.then(res => {
					if (res.code == 200) {
						this.iframeUrl = res.data.jumplink;
					}
				});
		},
		initRefreshData() {
			// 监听刷新事件
			EventBus.$on("refreshData", (res, route) => {
				if (res && res.data && res.data.tag == "home") {
					// 事件来自登录状态改变
					this.fetchHomeData();
				}
			});
		}
	},
	components: {
        creditCard,
        scroller
	},
	watch: {},
	created() {
		this.data = this.$route.params;
		this.ads = this.data.advert ? this.data.advert.hometoped : [];
		this.getmarketinfo();
		//提供刷新
		this.initRefreshData();
	},
	mounted() {
		// DOM ready
		this.$root.loadingClose();
	}
};
</script>

<style lang="scss" scoped>
.view-home {
    background-image: linear-gradient(90deg, #2f2a32 0%, #514353 100%);

    /deep/ .pull-refresh {
        background-color: transparent !important;
        height: 1rem !important;
        padding: 0 !important;
    }
}

.icon-logo {
	@include size(24px);
}
.card-wrap {
	background-image: linear-gradient(90deg, #2f2a32 0%, #514353 100%);
	padding-top: $gap;
}
.card {
	border-radius: 10px;
	background: white url("~@/assets/images/home/card_bg.png") 0 / 100%
		no-repeat;
	margin: 0 $gap;
	// margin-top: $headerHeight;
	padding-bottom: 100px;
	text-align: center;
	overflow: hidden;

	.notice {
		color: $gray;
		font-size: $fontS;
		text-align: left;
		padding: 10px 18px;
		margin-bottom: 17px;
		.icon-notice {
			margin-right: 6px;
			@include size(16px);
		}
	}
	.p1 {
		color: $gray;
	}
	.p2 {
		font-size: 48px;
		line-height: 56px;
	}
	.p3 {
		color: $light;
		margin-bottom: 28px;
	}
}

.form-wrap {
	margin-top: -100px;

	// 弧形容器
	.arc-layer {
		height: 0;
		.arc-wrap {
			overflow: hidden;
			padding-top: 20px;
			.arc {
				background: white;
				height: 100px;
				border-top-right-radius: 50%;
				border-top-left-radius: 50%;
				width: 150%;
				margin-left: -25%;
				padding: 0 25%;
				box-shadow: 0 -2px 10px 0 rgba(0, 0, 0, 0.1);
			}
		}
	}

	.input-wrap {
		position: relative;
		margin: 0 32px;
		margin-bottom: 12px;
		input {
			display: block;
			width: 100%;
			height: 48px;
			font-size: $fontM;
			background: #ffffff;
			border: 1px solid #cccccc;
			border-radius: 100px;
			padding: 0 44px;

			&:focus {
				border-color: #659ffc;
			}
		}
		.icon-mobile {
			position: absolute;
			top: 16px;
			left: 24px;
			@include size(16px);
		}
	}

	.button-wrap {
		text-align: center;
		margin: 0 32px;

		.mint-button {
			font-size: $fontL;
			height: 48px;
			background-image: linear-gradient(90deg, #e72427 0%, #fe4c35 100%);
			box-shadow: 0 2px 10px 0 rgba(236, 44, 42, 0.3);
			border-radius: 100px;
		}
		.p1 {
			color: #9c9c9c;
			font-size: $fontS;
			margin-top: 18px;

			&::before,
			&::after {
				content: "";
				display: inline-block;
				vertical-align: middle;
				width: 3px;
				height: 3px;
				border-radius: 10px;
				background: #999;
				margin: 0 7px;
			}
		}
	}
}

.icon-wrap {
	background: white;
	padding-top: 22px;
	padding-bottom: 24px;
	@extend %border-b;

	img {
		@include size(40px);
		margin-bottom: 4px;
	}
}

.banner-wrap {
	background: white;
	height: 118px;
	border-bottom: 8px solid #f4f4f4;

	img {
		display: block;
		width: 100%;
		height: 100%;
	}
}
</style>
