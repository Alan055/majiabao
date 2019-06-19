<template>
    <div>
        <!-- 借还记录 -->
        <div class="record-wrap" v-if="data && data.length > 0">
            <p class="list-title" >借还款</p>
            <div class="list-wrap">
                <div class="list-center">
                    <div class="list-center-bg">

                        <div class="list-content">
                            <div class="list" v-for="(item, i) in data" :key="i">
                                <div class="list-item c-flex-row">
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
                            <div class="c-welfare-info" v-if="item.isShowWelfareInfo">
                                <img :src="item.icon">
                                <span v-html="item.productlistdesc"></span>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="record-warp-nodata" v-if="isShowNodata" >
            <div class="no-data-content">
                很抱歉，您目前还无可用额度！
            </div>
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
    data() {
        return {
            isShowNodata: false
        }
    },
	props: ["resdata"],
	computed: {
		data() {
            this.isShowNodata = this.resdata.apiFinish && this.resdata.applyproducts && this.resdata.applyproducts.length <= 0;

            return this.resdata.applyproducts
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
	},
    watch: {
        "resdata.welfareInfo"() {
            let welfareInfoIds = [];
            if(this.resdata.welfareInfo && this.resdata.welfareInfo.length > 0){
                welfareInfoIds = this.resdata.welfareInfo.map((item) => {
                    return item.productid
                })
                let newApplyData = this.resdata.applyproducts.map((item) => {
                    if(welfareInfoIds.includes(item.id)) {//有福利红包
                        let welfareData = this.resdata.welfareInfo.filter((wfItem) => {
                            return wfItem.productid == item.id;
                        })
                        if(welfareData && welfareData.length > 0) {
                            return Object.assign(item, {
                                isShowWelfareInfo: true,
                                icon: welfareData[0].icon,
                                productlistdesc: welfareData[0].productlistdesc
                            })
                        }else{
                            return item
                        }
                    }else{
                        return item
                    }
                })
                this.resdata.applyproducts = newApplyData;
            }

        }
    }
};
</script>

<style lang="scss" scoped>
.record-wrap {
	padding: 0 $gap;
	overflow: hidden;
	position: relative;
    background-color: #fff;
}
.c-financing-logo {
    border: 0;
    border-radius: 50%;
}
.record-warp-nodata {
    position: relative;
    background: #fff;
    background-image: url('../../images/record-nodata.png');
    background-repeat: no-repeat;
    background-size: 100% 260px;
    overflow: hidden;
    height: 260px;

    .no-data-content {
        position: absolute;
        bottom: 0;
        width: 94%;
        margin: 0 13px;
        height: 80px;
        line-height: 80px;
        background-color: white;
        text-align: center;
        border-radius: 4px;
        color: #666;
    }
}

.list-title {
    line-height: 25px;
    font-size: 18px;
    padding: 18px 0;
    text-align: left;
    font-weight: 600;
	&.white {
		color: white;
	}
}
.list-wrap {
	margin: 0 (-$gap);
}
.list-content {
	padding: 0 13px;
}
.list {
    position: relative;
	padding: 16px 12px;
    background: #FFFFFF;
    box-shadow: 0 2px 16px 0 rgba(0,0,0,0.06);
    border-radius: 4px;
    margin-bottom: 14px;

    .c-welfare-info {
        display: flex;
        align-items: center;
        background: #F5F5F5;
        border-radius: 2px;
        padding: 2px 5px;
        margin-top: 4px;
        margin-left: 20px;

        img {
            width: 12px;
            height: 12px;
        }
        span {
            font-size: 12px;
            color: #333333;
            margin-left: 4px;
        }

    }
}
.list-item {


	&:last-child {
		border: none;
	}
	.title {
		//color: $gray;
        font-size: 15px;
		@include center-flex(y);
		.c-icon {
			margin-right: 4px;
		}
	}
	.number {
		font-size: 24px;
		margin-top: 8px;
        margin-left: 20px;
	}
	.desc {
		font-size: 12px;
		color: $light;
        margin-left: 20px;
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
			background-image: linear-gradient(-90deg, #FFEA13 7%, #FDD108 100%);
            border-radius: 20px;
            color: #654D34;
            border: none;
		}
		&.blue {
			color: #659FFC;
			border-color: #659FFC;
		}
	}
}
</style>
