<template>
    <!-- 借还记录 -->
    <div class="record-wrap" v-if="data && data.length">
        <p class="c-list-title" :class="titleColor">借还款</p>
        <div class="list-wrap">
            <div class="list-top"></div>
            <div class="list-center">
                <div class="list-center-bg">

                    <div class="list">
                        <div class="list-item c-flex-row" v-for="item in data" :key="item.id+item.status+item.prestatus">
                            <div class="c-flex-item c-tl">
                                <p class="title"><img class="c-financing-logo" :src="item.iconurl" alt="">{{item.name}}</p>

                                <p v-if="!item.isShowFeeText" class="number">{{item.maxamount | money2Fixed}}</p>
                                <p class="number" v-else>{{item.isShowFeeText}}</p>
                                <p class="desc" v-html="getLabel(item.copywrites, 1)+''"></p>

                            </div>

                            <div class="c-tr">
                                <p class="state">
                                    <span v-html="getLabel(item.copywrites, 2)"></span>
                                </p>
                                <mt-button v-sina-ads="{
                                    currEvent:stat.recommend.records.openBtn,
                                    currEventParams:{
                                        name:item.name,
                                        productid:item.id,
                                        status:item.status
                                    }
                                }" class="btn-round handle-button" :class="getClass(item.copywrites, 3)" size="normal" type="primary" plain @click.native="jump(item.nextpage.url)">
                                    <animation-item :data="item" :label="getLabel(item.copywrites, 3)"></animation-item>
                                </mt-button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div class="list-bottom"></div>
        </div>
    </div>
</template>

<script>
import animationItem from "./animationItem";
import qs from "qs";
import api from "@/services/api";
import helper from "@/utils/helper";
import { Indicator } from "@/utils/helper";

export default {
	props: ["resdata"],
	computed: {
		data() {
			return this.resdata.applyproducts;
		},
		titleColor() {
			let { newcards } = this.resdata;
			return !newcards || !newcards.length ? "white" : "";
		}
	},
	components: {
		animationItem
	},

    created(){
        console.log('record==========>');
        //console.log(JSON.stringify(this.resdata.applyproducts, null, 2));
    },
	methods: {
		getLabel(value, type) {
			return value.filter(item => item.type == type)[0].content;
		},
		getClass(value, type) {
			let remark = value.filter(item => item.type == type)[0].remark;
			if (remark == 1) {
				return "red";
			}
			if (remark == 2) {
				return "blue";
			}
			if (remark == 3) {
				return "black";
			}
			if (remark == 4) {
				return "gray";
			}
		},
		jump(url) {
			let search = url.split("?")[1] || "";
			let params = qs.parse(search);
			let { orderid, billid, productid: fundproductid } = params;

			Indicator.open();
			api
				.getRouterUrl({ orderid, billid, fundproductid })
				.then(res => {
					if (helper.isSuccess(res)) {
						let url = res.data.forwardItemBeans[0].url;
						this.$root.openUrl(url, this.resdata);
					}
				})
				.finally(Indicator.close);
		}
	}
};
</script>

<style lang="scss" scoped>
.record-wrap {
	padding: 0 $gap;
	overflow: hidden;
	position: relative;
}

.c-list-title {
	&.white {
		color: white;
	}
}

.list-wrap {
	margin: 0 (-$gap);
}
.list-top {
	background: url("~@/assets/images/recommend/list_top@2x.png") top / 100%
		100% no-repeat;
	height: 70px;
	margin-top: -27px;
}
.list-bottom {
	background: url("~@/assets/images/recommend/list_base@2x.png") bottom / 100%
		100% no-repeat;
	height: 70px;
}
.list-center {
	background: url("~@/assets/images/recommend/list_mid_no_shadow.png") center /
		100% repeat;
	padding: 1px 0;
	margin: -1px 0;
}
.list-center-bg {
	background: url("~@/assets/images/recommend/list_mid@2x.png") center / 100%
		repeat;
	overflow: hidden;
}
.list {
	padding: 0 ($gap + 10px);
	margin: -16px 0;
}
.list-item {
	position: relative;
	padding: 16px 0;
	margin: 0 12px;
	border-bottom: 1px dashed rgba(151, 151, 151, 0.2);
	&:last-child {
		border: none;
	}
	.title {
		color: $gray;
		@include center-flex(y);
		.c-icon {
			margin-right: 4px;
		}
	}
	.number {
		font-size: 24px;
		margin-top: 8px;
	}
	.desc {
		font-size: 12px;
		color: $light;
	}
	.state {
		font-size: 12px;
		color: $light;
		margin-top: 3px;
		white-space: nowrap;
	}
	.handle-button {
		margin-top: 16px;
		width: 86px;
		height: 32px;
		font-size: 14px;
		position: relative;
		overflow: hidden;

		&.red {
			color: $red;
			border-color: $red;
		}
		&.blue {
			color: $blue;
			border-color: $blue;
		}
	}
}
</style>
