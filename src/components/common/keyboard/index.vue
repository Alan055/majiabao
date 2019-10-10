<!--keyboard-->
<template>
    <div class="keyboard-wrap" v-show="showTag">
        <div class="keyboard-shadow"></div>
        <div class="keyboard-box">
            <div class="info">
                <div class="title">
                    <span>请输入交易密码</span>
                    <span class="close" @click="toggled"></span>
                </div>
                <p>借款金额(元)</p>
                <h4 class="num-size">{{quota}}</h4>
                <div class="pass-box">
                    <div class="pass-item" v-for="(item,index) in formataPass" :key="index">
                        <span>{{item}}</span>
                    </div>
                    <!-- <span></span> -->
                </div>
                <div class="c-blue tip" @click="forgetPass">
                    <slot>忘记交易密码?</slot>
                </div>
            </div>
            <div class="board">
                <ul>
                    <li v-for="(item,index) in  nums" :key="index" @click="handleClick(index)">
                        {{item.num}}
                    </li>
                    <div class="empty"></div>
                    <div class="zero" @click="handleClick(10)">0</div>
                    <div class="delete" @click="deleteValue">
                        <span></span>
                    </div>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import AppBridge from "@/services/AppBridge.js";
import EventBus from "@/services/EventBus";
export default {
	name: "keyborad",
	data() {
		return {
			nums: [
				{
					num: 1
				},
				{
					num: 2
				},
				{
					num: 3
				},
				{
					num: 4
				},
				{
					num: 5
				},
				{
					num: 6
				},
				{
					num: 7
				},
				{
					num: 8
				},
				{
					num: 9
				}
			],
			inputValue: ""
		};
	},
	props: {
		quota: {
			required: true
		},
		showTag: {
			type: Boolean,
			required: true,
			default: false
		}
	},
	computed: {
		formataPass() {
			let result = ["", "", "", "", "", ""];
			if (this.inputValue.length) {
				this.inputValue.split("").map((item, index) => {
					if (index < 6) {
						result[index] = "·";
					}
					if (result[5] != "") {
						this.done();
					}
				});
				return result;
			} else {
				return result;
			}
		}
	},
	created() {
		EventBus.$on("clearPwd", () => {
			this.inputValue = "";
		});
	},
	methods: {
		//输入事件
		handleClick(index) {
			let value;
			if (this.inputValue.split("").length > 5) {
				return false;
			} else {
				if (index == 10) {
					value = 0;
				} else {
					value = this.nums[index].num;
				}
				console.log(value);
				this.inputValue = this.inputValue + "" + value;
			}
		},
		//响应完成事件
		done() {
			console.log("keyboard 触发 done!");
			let value = this.inputValue;
			console.log(`${value}`);
			this.$emit("doned", value);
		},
		//展开事件
		toggled() {
			this.inputValue = "";
			this.$emit("toggle");
		},
		deleteValue() {
			this.inputValue = this.inputValue.substring(
				0,
				this.inputValue.length - 1
			);
		},
		// 忘记密码
		forgetPass() {
			AppBridge.goNative({
				pkg: "cashpassword"
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.keyboard-wrap {
	// position: fixed;
	.keyboard-shadow {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 100;
		background: rgba(0, 0, 0, 0.5);
	}
	.keyboard-box {
		position: absolute;
		height: 414px;
		background: white;
		width: 100%;
		bottom: 0;
		left: 0;
		z-index: 101;
		.info {
			height: 200px;
			display: flex;
			align-items: center;
			flex-direction: column;
			.title {
				height: 48px;
				line-height: 48px;
				color: #aaa;
				font-size: 14px;
				position: relative;
				width: 100%;
				text-align: center;
				.close {
					position: absolute;
					width: 21px;
					height: 21px;
					background: url("~@/assets/images/login/ac_cl@2x.png")
						no-repeat;
					background-size: contain;
					right: 10px;
					top: 8px;
				}
			}
			.pass-box {
				width: 320px;
				height: 48px;
				line-height: 48px;
				display: flex;
                margin-top: 7px;
                .pass-item{
                    flex: 1;
					height: 48px;
					box-sizing: border-box;
					border-bottom: 1px solid #ccc;
                    margin: 0 2px;
                    text-align: center;
                    span {
                        display: inline-block;
                        width: 49px;
                        font-size: 90px;
                        font-weight: 900;
				    }
                }

			}
			.tip {
				height: 46px;
				line-height: 46px;
				align-self: flex-end;
				margin-right: 35px;
				margin-top: 7px;
			}
		}
		.board {
			background: rgba(210, 213, 219, 0.9);
			height: 216px;
			ul {
				li {
					width: 117px;
					height: 46px;
					line-height: 46px;
					border-radius: 5px;
					background: white;
					float: left;
					margin: 6px 0 0 6px;
					font-size: 20px;
					text-align: center;
					&:active {
						background: #ccc;
					}
				}
			}
			.empty {
				width: 117px;
				height: 46px;
				// line-height: 36px;
				// border-radius: 5px;
				// // background: white;
				float: left;
				margin: 6px 0 0 6px;
				font-size: 20px;
				text-align: center;
			}
			.zero {
				width: 117px;
				height: 46px;
				line-height: 36px;
				border-radius: 5px;
				background: white;
				float: left;
				margin: 6px 0 0 6px;
				font-size: 20px;
				text-align: center;
			}
			.delete {
				width: 117px;
				height: 46px;
				line-height: 36px;
				border-radius: 5px;
				float: left;
				margin: 6px 0 0 6px;
				font-size: 20px;
				text-align: center;
				display: flex;
				justify-content: center;
				align-items: center;
				span {
					width: 22px;
					height: 22px;
					background: url("~@/assets/images/merchantsStatus/withdrawal/ax_au@2x.png")
						no-repeat;
					background-size: contain;
					background-position: center;
				}
			}
		}
	}
}
.num-size {
	font-size: 22px;
	color: #000;
	line-height: 32px;
}
</style>
