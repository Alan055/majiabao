<template>
    <div class="view-public-info-view c-bg-gray">
        <c-header title="公共信息" :back="true"></c-header>
        <mt-navbar v-model="selected">
            <mt-tab-item id="1">身份信息</mt-tab-item>
            <mt-tab-item id="2">联系人信息</mt-tab-item>
            <mt-tab-item id="3">基本信息</mt-tab-item>
        </mt-navbar>

        <!-- tab-container -->
        <mt-tab-container v-model="selected" :swipeable="true" class="c-view-block" :class="'selected-'+selected">
            <mt-tab-container-item id="1" :class="{show: selected == 1}">
                <div class="c-view-content">
                    <div class="content-wrap" v-min-height>
                        <div class="id-card-input c-section">
                            <div class="c-flex-row">
                                <div class="c-flex-item">
                                    <p class="title">身份证人像面</p>
                                    <photo-scan v-model="formData.posimageurl" readonly="true" :showblur ='true'>
                                        <img slot="default-img" src="~@/assets/images/publicInfo/renxiang.png" alt="">
                                    </photo-scan>
                                </div>
                                <div class="c-flex-item">
                                    <p class="title">身份证国徽面</p>
                                    <photo-scan v-model="formData.oppimageurl" readonly="true" :showblur ='true'>
                                        <img slot="default-img" src="~@/assets/images/publicInfo/guohui.png" alt="">
                                    </photo-scan>
                                </div>
                            </div>
                        </div>

                        <div class="c-section">
                            <mt-cell title="真实姓名">
                                <span>{{formData.cardname | hideName}}</span>
                            </mt-cell>
                            <mt-cell title="身份证号">
                                <!--<span>{{formData.cardno}}</span>-->
                                <span>{{formData.cardno | hideMiddle}}</span>
                            </mt-cell>
                        </div>

                      <!--  <div class="c-section">
                            <mt-cell title="人脸识别">
                                <span class="c-blue"><img class="c-icon icon_c icon-done" src="~@/assets/images/my/bill/aj_ch@2x.png" alt="">拍摄完成</span>
                            </mt-cell>
                        </div>-->

                        <div class="bottom-info">
                            <img class="c-icon" src="~@/assets/images/publicInfo/ba_cg@2x.png" alt=""> {{appName}}智能加密，保障您的信息安全
                        </div>
                    </div>
                </div>
            </mt-tab-container-item>

            <mt-tab-container-item id="2" :class="{show: selected == 2}">
                <div class="c-view-content">
                    <div class="content-wrap" v-min-height>
                        <div class="c-section">
                            <form-control type="select" title="婚姻状况" v-model="formData.maritalstatus" :readonly="true" source="20011003" />
                            <div class="box" v-if="formData.maritalstatus == 'D02'">
                                <choose-contacts title="配偶" v-model="formData.family" :readonly="true" />
                            </div>
                            <div class="box" v-else>
                                <form-control type="select" title="直系亲属关系" v-model="formData.extratype" :readonly="true" source="20011041" />
                                <choose-contacts title="直系亲属" v-model="formData.family" :readonly="true" />
                            </div>
                            <choose-contacts title="朋友" v-model="formData.friend" :readonly="true" />
                            <choose-contacts title="同事" v-model="formData.colleague" :readonly="true" />
                        </div>

                        <div class="bottom-info">
                            <img class="c-icon" src="~@/assets/images/publicInfo/ba_cg@2x.png" alt=""> {{appName}}不会向联系人泄漏您的正常借款信息
                        </div>

                    </div>
                </div>
            </mt-tab-container-item>

            <mt-tab-container-item id="3" :class="{show: selected == 3}">
                <div class="c-view-content">
                    <div class="content-wrap" v-min-height>
                        <div class="c-section">
                            <form-control type="select" title="学历" v-model="formData.degreecode" :readonly="true" source="20011002" />
                            <!-- <form-control type="select" title="婚姻状况" v-model="formData.maritalstatus" :readonly="true" source="20011003"/> -->
                            <form-control type="select" title="月均收入(元)" v-model="formData.incomecode" :readonly="true" source="20011004" />
                            <mt-cell title="单位名称">
                                <span>{{formData.companyname}}</span>
                            </mt-cell>
                            <mt-cell title="期望借款金额(元)">
                                <span>{{formData.applyamount | money}}</span>
                            </mt-cell>
                        </div>

                        <div class="c-section">
                            <form-control type="addressSelect" title="居住地址" v-model="formData.homeAddress" :readonly="true" />
                            <div class="address">
                                {{formData.addr}}
                            </div>
                        </div>

                        <div class="c-section">
                            <form-control type="addressSelect" title="工作地址" v-model="formData.companyAddress" :readonly="true" />
                            <div class="address">
                                {{formData.companyaddr}}
                            </div>
                        </div>

                        <div class="bottom-info">
                            <img class="c-icon" src="~@/assets/images/publicInfo/ba_cg@2x.png" alt=""> {{appName}}智能加密，保障您的信息安全
                        </div>

                    </div>
                </div>
            </mt-tab-container-item>
        </mt-tab-container>

    </div>
</template>

<script>
import photoScan from "./components/photoScan";
import api from "@/services/api";
import chooseContacts from "./components/chooseContacts";
import formControl from "@/components/common/formControl";

import { mapGetters, mapMutations } from "vuex";
import helper from "@/utils/helper";
import { Toast, Indicator, MessageBox } from "@/utils/helper";

export default {
	data() {
		return {
			selected: "1",
			formData: {
				face: ""
			}
		};
	},
	components: {
		photoScan,
		chooseContacts,
		formControl
	},
	computed: {
		...mapGetters([])
	},
	methods: {
		...mapMutations([]),
		fetchData() {
			api.publicInfo
				.query({
					retype: "0"
				})
				.then(res => {
					if (!helper.isSuccess(res)) return;

					if (!res.data) return;

					let contacts = res.data.contacts.contacts.map(item => ({
						contactName: item.contactname,
						contactPhone: item.contactphone,
                        contactType: item.contacttype,
                        extratype:item.extratype
					}));
					let family = contacts.filter(
						item => item.contactType == 4
					)[0];
					let friend = contacts.filter(
						item => item.contactType == 6
					)[0];
					let colleague = contacts.filter(
						item => item.contactType == 7
					)[0];
                    // 获取 直系亲属关系

                    let extratype = family.extratype;
                    //获取婚姻转状况
                    let maritalstatus;
                    if(res.data.contacts.maritalstatus){
                       maritalstatus  = res.data.contacts.maritalstatus;
                    };
					let {
						degreecode,
						incomecode,
						companyname,
						occupations,
						addr,
						companyaddr,
						applyamount
					} = res.data.userBasicInfo;
					let {
						addrprovince,
						addrcity,
						addrarea,
						companyprovince,
						companycity,
						companyarea
					} = res.data.userBasicInfo;
					let {
						posimageurl,
						oppimageurl,
						cardname,
						cardno
					} = res.data.idCard;
					this.formData = {
						family,
						friend,
						colleague,
						degreecode,
						maritalstatus,
						incomecode,
						companyname,
						occupations,
						addr,
						companyaddr,
						applyamount,
						posimageurl,
						oppimageurl,
						cardname,
						cardno,
						extratype,
						homeAddress: {
							provinceCode: addrprovince,
							cityCode: addrcity,
							countryCode: addrarea
						},
						companyAddress: {
							provinceCode: companyprovince,
							cityCode: companycity,
							countryCode: companyarea
						}
					};
				})
				.finally(Indicator.close);
		}
	},
	created() {
		this.fetchData();
	},
	filters: {
		hideMiddle(val) {
			if (!val) return "";
			return `${val.substring(0, 3)}***********${val.substring(
				val.length - 4
			)}`;
    },
    hideName(value){
      if (!value) return "";
      let length = value.length-1;
      let str='';
      for(let i=0;i<length;i++){
        str+=' *';
      };
			return `${value.substring(0, 1)}${str}`;
    }
	}
};
</script>

<style lang="scss">
.view-public-info-view {
	.c-view-content {
		height: 100%;
	}
	.content-wrap {
		padding-top: 8px;
	}

	.id-card-input {
		padding: $gap;
		.c-flex-item:first-child {
			margin-right: 23px;
		}
		.title {
			font-size: $fontL;
			line-height: 24px;
			margin-bottom: 12px;
		}
		.photo-scan {
			width: 160px;
			height: 105px;
		}
	}
	.icon-done {
		margin-right: 6px;
	}
	.value-grid {
		padding-left: 16px;
	}
	.address {
		padding: 8px $gap;
		padding-left: 0;
		margin-left: $gap;
		@extend %border-t;

		color: $light;
		text-align: justify;
		min-height: 58px;
	}

	.mint-cell {
		.mint-cell-value {
			color: #999 !important;
		}
	}

	.mint-tab-container {
		&.selected-2 {
			.mint-tab-container-wrap {
				transform: translateX(-100%);
			}
		}
		&.selected-3 {
			.mint-tab-container-wrap {
				transform: translateX(-200%);
			}
		}
	}

	.mint-tab-container-item {
		display: block !important;
		position: relative;
	}

	.is-selected {
		border-bottom: 0px solid #fff !important;
	}
}
</style>
