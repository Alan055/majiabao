<template lang="html">
<div class="view-limit-increase">
    <div class="c-layer">
        <div class="pull-down-bg"></div>
    </div>
    <scroller
        :on-refresh="refresh"
        :offset="100"
        :bounce="80"
        :maxScrollerHeight="130"
        :power="1.5"
    >
        <div class="c-view-content" v-min-height>
            <div class="banner" :style="`padding-top: ${$root.statusHeight}px`">
            <p class="p1">信用开启美好生活</p>
            <p class="p2">越诚信 越幸运</p>
            </div>
            <div class="content-wrap2">
            <p class="desc">补充以下资料，有助于提升您的综合信用</p>
            <mt-cell v-for="item in data" :key="item.id" :title="item.name" :is-link="item.editable" v-if="item.placeholder != '敬请期待'" :class="{'disabled': !item.openflag}" @click.native="handleClick(item)">
                <span slot="icon"><img class="c-icon icon_a" :src="item.iconurl" ></span>
                <span v-if="item.authstatus == 2"><img class="c-icon icon_c" src="~@/assets/images/publicInfo/be_ch@2x.png" ></span>
                <span v-else-if="item.openflag" class="c-green">{{item.authstatus | authstatus}}</span>
                <span v-else>{{item.placeholder}}</span>
            </mt-cell>
            </div>
        </div>
    </scroller>
</div>
</template>

<script>
import api from "@/services/api";
import util from "@/utils";
import storage from "@/utils/storage";
import helper from "@/utils/helper";
import scroller from "@/components/view/scroller";
import { Toast, Indicator, MessageBox } from "@/utils/helper";
import { mapGetters, mapMutations } from "vuex";
import EventBus from "@/services/EventBus";

export default {
	name: "getTrust",
	data() {
		return {
      data: [],
      isLogin: !!util.getParams("token"),
		};
	},
	computed: {
		...mapGetters([])
	},
	methods: {
        ...mapMutations([]),
        //刷新
        async refresh(cb) {
            console.log('数据刷新成功');
            setTimeout(() => {
                this.fetchData();
                cb && cb()
            }, 1000)
        },
		async handleClick(item) {
			console.log(
				"editable",
				item.editable,
				"isLogin",
				this.$root.isLogin
			);

			// 埋点
			this.sinaAds.click({
				currEvent: this.stat.home.index.link,
				currentEventParams: item
			});

			// 不可申请
            if (!item.editable) return;

			// 未登录
			if (!this.isLogin) {
            // alert("当前登陆了？",this.isLogin);
				this.$root.jumpToLogin();
				return;
			}

			// 运营商认证
			//if (item.type == 1) {
				// 检查身份认证
				Indicator.open();
				let res = await api.getTrust
					.validateUserInfo({ type: "3" })
					.finally(Indicator.close);
				if (!helper.isSuccess(res)) return;
				if (res.data.status != 1) {
                    MessageBox({
						title: "温馨提示",
						message:res.data.remark,
						showCancelButton: true,
						confirmButtonText: "确认",
						cancelButtonText: "取消"
					}).then(action => {
						if (action == "confirm") {
							this.$root.openUrl(res.data.nextpage);
						}
					});
                }
			//}

			// 前往认证
			this.$root.openUrl(item.url);
		},
		fetchData() {
			return api.getTrust.home().then(res => {
				if (!helper.isSuccess(res)) return;
				this.data = (res.data || []).map(item => {
					let { authstatus, repeatflag, openflag } = item;
					// 认证状态(0-未认证，1-认证申请中，2-认证通过，3-认证失败,4-已过期)
					// 是否可点击：已开启 && (无状态或未认证 || 认证失败 || 认证通过且可以重复认证)
					item.editable =
						!!openflag &&
						(!authstatus ||
							authstatus == 3 || authstatus == 4 ||
							(authstatus == 2 && repeatflag));
					return item;
				});
			});
		}
	},
	filters: {
		authstatus(value) {
        let str = '';
                switch (value) {
                    case null:
            str = '未认证'
            break;
            case 1:
            str = '认证申请中'
            break;
            case 2:
            str = '认证通过'
            break;
            case 3:
            str = '认证失败'
            break;
            case 4:
            str = '已过期'
            break;

            default:
            str = '未认证'
            break;
        };
        return str;
		}
	},
	components: {
        scroller
    },
	watch: {},
	created() {
		this.fetchData().finally(this.$root.loadingClose);
	},
	onRefresh(tag, data) {

        if(tag == 'login'){
        // alert(tag);
        // alert(data);
        // alert()
        // alert("收到通知了!,token是",data);
        this.isLogin = !!data;
        // alert("收到通知了!,当前登陆太是",this.isLogin);
        }

		if (tag == "trust") {
			this.fetchData();
		}
	}
};
</script>

<style lang="scss" scoped>
.view-limit-increase {
	.pull-down-bg {
		height: 40vh;
		background-image: linear-gradient(90deg, #3FC87F 0%, #92E697 100%);
	}
    .c-view-content {
        background-color: #fff;
    }
	.banner {
		height: 336px;
		box-sizing: content-box;
		background: url("./images/getTurst-bg.png") no-repeat;
        background-size: cover;
		color: #ffffff;
		text-align: center;
		overflow: hidden;

		.p1 {
			font-size: 28px;
			margin-top: 40px;
			margin-bottom: 10px;
		}
		.p2 {
            font-family: PingFangSC-Regular;
            font-size: 18px;
            color: #FFFFFF;
            letter-spacing: 0.22px;
            text-align: center;
		}
	}
	.content-wrap2 {
        position: relative;
        padding-bottom: 50px;
		border-radius: 12px;
		background: white;
		margin: -194px 12px 12px 12px;
		min-height: 220px;
        background: rgba(255,255,255,0.99);
        box-shadow: 0 1px 12px 0 rgba(121,183,83,0.10);
        border-radius: 8px;
	}
	.desc {
		font-size: 14px;
		color: #666666;
		text-align: center;
		padding-top: 26px;
		padding-bottom: 15px;
	}
    
    .c-green {
        color: #70D476;
    }
	.mint-cell-wrapper {
		border: none;
	}

	/deep/ .mint-cell {
    box-sizing: border-box;
    
    //border: none !important;
    //@extend %border-t;

    .mint-cell-wrapper {
      padding: 0 $gap !important;
      margin: 0 !important;
    }
		&.disabled {
			.mint-cell-text,
			.mint-cell-value {
				color: #999999;
			}
		}
	}
}
</style>
