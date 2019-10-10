<template lang="html">
	<div class="cro">

		<div class="view">
			<!--<c-header title="消息中心" :back="true"></c-header>-->

			<div class="message-item">
				<p class="title">温馨提示：谨防诈骗！</p>
				<p class="date">2019-05-08</p>
				<p class="line"></p>
				<div class="desc-ts">
                    尊敬的用户:

                    <p class="title">近期，不少犯罪分子利用科技手段，使用电话、短信等方式对广大群众进行诈骗。温馨提示，切勿相信“天降馅饼儿的好事”,切勿向陌生账号转账。</p>

                    <p class="title">近期常见的诈骗方式有：许以暴利诱惑，谎称中了大奖，低价能买高档汽车，可以低息贷款，高薪工作等;假冒身份诈骗，冒充国家工作人员，冒充银行谎称银行卡透支，冒充民警称市民涉嫌犯罪，冒充税务说要退税;谎称亲友遇祸，急需用钱赶快汇款等。面对这些诈骗信息，市民只要细心想想，多向身边的亲友求证，不抱有“捡便宜”的心态，就能够很大程度上避免被骗。</p>
                </div>

			</div>
		</div>

	</div>
</template>

<script>
import api from "@/services/api";
import helper from "@/utils/helper";
import EventBus from "@/services/EventBus";
export default {
  data() {
    return {
      item: {}
    };
  },
  created() {
    this.$AppBridge.setWebAttribute({ intercept: true });
    EventBus.$on("back", () => {
      //暂时这样用
      this.$AppBridge.activityView({
        type: "close",
        refresh: false
      });
    });
  },
  methods: {
    fetchData() {
      //    this.item = this.$route.params
      this.item = JSON.parse(this.$route.query.item);

      this.$root.loadingClose();
    },
    readyFlag() {
      console.log("this.item.id", this.item.id);
      this.productid = this.$route.query.productId || "2001";
      this.token = this.$route.query.token;
      api.user.message
        .ready({
          messageId: this.item.id, //站内信id
          productId: 2001,
          token: this.token
        })
        .then(res => {
          if (!helper.isSuccess(res)) return;
          console.log("已经阅读 detail" + this.item.id);
        });
    },
    setTitle() {
      this.$root.setWebAttribute({
        title: "消息详情"
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    // 导航进入该组件时调用
    // 不！能！获取组件实例 `this`
    // 因为组件实例还没被创建

    next(vm => {
      // 通过 `vm` 访问组件实例
      //vm.fetchData();
      //vm.readyFlag();
      vm.setTitle();
    });
  }
};
</script>

<style lang="scss" scoped>
.view {
  overflow: auto !important;
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
  .title {
    text-indent: 28px;
    font-size: 14px;
  }
  img {
    display: block;
    width: 100% !important;
  }
}
</style>
