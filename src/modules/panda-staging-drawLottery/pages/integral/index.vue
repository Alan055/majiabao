<template lang="html">
  <scroller :init="init" title="我的积分">

    <div class="integral" slot="content">
      <div class="integral_top">
        <div class="card">
          <div class="top"><span>当前可使用积分</span><span class="ask" @click="integral_modal=true">?</span></div>
          <div class="cell">
            <div class="left">
              <span>28990</span>
            </div>
            <div class="right">
              <span>签到赚取积分</span>
            </div>
          </div>
          <div class="bottom">230积分将于2018年12月31日过期</div>
        </div>
        <div class="img"><img src="./light.png" alt=""></div>
        <div class="info">
          <div class="item">
            <span class="score">280680</span>
            <span class="label">历史累计积分</span>
          </div>
          <div class="item">
            <span class="score">280680</span>
            <span class="label">历史累计积分</span>
          </div>
          <div class="item">
            <span class="score">280680</span>
            <span class="label">历史累计积分</span>
          </div>
        </div>
      </div>

      <div class="listBox">
        <div class="title">积分明细</div>
        <div v-for="(v,i) in list" :key="i" class="item van-hairline--bottom" v-if="list.length">
          <div class="left">
            <span class="label">签到</span>
            <span class="date">2019-08-18 18:18</span>
          </div>
          <div class="right">+50</div>
        </div>
        <div v-if="list.length==0" class="noList">
          <div class="img">
            <img src="./noList.png" alt="">
          </div>
          <div class="des">暂时没有记录，可去签到获取积分</div>
          <div class="btn">签到赚取积分</div>
        </div>

      </div>

    </div>

    <c-dialog :isShow="integral_modal" :opacity="0.67" slot="dialog">
      <div class="dialog_drawLottery" slot="content">
        <div class="title">积分说明</div>
        <img src="/static/images/close.png" class="close" alt="" @click="integral_modal=false">
        <div class="content">
          1、可用积分可用于抽奖、还可用来兑换卡券等商品，积分商城功能敬请期待；<br><br>

          2、用户可通过每日签到获取积分奖励；<br><br>

          3、积分的有效期最长2年，最短1年，即从获得积分开始至次年12月31日，逾期作废。
        </div>
      </div>
    </c-dialog>

  </scroller>



</template>


<script>
	import scroller from "@/components/view/view1_4.vue";
	import cDialog from "@/components/view/dialog";

	export default {
		props: [],
		components: {scroller,cDialog},
		data() {
			return {
				list: [{},{},{},{},{},{},{},{},{},{},{}],

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
					message: '1、可用积分可用于抽奖、还可用来兑换卡券等商品，积分商城功能敬请期待；\n' +
						'\n' +
						'2、用户可通过每日签到获取积分奖励；\n' +
						'\n' +
						'3、积分的有效期最长2年，最短1年，即从获得积分开始至次年12月31日，逾期作废。',
					showConfirmButton: false,
					cancelButtonText: 'x',
					closeOnClickOverlay: true,
				}).then(() => {
				}).catch(() => {
				});
      },

			init() {
				console.log("123")
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
    min-height: 256px;
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
