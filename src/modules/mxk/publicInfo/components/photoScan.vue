<template>
    <div class="photo-scan">
        <div class="bg-img-wrap">
            <img :src="value" alt="" v-if="value" :class="{'blur':showblur}">
            <slot name="default-img" v-else></slot>
        </div>

        <div class="c-mask group1" v-if="!readonly && !value" @click="scan">
            <div class="scan-button">
                <img class="c-icon icon_e" src="~@/assets/images/publicInfo/ba_eh@2x.png" alt="">
                <p class="text">点击扫描</p>
            </div>
        </div>
        <div class="c-mask group2" v-if="!readonly && value" @click="scan">
            <div class="scan-button">
                <img class="c-icon icon_e" src="~@/assets/images/publicInfo/bb_ep@2x.png" alt="">
                <p class="text">重新扫描</p>
            </div>
        </div>

        <div class="group2">

        </div>
    </div>
</template>

<script>
import AppBridge from "@/services/AppBridge.js";
import api from "@/services/api.js";
import { Indicator } from "@/utils/helper";
import helper from "@/utils/helper";

// photoScan组件共享一个waiting状态
let waiting = false;

export default {
	props: ["value", "readonly", "type", "ocr","showblur"],
	methods: {
		//扫描接口
		scan() {

			// 扫描进行中，阻断执行
			if (waiting) return Promise.reject();
			waiting = true;


			return new Promise(resolve => {
				//调用APP扫描身份证能力
				AppBridge.scanIDCard(
					{
						type: this.type
					},
					res => {
						console.log("扫描结束", res);

						//data返回对应的图片id以及网络地址和缩略图地址
						if (res.code == 200) {
							this.$emit("input", res.data.imgUrl);

							// 通知fileId
							this.uploadIdInfo({
								fileId: res.data.imgId,
								type: this.type
							});

							// 调用face++
							// 在某些情况下不需要调用ocr
							this.ocr && this.discernFace(res.data.imgId);

							resolve();
						} else {
						}

						// 扫描结束
						waiting = false;
					}
				);
			});
		},
		//调用face++接口，识别身份证号以及姓名
		discernFace(fileId) {
			console.log(`调用face++接口`);
			console.log(`${this.type}+${fileId}`);

			let retype = "1";

			api.publicInfo
				.callFacePlus({
					fileid: fileId,
					retype: retype
				})
				.then(res => {
					console.log(`face++接口数据返回`);
					console.log(JSON.stringify(res));
					// let fakeDate = {
					//     msg: "ok",
					//     code: 200,
					//     data: {
					//         address:
					//             "安徽省芜湖市繁昌县繁阳镇迎春路迎春小区6幢401室",
					//         agency: "",
					//         brithday: "1988.05.12",
					//         city: "",
					//         idcrdTyp: "1",
					//         name: "丁锋",
					//         no: "340222198805120012",
					//         race: "汉",
					//         sex: "男",
					//         validenddate: "",
					//         validstartdate: ""
					//     },
					//     timestamp: "20180529221902"
					// };
					if (helper.isSuccess(res)) {
						let data = {
							name: res.data.name,
							idCard: res.data.no,
							fileId: fileId,
							famadr: res.data.address,
							nation: res.data.race,
							agency: res.data.agency,
							type: this.type
						};
						this.uploadIdInfo(data);
					}
				});
		},
		//获取到身份信息，回转到父组件
		uploadIdInfo(obj) {
			this.$emit("idinfoChange", obj);
			// this.readonly = true;
		}
	}
};
</script>

<style lang="scss" scoped>
.photo-scan {
	width: 160px;
	height: 105px;
	border-radius: 4px;
	overflow: hidden;
	position: relative;
}
.bg-img-wrap img,
.c-mask {
	@extend %absolute;
	width: 100%;
	height: 100%;
}
.bg-img-wrap .blur{
  filter: blur(2px);
}
.scan-button {
	margin-top: 22px;
	font-size: $fontS;
	.text {
		margin-top: 4px;
	}
}
.group1 {
	color: #659ffc;
}
.group2 {
	color: white;
	background: rgba(0, 0, 0, 0.5);
}
</style>
