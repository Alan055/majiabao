<template>
    <scroller :head="head" :init="init">
      <div class="myPrize"  v-if="list.length">
        <div class="item  van-hairline--bottom" v-for="(v,i) in list" :key="i" >
          <div class="left">
            <div class="top"><b>{{v.attr.mygoods_prizeName}}</b><span>{{v.statusDescribe}}</span></div>
            <div class="bottom"><span>{{v.createtime}}</span></div>
          </div>
          <div class="right">
            <div class="top"><span @click="jump(v)">{{v.fromremark}}</span></div>
            <div class="bottom"><span>{{v.attr.mygoods_text}}</span></div>
          </div>
        </div>
      </div>
      <div v-else class="noList">
        <div class="img">
          <img src="./../integral/noList.png" alt="">
        </div>
        <div class="des">暂时没有记录，可去签到获取积分</div>
        <div class="btn">签到赚取积分</div>
      </div>
    </scroller>

</template>

<script>
	import scroller from "@/components/view/view.vue";
	export default {
		components: {scroller},
		data() {
			return {
        // 框架的head
        head: {
          left: 'back',
          title: '我的奖励',
          right: [],
          border: true,
          bg: '#000',
          type: 1,
        },

				list: [], // 数据列表
				pageSize: 10, // 一页显示的长度
				pageNumber: 1, // 当前第几页
				total: 0, // 后台数据总长度

				isLoading: false,
      }
		},
		computed: {},
		watch: {},
		methods: {

			// 跳转
			jump(v) {
				if (v.jumptype == 1) { // h5内置打开
					this.$root.openUrl({title: v.mygoods_prizeName, url: v.mygoods_jumpurl})
				} else if (v.jumptype == 2) {
					this.$AppBridge.activityView({
						type: "open",
						url: v.mygoods_jumpurl,
						isFull: false,
						title: v.mygoods_prizeName,
						open_inner: false,
					});
				}
			},

			async findList(){
				let res = await this.$api.activity.queryMyGoods({productId: 2001,pageSize: this.pageSize,pageNumber:this.pageNumber,token:this.$route.query.token})
				if(res.code == 200){
					this.list = res.data.list
					this.total = res.data.total
				}else{
					console.log(res.msg)
				}
      },


			async init(cb) {
				try {
					await this.findList() // 查询奖励的数据
				} catch (e) {
					throw e
				} finally {
					cb && cb() // 这个是页面下拉刷新的回调  一定要写的
				}
			}
		},
		created() {
			this.init()
		},
		mounted() {
		},
	}
</script>

<style lang='scss' scoped>
  /deep/ .header {
    color: #333;
    background: #fff;
  }
  /deep/ .scroll{
    background: #f8f8f8;
  }
  /deep/ section{
    height: 100%;
    .scroll-content{
      height: 100%;
    }
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
