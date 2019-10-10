<template lang="html">
  <div class="view">
    <div class="userProtocol cell-list c-section">

      <mt-cell v-for="(v,i) in list" :key="i" :title="`《${v.name}》`" v-if="v.url" is-link class="van-hairline--bottom"
               @click.native="jumpPrivacyUrl(v.url)"></mt-cell>
      <mt-cell v-for="(v,i) in agreementList" :key="i" :title="v.title.includes('《')?v.title:`《${v.title}》`" v-if="v.id!='201807042001000300'" is-link class="van-hairline--bottom"
               @click.native="jumpPrivacyUrl(v.link)"></mt-cell>
    </div>
  </div>
</template>


<script>
	export default {
		// 官网对象  是否展示隐私协议
		props: ["showPrivacy", "showVersion"],
		data() {
			return {
				list: [], // 极速熊猫的协议
				agreementList: [], // 资方的协议
			};
		},
		computed: {},
		watch: {},
		methods: {
			// 拿到隐私协议的连接
			getProtocol() {
				this.$AppBridge.getInitData(res => {
					if (res.data) {
						console.log('所有的协议：', res.data[this.$route.params.fundproductids?'xm_bill_agreements':'xm_agreements'])
						this.list = res.data[this.$route.params.fundproductids?'xm_bill_agreements':'xm_agreements'] || []
					}
				});
			},
      // 获取资方的协议
			findData(){
        this.$api.agreement.queryAgreement({
	        type: '3', // type  1-开户 2-提现 3-账单
	        fundproductids: this.$route.params.fundproductids, // 资金方ID
	        orderid: this.$route.params.orderid // orderId 账单ID
        }).then((res) => {
	        if(res.code == 200) {
            this.agreementList = res.data
	        }
        })
      },
			// 跳转到隐私协议
			jumpPrivacyUrl(url) {
				url && this.$root.openUrl({url: url, title: this.appName});
			},
			init() {
				if(this.$route.query.agreement){ // 数据就在url上
					this.list = JSON.parse(decodeURIComponent(location.href.split("?agreement=")[1]))
        }else{ // 调用伪协议获取数据
					this.getProtocol(); // 拿到所有的协议
					if(this.$route.params.fundproductids){ // 判断是不是从账单进来的
						this.findData() // 获取资方的协议
					}
        }
			}
		},
		created() {
			this.init();
			this.$root.setTitle("用户协议") // 修改状态栏的名称
		}
	};
</script>

<style lang='scss' scoped>
  .userProtocol {
    /deep/ .mint-cell-wrapper{
      border: none;
    }
  }
</style>
