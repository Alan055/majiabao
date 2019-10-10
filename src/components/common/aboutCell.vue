<template>
  <div class="aboutCell cell-list c-section">
    <mt-cell title="官网" v-if="website" is-link @click.native="$root.openUrl({url:website})"></mt-cell>
    <mt-cell title="版本号" v-if="showVersion">V{{$root.appVersion()}}</mt-cell>
    <mt-cell title="微信服务号" v-if="wechat" is-link @click.native="jumpWechat()"></mt-cell>
    <mt-cell title="新浪微博" v-if="sina" is-link @click.native="jumpSina()"></mt-cell>
    <mt-cell title="用户协议" v-if="userProtocol" is-link @click.native="$root.openUrl({url:userProtocol})"></mt-cell>
    <!--这个有的包显示 有的包不显示  手动设置-->
    <mt-cell
      title="H5调试入口"
      v-if="isShowClipboard"
      is-link
      @click.native="$root.openUrl({url:clipboardData})"
    ></mt-cell>
  </div>
</template>

<script>
	export default {
		// 官网对象  是否展示隐私协议
		props: ["showVersion"],
		data() {
			return {
				website: "",
				wechat: "",
				sina: "",
				userProtocol: "", // 用户协议
				isShowClipboard: process.env.NODE_ENV != "production",
				clipboardData: "http://static.sinawallent.com/pages/test/#/testLocalH5"
			};
		},
		computed: {},
		watch: {},
		methods: {
			// 拿到隐私协议的连接
			getPrivacyUrl() {
				this.$AppBridge.getInitData(res => {
					if (res) {
						if (res.data.pageaddress) {
							let obj = res.data.pageaddress.find(item => item.type == "XM_HOME");
							obj && (this.website = obj.url);
							obj = res.data.pageaddress.find(item => item.type == "XM_WECHAT");
							obj && (this.wechat = obj.url);
							obj = res.data.pageaddress.find(item => item.type == "XM_WEIBO");
							obj && (this.sina = obj.url);
							obj = res.data.pageaddress.find(item => item.type == "USER_AGREEMENTS");
							obj && (this.userProtocol = obj.url);
						}
					}
				});
			},
			// 跳转到隐私协议
			jumpPrivacyUrl(url) {
				url && this.$root.openUrl({url: url, title: this.appName});
			},
			// 唤醒app -wechat
			jumpWechat() {
				// 复制
				this.$AppBridge.setClipboardData({
					data: this.website // 复制微信公众号
				});
				this.$AppBridge.dialogView(
					{
						title: "微信号已复制到剪切板",
						msg: "您可以到微信关注我们,是否打开微信",
						leftBtn: "取消",
						rightBtn: "立即前往微信"
					},
					action => {
						// 打开app
						if (action.data.btnType == "rightBtn") {
							this.$AppBridge.launchApp(
								{
									scheme: "weixin://open",
									pkgName: "com.tencent.mm"
									//scheme: 'weixin://open&pkgName=com.tencent.mm'
								},
								res => {
									if (res && res.data.status != "true") {
										Toast("请安装微信后重新尝试");
									}
								}
							);
						}
					}
				);
			},
			// 唤醒sina
			jumpSina() {
				// 先打开内链的h5
				this.$AppBridge.activityView({
					type: "open",
					url: this.sina,
					isFull: false,
					open_inner: true
				});
			},
			init() {
				this.getPrivacyUrl(); // 拿到隐私协议的连接
			}
		},
		created() {
			this.init();
		}
	};
</script>

<style lang='scss' scoped>
  .aboutCell {
  }
</style>
