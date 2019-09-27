<template>
  <PullRefresh class="view" v-model="isLoading" @refresh="init">
      <div class="myPrize"  v-if="prizeList.length">
        <div class="item  van-hairline--bottom" v-for="(v,i) in prizeList" :key="i" >
          <div class="left">
            <div class="top"><b>40积分</b><span>已发放</span></div>
            <div class="bottom"><span>219-08-18</span></div>
          </div>
          <div class="right">
            <div class="top"><span>积分抽奖</span></div>
            <div class="bottom"><span>查看</span></div>
          </div>
        </div>
      </div>
      <div v-else class="noList" slot="content">
        <div class="img">
          <img src="./../integral/noList.png" alt="">
        </div>
        <div class="des">暂时没有记录，可去签到获取积分</div>
        <div class="btn">签到赚取积分</div>
      </div>
  </PullRefresh>

</template>

<script>
	import scroller from "@/components/view/view1_4.vue";
	import { PullRefresh } from 'vant';
	export default {
		components: {scroller,PullRefresh},
		data() {
			return {
				isLoading: false,
				prizeList: [1,2,3],
      }
		},
		computed: {},
		watch: {},
		methods: {

			init() {
				setTimeout(() => {
					console.log("456")
					this.isLoading = false;
				}, 500);
			}
		},
		created() {
			this.$root.setTitle('我的奖励')
		},
		mounted() {
		},
	}
</script>

<style lang='scss' scoped>
  /deep/ .dw-scroll{

    height: 100% !important;
  }
  /deep/ .header {
    background: #fff !important;
    .mint-header-title {
      color: #333;
    }
  }
  .view{
    background: #F8F8F8;
  }
  .myPrize{
    background: #fff;
    padding-left: 16px;
    .item{

      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 76px;
      padding-right: 16px;
      &:last-child:after{
        display: none;
      }
      .left{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        .top{
          margin-bottom: 10px;
          display: flex;
          justify-content: left;
          align-items: center;
          b{
            font-size: 16px;
            color: #333333;
          }
          span{
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 0 6px;
            font-size: 12px;
            color: #999999;
            margin-left: 6px;
          }
        }
        .bottom{
          font-size: 12px;
          color: #999999;
        }
      }
      .right{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
        .top{
          margin-bottom: 10px;
          font-size: 14px;
          color: #666666;
        }
        .bottom{
          font-size: 12px;
          color: #999999;
        }
      }
    }

  }
  .noList {
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    .img {
      img {
        width: 120px;
      }
    }
  }


</style>
