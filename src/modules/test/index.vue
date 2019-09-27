<template lang="html">
<div class="view-template">
  <div class="test-sinaif c-view-content">
      <!-- <img src="../../assets/images/logo.png" alt=""> -->
      <h2>测试伪协议</h2>
      <button class="button"  @click="request">发起网络请求</button>
      <button class="button"  @click="downloadFile">下载文件</button>
      <button class="button"  @click="uploadFile">上传文件</button>
      <button class="button"  @click="setStorage">数据缓存-保存数据</button>
      <button class="button"  @click="getStorage">数据缓存-获取数据</button>
      <button class="button"  @click="removeStorage">数据缓存-删除数据</button>
      <button class="button"  @click="chooseImage">图片-选择图片</button>
      <button class="button"  @click="previewImage">图片-预览图片</button>
      <button class="button"  @click="getLocation">获取位置</button>
      <button class="button"  @click="getSystemInfo">获取手机设备信息</button>
      <button class="button"  @click="getNetwork">获取网络状态</button>
      <button class="button"  @click="makePhoneCall">拨打电话</button>
      <button class="button"  @click="permission('camera')">申请权限-相机</button>
      <button class="button"  @click="permission('contacts')">申请权限-通讯录</button>
      <button class="button"  @click="permission('record')">申请权限-录音</button>
      <button class="button"  @click="permission('location')">申请权限-定位</button>
      <button class="button"  @click="permission('storage')">申请权限-存储</button>
      <button class="button"  @click="permission('phoneState')">申请权限-电话</button>
      <button class="button"  @click="setClipboardData">设置剪贴板内容</button>
      <button class="button"  @click="getClipboardData">获取剪贴板内容</button>
      <button class="button"  @click="activityView">新建窗口</button>
      <button class="button"  @click="testCloseWindow">关闭窗口</button>
      <button class="button"  @click="dialogView">弹窗</button>
      <button class="button"  @click="toast">Toast提示</button>
      <button class="button"  @click="pickerView">底部弹出选择框</button>
      <button class="button"  @click="chooseAddress">省市选择框</button>
      <button class="button"  @click="chooseCity">省市选择框</button>
      <button class="button"  @click="chooseCity">影像资料录制</button>
      <button class="button"  @click="recordVideoToBoc">影像资料录制</button>
      <button class="button"  @click="chooseContacts">通讯录选择联系人</button>
      <button class="button"  @click="scanIDCard">依图扫描身份证</button>
      <button class="button"  @click="livingBodyCheck">依图活体检查</button>
      <button class="button"  @click="scanBankCard">依图银行卡扫描</button>
      <button class="button"  @click="launchApp">打开第三方程序</button>
      <button class="button"  @click="share">社会化分享</button>
      <button class="button"  @click="addBank">添加银行卡</button>
      <button class="button"  @click="goNative">goNative</button>
      <div class="info" v-html="'<p><a href=\'tel:4044404400\'>4404044040</a></p>'"></div>
      <div>
    <iframe src="https://aclweb.uat.homecreditcfc.cn/wcl-web/document.do?token=32068d9505421a79f85b318f42deeb5a3d890c56d03ec8e28acb06798e1b6fd8277ed1e92ea2aa96a77c4fac84460508e268d126dd6902b68f772519a29fd0d3e2c8f3e41759a2f9954779be38e61fe29778cadccbed94d256e2f719e7fcd201330c0b25f666837a16f216cdb59c8d663cc9c0e2f4b7c7c43ec102ecfa7071b4"></iframe>  
  </div> 
  </div>
</div>
</template>

<script>
import api from "@/services/api";
import util from "@/utils";
import storage from "@/utils/storage";
import helper from "@/utils/helper";
import { Toast } from "@/utils/helper";
import { mapGetters, mapMutations } from "vuex";
import AppBridge from '@/services/AppBridge'

export default {
	name: "template",
	data() {
		return {};
	},
	computed: {
		...mapGetters([])
	},
	methods: {
		...mapMutations([]),
		request: function() {
			this.SINAIF.request({
				url: "",
				method: "post",
				params: {
					userId: 123456789
				},
				callback: function(e) {
					alert(JSON.stringify(e));
				}
			});
		},
		downloadFile: function() {
			this.SINAIF.downloadFile({
				filePath:
					"http://pub.sinaif.com/pg/loan/base/apk/sinaif_android_V2.1.0_s161801.apk",
				type: 1,
				callback: function(e) {
					alert(JSON.stringify(e));
				}
			});
		},
		uploadFile: function() {
			this.SINAIF.uploadFile({
				url: "http://wwq.cas.com",
				filePath:
					"http://pub.sinaif.com/pg/loan/base/apk/sinaif_android_V2.1.0_s161801.apk",
				type: 1,
				callback: function(e) {
					alert(JSON.stringify(e));
				}
			});
		},
		setStorage: function() {
			this.SINAIF.setStorage({
				key: "name",
				value: "ganha"
			});
		},
		getStorage: function() {
			this.SINAIF.getStorage({
				key: "name",
				callback: function(e) {
					alert(JSON.stringify(e));
				}
			});
		},
		removeStorage: function() {
			this.SINAIF.removeStorage({
				key: "name"
			});
		},
		chooseImage: function() {
			this.SINAIF.chooseImage({
				callback: function(e) {
					alert(JSON.stringify(e));
				}
			});
		},
		previewImage: function() {
			this.SINAIF.previewImage({
				url: "https://xl.sinaif.com/static/static/images/short-bg.png"
			});
		},
		getLocation: function() {
			// alert("点击了获取位置按钮！");
			this.SINAIF.getLocation({
				callback: function(e) {
					alert(JSON.stringify(e));
				}
			});
		},
		getSystemInfo: function() {
			this.SINAIF.getSystemInfo({
				callback: function(e) {
					alert(JSON.stringify(e));
				}
			});
		},
		getNetwork: function() {
			this.SINAIF.getNetwork({
				callback: function(e) {
					alert(JSON.stringify(e));
				}
			});
		},
		makePhoneCall: function() {
			this.SINAIF.makePhoneCall({
				phoneNumber: "186803123123"
			});
		},
		permission: function(scope) {
			this.SINAIF.permission({
				scope: scope,
				callback: function(e) {
					alert(JSON.stringify(e));
				}
			});
		},
		setClipboardData: function() {
			this.SINAIF.setClipboardData({
				data: "这是要复制的内容"
			});
		},
		getClipboardData: function() {
			this.SINAIF.getClipboardData({
				callback: function(e) {
					alert(JSON.stringify(e));
				}
			});
		},
		activityView: function() {
			this.SINAIF.activityView({
				url: "https://www.baidu.com/",
				type: "open",
				title: "轻松借模块化",
				isFull: true,
				isTrans: true,
				isCloseCurrent: false,
				refresh: false
			});
		},
		testCloseWindow() {
			AppBridge.activityView({
        type: 'close'
      });
		},
		dialogView: function() {
			this.SINAIF.dialogView({
				msg:
					"https://jie.iask.cn/pg/qsj/index.html?cfgId=NPL44120180515103845100",
				title: "轻松借模块化",
				leftBtn: "取消",
				rightBtn: "确定",
				isBackCancel: true,
				callback: function(e) {
					alert(JSON.stringify(e));
				}
			});
		},
		toast: function() {
			this.SINAIF.toast({
				msg:
					"https://jie.iask.cn/pg/qsj/index.html?cfgId=NPL44120180515103845100",
				time: 3000
			});
		},
		pickerView: function() {
			this.SINAIF.pickerView({
				dataSource: "H5",
				dataArr: ["程序员", "测试", "开发"],
				title: "测试",
				select: "程序员",
				callback: function(e) {
					alert(JSON.stringify(e));
				}
			});
		},
		chooseAddress: function() {
			this.SINAIF.chooseAddress({
				provinceCode: 440000,
				cityCode: 440300,
				countryCode: 440305,
				callback: function(e) {
					alert(JSON.stringify(e));
				}
			});
		},
		chooseCity: function() {
			this.SINAIF.chooseCity({
				provinceCode: 440000,
				cityCode: 440300,
				callback: function(e) {
					alert(JSON.stringify(e));
				}
			});
		},
		recordVideoToBoc: function() {
			this.SINAIF.recordVideoToBoc({
				callback: function(e) {
					alert(JSON.stringify(e));
				}
			});
		},
		chooseContacts: function() {
			this.SINAIF.chooseContacts({
				callback: function(e) {
					alert(JSON.stringify(e));
				}
			});
		},
		scanIDCard: function() {
			this.SINAIF.scanIDCard({
				type: "front",
				callback: function(e) {
					alert(JSON.stringify(e));
				}
			});
		},
		livingBodyCheck: function() {
			this.SINAIF.livingBodyCheck({
				callback: function(e) {
					alert(JSON.stringify(e));
				}
			});
		},
		scanBankCard: function() {
			this.SINAIF.scanBankCard({
				callback: function(e) {
					alert(JSON.stringify(e));
				}
			});
		},
		launchApp: function() {
			this.SINAIF.launchApp({
				scheme: "hsinaif://main",
				callback: function(e) {
					alert(JSON.stringify(e));
				}
			});
		},
		share: function() {
			this.SINAIF.share({
				isSharePanel: true,
				message: "邀请好友",
				title: "邀请好友",
				url: "http://www.baidu.com",
				image: "http://www.baidu.com"
			});
		},
		initBack() {
			window.back = function() {
				alert("点击了返回按钮");
			};
		},
		addBank() {
			AppBridge.goNative({
				url: 'bank'
			})
		},
		goNative() {
			AppBridge.goNative({
				pkg: 'error'
			})
		}
	},
	components: {},
	watch: {},
	created() {
		this.initBack();

		AppBridge.setWebTitleAttribute({
			btnType: 'img',
			btnVal: "http://k8s-king-dev-static.sinaif.com/static/icon/loanstate/ap_at@2x.png"
		})		
	},

};
</script>

<style lang="scss" scoped>
img {
	margin-top: -20px;
}
.test-sinaif {
	padding: 20px;
	padding-bottom: 200px;
	box-sizing: border-box;
}
button {
	display: inline-block;
    padding: 8px;
	background-color: #26a2ff;
	border-radius: 2px;
    color: white;
    border: 0;
	margin: 12px 0;
}
</style>
<style>
.info a{
  text-decoration: none;
}
</style>