<template>
  <div class="view c-view-gay">

  </div>
</template>

<script>
	import {Dialog} from 'vant';

	export default {
		data() {
			return {};
		},
		components: {},
		computed: {},
		methods: {
			// 获取弹框的内容数据
			findDialogContent() {
				// let url =  "hsinaif://activityView?title=隐私协议&isFull=false&isCloseCurrent=false&refresh=true&url=" + encodeURI(encodeURIComponent('https://protocol.sinawallent.com#scan?id=156645822549085443'))
        // console.log(url)
				this.$AppBridge.getInitData(res => {
					if (res && res.data.config) {
						Dialog.confirm({
							title: res.data.config.privacy_protocol_title,
							className: 'homeDialog',
							message: res.data.config.privacy_protocol_content,
							confirmButtonText: '同意',
							cancelButtonText: '暂不同意',
						}).then(() => {
							this.$AppBridge.agreeProtocol() // 同意时 app需要记录一些东西 需要触发伪协议
							this.$root.closeWindow() // 关闭当前页面
						}).catch(() => {
							// 不同意就退出app
							this.$AppBridge.exitApp()
						});
					}
					this.$root.loadingClose()
				});

				// Dialog.confirm({
				// 	title: '123456',
				// 	className: 'homeDialog',
				// 	message: '<style>.a{"font-size:12px;color:#333;"}</style><div class="a">感谢您信任并使用极速熊猫贷款APP!</div><div class="a">我们依据最新的法律要求更新了用户协议和隐私协议,特向您推送本提示。请您仔细阅读并充分理解相关条款。</div><div class="a">请注意您点击同意即标识您已阅读并同意我们的《隐私协议》。</div><br><div class="a">查看<a href="hsinaif://activityView?title=隐私协议&isFull=false&isCloseCurrent=false&refresh=true&url=https%253A%252F%252Fprotocol.sinawallent.com%2523scan%253Fid%253D156645822549085443" style="font-size:12px;color: #597BFF;">《隐私协议》</a>  </div>',
				// 	confirmButtonText: '同意',
				// 	cancelButtonText: '暂不同意',
				// }).then(() => {
				// 	this.$AppBridge.agreeProtocol() // 同意时 app需要记录一些东西 需要触发伪协议
				// 	this.$root.closeWindow() // 关闭当前页面
				// }).catch(() => {
				// 	// 不同意就退出app
				// 	this.$AppBridge.exitApp()
				// });

			},
			init() {
				this.$root.setWebAttribute({isFull: true,isTrans: true});// 隐藏原生的状态栏
				this.findDialogContent() // 获取弹框数据
			}
		},
		created() {
			this.init()
		},
		mounted() {
		},
		onRefresh(tag, data) {
			if (tag == "refresh") {
			}
		}
	};
</script>

<style lang="scss">
  body,.c-select,#app{
    background: rgba(255,255,255,0) !important;
    background-color: rgba(255,255,255,0) !important;
  }
  .van-overlay{
    background: rgba(0,0,0,0.50);
  }
  .homeDialog {
    width: 278px;
    min-height: 322px;
    border-radius: 12px;
    .van-dialog__header {
      padding-top: 36px;
      font-size: 18px;
      color: #333333;
    }
    .van-dialog__content {
      min-height: 177px;
      .van-dialog__message{
        white-space: normal;
        text-align: left;
      }
    }
    .van-dialog__footer {
      height: unset;
      overflow: unset;
      justify-content: center;
      margin-bottom: 40px;
      &::after, &::before {
        display: none;
      }
      .van-button {
        width: 105px !important;
        height: 44px;
        display: flex;
        justify-content: center !important;
        align-items: center ;
        flex: unset;
        line-height: unset;
        text-align: center;
        &.van-dialog__cancel {
          border: 1px solid #5882FF;
          border-radius: 100px;
          font-size: 16px;
          color: #5882FF;
          margin-right: 16px;
        }
        &.van-dialog__confirm {
          background-image: linear-gradient(-134deg, #6E89FF 0%, #5C77FA 100%);
          box-shadow: 0 2px 11px 0 rgba(95, 122, 251, 0.51);
          border-radius: 100px;
          font-size: 16px;
          color: #FFFFFF;
        }
        span{
          display: flex;
          width: 100%;
          height: 100%;
          justify-content: center;
        }
        &::after, &::before {
          display: none;
        }
      }
    }
    .van-hairline--top {

    }
  }
</style>
