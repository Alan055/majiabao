<template lang="html">
  <scroller :head="head" :init="init">

    <div class="integral" >
      <div class="integral_top">
        <div class="card">
          <div class="top"><span>当前可使用积分</span><span class="ask" @click="integral_modal=true">?</span></div>
          <div class="cell">
            <div class="left">
              <span>{{integralUsable}}</span>
            </div>
            <div class="right" @click="jumpCheck()">
              <span>签到赚取积分</span>
            </div>
          </div>
          <div class="bottom">{{overdueDescribe}}</div>
        </div>
        <div class="img"><img src="./light.png" alt=""></div>
        <div class="info">
          <div class="item">
            <span class="score">{{totalpoints}}</span>
            <span class="label">历史累计积分</span>
          </div>
          <div class="item">
            <span class="score">{{usedpoints}}</span>
            <span class="label">消耗积分</span>
          </div>
          <div class="item">
            <span class="score">{{outdatepoints}}</span>
            <span class="label">过期积分</span>
          </div>
        </div>
      </div>

      <div class="listBox">
        <div class="title">积分明细</div>
        <div v-for="(v,i) in list" :key="i" class="item van-hairline--bottom" v-if="list.length">
          <div class="left">
            <span class="label">{{v.usedescribe}}</span>
            <span class="date">{{v.createtime}}</span>
          </div>
          <div class="right" :class="{reduce:v.type!=1}">{{v.type==1?"+":"-"}}{{v.amount}}</div>
        </div>
        <div v-if="list.length==0" class="noList">
          <div class="img">
            <img src="./noList.png" alt="">
          </div>
          <div class="des">暂时没有记录，可去签到获取积分</div>
          <div class="btn" @click="jumpCheck()">签到赚取积分</div>
        </div>

      </div>

    </div>

    <c-dialog :isShow="integral_modal" :opacity="0.67" slot="dialog">
      <div class="dialog_drawLottery" slot="content">
        <div class="title">积分说明</div>
        <img src="/static/images/close.png" class="close" alt="" @click="integral_modal=false">
        <div class="content" v-html="ruleMessage"></div>
      </div>
    </c-dialog>

  </scroller>



</template>


<script>
	import scroller from "@/components/view/view.vue";
	import cDialog from "@/components/view/dialog";

	export default {
		props: [],
		components: {scroller,cDialog},
		data() {
			return {
        // 框架的head
        head: {
          left: 'backWhite',
          title: '我的积分',
          right: [],
          border: false,
          bg: '#000',
        },

        ruleMessage: '', // 积分规则文案
        integralUsable: 0, // 可用积分
				overdueDescribe: 0, // 快要过期的积分 文案
				totalpoints: 0, // 历史累计积分
				usedpoints: 0, // 消耗积分
				outdatepoints: 0, // 过期积分
				list: [], // 积分明细
				pageSize: 10, // 一页显示的长度
				pageNumber: 1, // 当前第几页
        total: 0, // 后台明细总长度

				checkInUrl: 'http://www.baidu.com', // 签到地址


				integral_modal: false, // 弹框
			};
		},
		computed: {},
		watch: {},
		methods: {
			openModel(){
				Dialog.confirm({
					title: '积分说明',
					className: 'integral_dialog',
					message: this.ruleMessage,
					showConfirmButton: false,
					cancelButtonText: 'x',
					closeOnClickOverlay: true,
				}).then(() => {
				}).catch(() => {
				});
      },
      // 跳转到签到
      jumpCheck(){
				this.$root.openUrl(this.checkInUrl)
      },

      // ----ajax-----
			// 抽奖规则数据获取
			async getRulesData(){
				let res = await this.$api.activity.queryPointsRule({productId: 2001})
        if(res.code == 200){
          let arr = res.data.map(e=>(e.key+'、' + e.value)) // 拼接字符串
          this.ruleMessage = arr.join('<br><br>')
        }else{
        	console.log(res.msg)
        }
			},
      // 查询积分信息  总体的
      async getIntegral(){
	      let res = await this.$api.activity.queryMyPoints({productId: 2001})
	      if(res.code == 200){
	      	this.overdueDescribe = res.data.overdueDescribe
          if(res.data.pointsTotal){
	          this.integralUsable = res.data.pointsTotal.availablepoints
	          this.totalpoints = res.data.pointsTotal.totalpoints
	          this.usedpoints = res.data.pointsTotal.usedpoints
	          this.outdatepoints = res.data.pointsTotal.outdatepoints
          }
	      }else{
		      console.log(res.msg)
	      }
      },
      // 查询积分明细
      async getIntegralList(){
	      let res = await this.$api.activity.queryPointsDetail({productId: 2001,pageSize: this.pageSize,pageNumber:this.pageNumber,token:this.$route.query.token})
	      if(res.code == 200){
          this.list = res.data.list
          this.total = res.data.total
	      }else{
		      console.log(res.msg)
	      }
      },


		 	async init(cb) {
				try {
					await this.getRulesData() // 抽奖规则数据获取
					await this.getIntegral() // 积分信息  总体的
					await this.getIntegralList() // 查询积分明细
				} catch (e) {
          throw e
				} finally {
					cb && cb() // 这个是页面下拉刷新的回调  一定要写的
				}
			}
		},
		created() {
			this.$root.setWebAttribute({isFull: true,isTrans: true});// 隐藏原生的状态栏
			this.init();
		}
	};
</script>

<style lang='scss' scoped>
  /deep/ .mint-header{
    border: 0;
  }
  /deep/ .header-content{
    color: #fff !important;
  }
  .integral {
    .integral_top {
      height: 336px;
      padding: 0 26px;
      background: url("./bg.png") no-repeat;
      background-size: cover;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      position: relative;

      .card {
        background: url("./cardBg.png") no-repeat;
        background-size: cover;
        width: 100%;
        height: 164px;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding: 0 16px;
        .top {
          display: flex;
          justify-content: left;
          align-items: center;
          font-size: 14px;
          color: #202B4B;
          .ask {
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            border: 1px solid #202B4B;
            line-height: 14px;
            width: 16px;
            height: 16px;
            margin-left: 8px;
          }
        }

        .cell {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin: 5px 0 18px;

          .left {
            span {
              font-size: 36px;
              color: #FFFFFF;
            }
          }

          .right {
            span {
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 0 12px;
              background: #FFFFFF;
              box-shadow: 0 2px 11px 0 #8186A3;
              border-radius: 16px;
              font-size: 14px;
              color: #202B4B;
              height: 32px;
            }
          }
        }

        .bottom {
          display: flex;
          justify-content: left;
          align-items: center;

          span {
            display: flex;
            justify-content: left;
            align-items: center;
          }
        }
      }

      .img {
        position: absolute;
        width: calc(100% - 52px);
        bottom: 76px;
        height: 18px;

        img {
          height: 100%;
          width: 100%;
        }
      }

      .info {
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;

        .item {
          width: 34%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          .score {
            font-size: 14px;
            color: #FFFFFF;
            margin-bottom: 5px;
          }

          .label {
            font-size: 12px;
            color: #DFE0E8;
          }
        }

      }
    }
    .listBox {
      padding: 0 16px;

      .title {
        display: flex;
        justify-content: left;
        align-items: center;
        font-weight: bold;
        font-size: 18px;
        color: #333333;
        height: 48px;
      }
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 48px;
        .left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          span {
            display: flex;
            justify-content: left;
            align-items: center;
          }
          .label{
            font-size: 14px;
            color: #333333;
            margin-bottom: 6px;
          }
          .date{
            font-size: 12px;
            color: #999999;
          }
        }
        .right{
          font-size: 16px;
          color: #F5A623;
          &.reduce{
            color: #333;
          }
        }
      }
      .noList{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 260px;
        .img{
          img{
            width: 120px;
          }
        }
        .des{
          font-size: 14px;
          color: #999999;
          margin-bottom: 30px;
        }
        .btn{
          display: flex;
          justify-content: center;
          align-items: center;
          background: #4E67FF;
          box-shadow: 0 2px 20px 0 rgba(78,103,255,0.30);
          border-radius: 20px;
          width: 222px;
          height: 40px;
          font-size: 16px;
          color: #FFFFFF;
        }
      }
    }
  }
  .dialog_drawLottery{
    position: relative;
    width: 310px !important;
    background: #FFFFFF;
    border-radius: 8px;
    padding-top: 20px;
    .title {
      font-weight: 600;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      font-size: 18px;
      color: #333333;
    }
    .content{
      padding: 20px 20px 30px;
      height: 200px;
      overflow: auto;
    }
    /deep/ .close{
      position: absolute;
      right: 16px;
      top: 16px;
      width: 24px;
      height: 24px;
    }
  }
</style>
