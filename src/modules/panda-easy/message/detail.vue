<template lang="html">
	<div class="cro">

		<div class="view">
			<!--<c-header title="消息中心" :back="true"></c-header>-->

			<div class="message-item">
				<p class="title">{{item.msgtitle}}</p>
				<p class="date">{{item.createtime | localTime}}</p>
				<p class="line"></p>
				<p class="img-wrap" v-if="item.msgimgurl">
					<img :src="item.msgimgurl" alt="">
				</p>
				<div class="desc-ts" v-html="item.msgcontent"></div>

			</div>
		</div>

	</div>
</template>

<script>
	import api from "@/services/api";
	import helper from "@/utils/helper";
    import AppBridge from "@/services/AppBridge.js";
    import EventBus from "@/services/EventBus";
	export default {
		data() {
			return {
				item: {}
			}
        },
        created () {
            AppBridge.setWebAttribute({ intercept: true });
            EventBus.$on("back", () => {
                console.log('back')
                //关闭窗口并通知上一页
                AppBridge.notify({tag: 'refresh'})

                //暂时这样用
                AppBridge.activityView({
                    type:'close',
                    refresh: true
                })
            });
        },
		methods: {
			fetchData() {
				//    this.item = this.$route.params
				this.item = JSON.parse(this.$route.query.item)

				this.$root.loadingClose();

			},
			readyFlag() {
                console.log('this.item.id', this.item.id);
				this.productid = this.$route.query.productId || '2001'
				this.token = this.$route.query.token
				api.user.message.ready({
					messageId: this.item.id, //站内信id
					productId: 2001,
					token: this.token
				}).then(res => {
					if(!helper.isSuccess(res)) return
					console.log('已经阅读 detail' + this.item.id)

				})
			},
			setTitle() {
				this.$root.setWebAttribute({
					title: "消息详情"
				})
			}
		},
		beforeRouteEnter(to, from, next) {
			// 导航进入该组件时调用
			// 不！能！获取组件实例 `this`
			// 因为组件实例还没被创建

			next(vm => {
				// 通过 `vm` 访问组件实例
				vm.fetchData();
				//vm.readyFlag();
				vm.setTitle();

			});
		},
	}
</script>

<style lang="scss" scoped>
	.view {
		overflow: auto!important;
	}

	.message-item {
		padding: 25px $gap;
	}

	.title {
		font-size: $fontL;
	}

	.date {
		font-size: $fontS;
		color: $gray;
	}

	.line {
		@extend %border-b;
		margin: 10px 0;
		margin-right: -$gap;
	}

	.img-wrap {
		margin: 10px 0;
		img {
			display: block;
			width: 100%;
		}
	}


</style>
<style lang="scss">
		.desc-ts {
		width: 100%;
		img {
			display: block;
			width: 100% !important;
		}
	}
</style>
