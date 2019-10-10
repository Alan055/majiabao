<template lang="html">
  <scroller :head="head" :init="init">
    <div class="drawLottery " >
      <img src="./prize.png" alt="" class="prize" @click="$root.openUrl(integralUrl,{isFull: true})">
      <div class="run" >
        <img src="./horn.png" alt="" class="horn">
        <van-swipe vertical :show-indicators="false" :autoplay="2000" :touchable="false">
          <van-swipe-item>
            <div class="item"><span>134****8890   获得15积分  07-05 18:00</span></div>
          </van-swipe-item>
          <van-swipe-item>
            <div class="item"><span>134****8890   获得15积分  07-05 18:00</span></div>
          </van-swipe-item>
          <van-swipe-item>
            <div class="item"><span>134****8890   获得15积分  07-05 18:00</span></div>
          </van-swipe-item>
        </van-swipe>
      </div>

      <div class="photo"><img src="./photo.png" alt=""></div>


      <!--可用积分-->
      <div class="integral">
        <div class="box">
          <img src="./integral_icon.png" alt="">
          <span class="word">可用积分：{{26891510}}</span>
          <b class="reduce" v-if="reduce">-30</b>
        </div>
      </div>
      <!--抽奖-->
      <div class="lottery">
        <div class="led">
          <div class="box">
            <div class="item" :class="{'active':runIndex==1,'shock':runIndex==1&&resultCode==1&&shakeRotate}">
              <div class="label"><img src="./integral.png" alt=""></div>
              <div class="word">5积分</div>
            </div>
            <div class="item" :class="{'active':runIndex==2,'shock':runIndex==2&&resultCode==2&&shakeRotate}">
              <div class="label"><img src="./redBag.png" alt=""></div>
              <div class="word">10元红包</div>
            </div>
            <div class="item" :class="{'active':runIndex==3,'shock':runIndex==3&&resultCode==3&&shakeRotate}">
              <div class="label"><img src="./panda.png" alt=""></div>
              <div class="word">谢谢参与</div>
            </div>
            <div class="item" :class="{'active':runIndex==4,'shock':runIndex==4&&resultCode==4&&shakeRotate}">
              <div class="label"><img src="./integral.png" alt=""></div>
              <div class="word">20积分</div>
            </div>
            <div class="item start" :class="{'breathe':!running}" @click="!running&&startRun()">
              <div class="label">30积分一次</div>
              <div class="word">立即抽奖</div>
            </div>
            <div class="item" :class="{'active':runIndex==6,'shock':runIndex==6&&resultCode==6&&shakeRotate}">
              <div class="label"><img src="./phone.png" alt=""></div>
              <div class="word">iPhone11</div>
            </div>
            <div class="item" :class="{'active':runIndex==7,'shock':runIndex==7&&resultCode==7&&shakeRotate}">
              <div class="label"><img src="./integral.png" alt=""></div>
              <div class="word">10积分</div>
            </div>
            <div class="item" :class="{'active':runIndex==8,'shock':runIndex==8&&resultCode==8&&shakeRotate}" >
              <div class="label"><img src="./huabei.png" alt=""></div>
              <div class="word">花呗提现机</div>
            </div>
            <div class="item" :class="{'active':runIndex==9,'shock':runIndex==9&&resultCode==9&&shakeRotate}">
              <div class="label"><img src="./integral.png" alt=""></div>
              <div class="word">50积分</div>
            </div>
          </div>
        </div>

      </div>
      <!--规则-->
      <div class="rule">
        <p @click="model_rule=true">抽奖规则 <img src="./rule.png" alt=""></p>
      </div>
      <!--底部背景图-->
      <img class="bg_bottom" src="./bgBottom.png" alt="">
    </div>
    <div slot="dialog">
      <!--抽奖结果弹框-->
      <c-dialog :isShow="model_lottery" :opacity="0.67" slot="dialog">
        <div class="dialog_LotteryResult animated bounceInDown" slot="content">
          <img src="/static/images/close.png" class="close" alt="" @click="model_lottery=false">
          <div class="content" v-if="result[current_result]" :class="{'special':['e','f'].includes(current_result)}">
            <div class="icon"><img :src="result[current_result].img" alt=""></div>
            <div class="label">{{result[current_result].label}}</div>
            <div class="tips">{{result[current_result].tips}}</div>
            <div class="btn" @click="model_lottery=false,confim(current_result)">{{result[current_result].btn}}</div>
          </div>
        </div>
      </c-dialog>
      <!--规则弹框-->
      <c-dialog :isShow="model_rule" :opacity="0.67" slot="dialog">
        <div class="dialog_drawLottery animated bounceInDown" slot="content">
          <div class="title">抽奖规则</div>
          <img src="/static/images/close.png" class="close" alt="" @click="model_rule=false">
          <div class="content">
            1、在极速熊猫平台获得的积分，均可用于抽奖；<br><br>

            2、抽奖获得的积分奖品，将直接发放至用户积分账户中；<br><br>

            3、奖励可前往我的奖品中查看；<br><br>

            4、抽奖过程中若出现违规行为，奖品将不予承兑，必要时将追究法律责任；<br><br>

            5、活动最终解释权归极速熊猫所有。
          </div>
        </div>
      </c-dialog>
    </div>
  </scroller>
</template>


<script>
  import scroller from "@/components/view/view.vue";
	import cDialog from "@/components/view/dialog";
	import {swiper, swiperSlide} from "vue-awesome-swiper";

	export default {
		props: [],
		components: {cDialog, scroller, swiper, swiperSlide},
		data() {
			return {
			  // 框架的head
        head: {
          left: 'backWhite',
          title: '抽奖',
          right: [],
          border: false,
        },
        integralUrl: process.env.kingPath + "/pages/panda-staging-drawLottery/#/myPrize",
				runIndex: 1, // 抽奖中的转动背景
        runList: [1,2,3,6,9,8,7,4], // 走马灯的顺序  按灯来
        dialogList: ['d','z','b','d','z','f','d','e','d',], // 中奖的序号对应中奖的谈框
				result: {
					a: {
						img: '/static/images/lottery_a.png',
						label: '积分不足',
						tips: '记得每天签到赚积分呀',
						btn: '签到赚积分',
					},
					b: {
						img: '/static/images/lottery_a.png',
						label: '很遗憾未中奖',
						tips: '一定是抽奖姿势不对，换个姿势再来！',
						btn: '再抽一次',
					},
					c: {
						img: '/static/images/lottery_c.png',
						label: '抱歉，今日次数已用完',
						tips: '每天每人最多可抽15次',
						btn: '我知道了',
					},
					d: {
						img: '/static/images/lottery_d.png',
						label: '恭喜您获得10个积分',
						tips: '奖品已发放，在“我的奖品”中即可查看',
						btn: '立即查看',
					},
					e: {
						img: '/static/images/lottery_e.png',
						label: '恭喜您中奖了',
						tips: '花呗提现机券砸中你啦',
						btn: '立即查看',
					},
					f: {
						img: '/static/images/lottery_f.png',
						label: '恭喜您中奖了',
						tips: 'iPhone11券砸中你啦',
						btn: '立即查看',
					},
				},
				current_result: null,
				model_lottery: false, // 抽奖结果弹框
				model_rule: false, // 规则的弹框
        timer: null, // 定时器
        running: false, // 是否在动画中
				resultCode: 0, // 中奖动画的结果
				shakeRotate: false, // 是否可以开启震动效果
				reduce: false, // 减积分的动画效果  控制显示与隐藏
			};
		},
		computed: {},
		watch: {},
		methods: {

			// 操作相关

			// 弹框确定事件
			confim(v) {
				console.log(v)
			},
      // 开始走动画
      startRun(){
				this.changeIntegral()
				this.running = true  // 开启动画中
				this.lottery()
				this.timer = setInterval(()=>{
					this.findNextIndex()// 获取抽奖动画的下一个位置
          // 停止条件 当结果号码的前面N个数字 == 当前的数字时
          if(this.resultCode){
          	let index = this.runList.findIndex(e=>(e==this.resultCode))
            let cc = 6 // 提前量 提前几个号码开始停止
            if(this.runIndex == this.runList[index<cc?(index-cc+this.runList.length):(index-cc)]){
	            this.shakeRotate = true // 允许开启震动效果
	            this.slowSpeed(200) // 减速动画
	            clearInterval(this.timer) // 拿到结果  停止动画  过程：先关闭定时器，然后使用多个一次性定时去做减速效果 用递归
            }
          }
        },100)

      },
      // 获取抽奖动画的下一个位置
      findNextIndex(v){
	      let index = this.runList.findIndex(e=>(e==this.runIndex)) // 获取现在是第几个转动的位置
	      index++ // 下一个的位置
	      index == this.runList.length && (index = 0) // 如果是最后一个就到第一个去
	      this.runIndex = this.runList[index] // 获取下一个的位置
      },
      // 获取抽奖结果
			async lottery(){
				// 发送ajax
        let res = await this.$api.activity.dodraw({productId: 2001})
        debugger

        setTimeout(()=>{
	        this.resultCode = this.runList[Math.floor(Math.random()*8)] // 拿到结果
          // 因为有定时器 所有定时器那边自动关闭定时器和减速效果
        },3000)
      },
      // 停止动画的减速效果
			slowSpeed(time){
				if(this.resultCode == this.runIndex) { // 结束减速效果  禁止run  结束
					setTimeout(()=>{
						this.runInit()  //  动画的初始化
          },1500)

					return
        }
        setTimeout(()=>{
	        this.findNextIndex()
          this.slowSpeed(time+50)
        },time)
      },
      //  动画的初始化
			runInit(){
				this.running = false // 关闭抽奖中 可以重新开始抽奖
				this.resultCode = 0 // 初始化
				this.shakeRotate = false // 禁止启动震动效果
				this.reduce = false // 减分效果初始化
        // 打开对应的弹框
				this.current_result = this.dialogList[this.runIndex-1] // 赋值弹框类型
        this.model_lottery = true // 打开弹框
      },
      // 改变积分
      changeIntegral(){
        this.reduce = true // 开启减分动画
      },

      // ------分割线-------
      // ajax  请求数据


			async init(callback) {

        callback && callback()
			}
		},
		created() {
			this.init();
			this.$root.setWebAttribute({isFull: true, isTrans: true});// 隐藏原生的状态栏
		}
	};
</script>

<style lang='scss' scoped>
 /* @keyframes shakeRotate {
    0% {
       transform: translate(0px, 0px) rotate(0deg)
    }
    2% {
      transform: translate(0px, 0px) rotate(2.5deg)
    }
    4% {
      transform: translate(0px, 0px) rotate(-4.5deg)
    }
    6% {
      transform: translate(0px, 0px) rotate(2.5deg)
    }
    8% {
      transform: translate(0px, 0px) rotate(4.5deg)
    }
    10% {
      transform: translate(0px, 0px) rotate(-5.5deg)
    }
    12% {
      transform: translate(0px, 0px) rotate(-3.5deg)
    }
    14% {
      transform: translate(0px, 0px) rotate(-1.5deg)
    }
    16% {
      transform: translate(0px, 0px) rotate(-1.5deg)
    }
    18% {
      transform: translate(0px, 0px) rotate(2.5deg)
    }
    20% {
      transform: translate(0px, 0px) rotate(-0.5deg)
    }
    22% {
      transform: translate(0px, 0px) rotate(6.5deg)
    }
    24% {
      transform: translate(0px, 0px) rotate(0.5deg)
    }
    26% {
      transform: translate(0px, 0px) rotate(-5.5deg)
    }
    28% {
      transform: translate(0px, 0px) rotate(-4.5deg)
    }
    30% {
      transform: translate(0px, 0px) rotate(-1.5deg)
    }
    32% {
      transform: translate(0px, 0px) rotate(2.5deg)
    }
    34% {
      transform: translate(0px, 0px) rotate(0.5deg)
    }
    36% {
      transform: translate(0px, 0px) rotate(6.5deg)
    }
    38% {
      transform: translate(0px, 0px) rotate(-6.5deg)
    }
    40% {
      transform: translate(0px, 0px) rotate(3.5deg)
    }
    42% {
      transform: translate(0px, 0px) rotate(-4.5deg)
    }
    44% {
      transform: translate(0px, 0px) rotate(5.5deg)
    }
    46% {
      transform: translate(0px, 0px) rotate(2.5deg)
    }
    48% {
      transform: translate(0px, 0px) rotate(2.5deg)
    }
    50% {
      transform: translate(0px, 0px) rotate(5.5deg)
    }
    52% {
      transform: translate(0px, 0px) rotate(-1.5deg)
    }
    54% {
      transform: translate(0px, 0px) rotate(5.5deg)
    }
    56% {
      transform: translate(0px, 0px) rotate(-7.5deg)
    }
    58% {
      transform: translate(0px, 0px) rotate(2.5deg)
    }
    60% {
      transform: translate(0px, 0px) rotate(6.5deg)
    }
    62% {
      transform: translate(0px, 0px) rotate(1.5deg)
    }
    64% {
      transform: translate(0px, 0px) rotate(-7.5deg)
    }
    66% {
      transform: translate(0px, 0px) rotate(-2.5deg)
    }
    68% {
      transform: translate(0px, 0px) rotate(3.5deg)
    }
    70% {
      transform: translate(0px, 0px) rotate(-4.5deg)
    }
    72% {
      transform: translate(0px, 0px) rotate(2.5deg)
    }
    74% {
      transform: translate(0px, 0px) rotate(2.5deg)
    }
    76% {
      transform: translate(0px, 0px) rotate(-2.5deg)
    }
    78% {
      transform: translate(0px, 0px) rotate(-0.5deg)
    }
    80% {
      transform: translate(0px, 0px) rotate(-3.5deg)
    }
    82% {
      transform: translate(0px, 0px) rotate(5.5deg)
    }
    84% {
      transform: translate(0px, 0px) rotate(-1.5deg)
    }
    86% {
      transform: translate(0px, 0px) rotate(-1.5deg)
    }
    88% {
      transform: translate(0px, 0px) rotate(4.5deg)
    }
    90% {
      transform: translate(0px, 0px) rotate(5.5deg)
    }
    92% {
      transform: translate(0px, 0px) rotate(4.5deg)
    }
    94% {
      transform: translate(0px, 0px) rotate(-1.5deg)
    }
    96% {
      transform: translate(0px, 0px) rotate(3.5deg)
    }
    98% {
      transform: translate(0px, 0px) rotate(-7.5deg)
    }
  }
  */

 @keyframes shakeRotate {
   0%{transform: rotate(0deg);}
   25%{transform: rotate(5deg);}
   75%{transform: rotate(-5deg);}
   100%{transform: rotate(0deg);}
 }
 @keyframes breathe {
   0% {transform: scale(1)}
   30% {transform: scale(1.02)}
   75% {transform: scale(.9)}
 }
 @keyframes reduce {
   0%{bottom: -10px;opacity: 0}
   20%{opacity: 1}
   100%{bottom: 20px;opacity: 0;}
 }
 @keyframes prize {
   0%{transform: rotate(0deg);}
   25%{transform: rotate(15deg);}
   75%{transform: rotate(-15deg);}
 }
 @keyframes led {
   0%{background: url("./led2.png") no-repeat;background-size: 100% 100%}
   50%{background: url("./led2.png") no-repeat;background-size: 100% 100%}
 }
 /deep/ .mint-header{
   border: 0;
 }
 /deep/.scroller .header{
   color: transparent;
 }
  .drawLottery {
    overflow: hidden;
    background: linear-gradient(to bottom, #4b70df, #6a0fb6);
    padding-top: 56px;
    position: relative;
    .prize{
      position: absolute;
      transform-origin: center top !important;
      top: 0 ;
      right: 0;
      width: 50px;
      animation: prize 1.5s linear infinite;
      z-index: 20;
    }
    .run {
      margin: 0px auto 20px;
      width: 280px;
      height: 30px;
      background-color: rgba(47, 61, 195, .4);
      box-shadow: inset 0px -1px 0px 0px rgba(240, 248, 255, 0.23);
      border-radius: 15px;
      color: #ecd8ff;
      font-size: 12px;
      position: relative;
      .horn{
        position: absolute;
        top: 6px;
        left: 8px;
        width: 28px;
        height: 20px;
      }
      > div {
        height: 100%;
        width: 100%;
        overflow: hidden;
        >div{
          height: 100%;
          width: 100%;

        }
        .item {
          height: 100%;
          display: flex;
          justify-content: left;
          align-items: center;
          padding: 0 8px 0 35px;
        }
      }
    }
    .photo  {
      display: flex;
      justify-content: center;
      align-items: center;
      img{
        width: 265px;
        margin: 0 auto;
      }

    }
    .integral{
      padding: 0 28px;
      display: flex;
      justify-content: left;
      align-items: center;
      margin: 8px 0 0;
      .box{
        width: unset;
        height: 20px;
        background: rgba(2, 37, 153, .2);
        border-radius: 19px;
        display: flex;
        justify-content: left;
        align-items: center;
        text-overflow:ellipsis;
        white-space:nowrap;
        color: #e4ebff;
        font-size: 12px;
        padding-right: 10px;
        padding-left: 2px;
        position: relative;
        img{
          height: 18px;
          margin-right: 4px;
        }
        .reduce{
          opacity: 0;
          position: absolute;
          animation: reduce 0.9s linear ;
          right: 5px;
          bottom: -10px;
          color: rgba(204, 204, 204, 0.9);
          font-weight: 400;
        }
      }
    }
    .lottery{
      position: relative;
      z-index: 5;
      height: 385px;
      background: url("./lotteryBg1.png") no-repeat;
      background-size: 100% 100%;
      .led{
        background: url("./led1.png") no-repeat;background-size: 100% 100%;
        width: 100%;
        height: 100%;
        animation: led 0.5s linear infinite;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .box{
        width: 300px;
        height: 300px;
        padding: 6px 2px;
        margin-top: -16px;
        margin-left: -1px;
        position: relative;
        /*display: flex;*/
        /*justify-content: space-evenly;*/
        /*align-items: center;*/
        /*flex-wrap: wrap;*/
        .item{
          position: absolute;
          width: 88px;
          height: 88px;
          background-image: linear-gradient(0deg,
            #ffe8dd 0%,
            #fffdfd 100%),
          linear-gradient(
              #ffc5a2,
              #ffc5a2);
          background-blend-mode: normal,
          normal;
          box-shadow: inset 0px -8px 0px 0px
          rgba(206, 75, 8, 0.1);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #794d4d;
          font-size: 14px;
          transition: all 0.3s;
          &.active{
            background-image: linear-gradient(
                #ffeca1,
                #ffeca1),
            linear-gradient(0deg,
                #ffcdb4 0%,
                #ffe7df 100%),
            linear-gradient(
                #5752c8,
                #5752c8);
            background-blend-mode: normal,
            normal,
            normal;
            box-shadow: inset 0px -8px 0px 0px
            rgba(206, 75, 8, 0.1);
            border-radius: 16px;
          }
          &.breathe{
            animation: breathe 0.8s infinite ease-in-out 0ms;
          }
          &.shock{
            width: 94px;
            height: 94px;
            margin-left: -3px;
            margin-top: -3px;
            animation: shakeRotate 0.3s infinite linear 0ms;
          }
          .label{
            height: 54px;
            display: flex;
            justify-content: center;
            align-items: center;
            img{
              width: 54px;
            }
          }
          .word{
            margin-top: -4px;
          }
          &:nth-child(1){top: 9px;left: 9px;}
          &:nth-child(2){top: 9px;left: 106px;}
          &:nth-child(3){top: 9px;left: 203px;}
          &:nth-child(4){top: 106px;left: 9px;}
          &:nth-child(5){top: 106px;left: 106px;}
          &:nth-child(6){top: 106px;left: 203px;}
          &:nth-child(7){top: 203px;left: 9px;}
          &:nth-child(8){top: 203px;left: 106px;}
          &:nth-child(9){top: 203px;left: 203px;}
          &:nth-child(6) img{
            width: unset  !important;
            height: 80%;
          }
          &:nth-child(5){
            background: url("./startBg.png") no-repeat;
            background-size: 100% 100%;
            .label{
              height: unset;
              color: #ffcebe;
              font-size: 15px;
              margin-bottom: 10px;
            }
            .word{
              font-size: 18px;
              color: #fff;
            }
          }
        }
      }
    }
    .rule{
      position: relative;
      z-index: 5;
      display: flex;
      justify-content: center;
      align-items: center;
      p{
        font-size: 14px;
        color: #fff8f5;
        margin-bottom: 38px;
        img{
          width: 6px;
          margin-left: 4px;
        }
      }
    }
    .bg_bottom{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      z-index: 2;
    }
  }


  .dialog_drawLottery, .dialog_LotteryResult {
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

    .content {
      padding: 20px 20px 30px;
      height: 280px;
      overflow: auto;
      &.special{
        padding-top: 100px;
        .icon{
          position: absolute;
          width: 100%;
          height: 120px;
          top: 0;
          border-radius: 8px 8px 0 0 ;
          overflow: hidden;
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
      .icon {
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 86px;
          height: 76px;
        }
      }

      .label {
        text-align: center;
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin-top: 10px;
      }

      .tips {
        text-align: center;
        font-size: 14px;
        color: #666;
        margin: 10px 0 20px;
      }

      .btn {
        margin: 0 auto;
        width: 190px;
        height: 40px;
        background-image: linear-gradient(90deg,
          #ff5a00 0%,
          #ffae00 100%);
        box-shadow: 0px 2px 10px 0px rgba(224, 74, 0, 0.42);
        border-radius: 20px;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 15px;
      }
    }

    /deep/ .close {
      position: absolute;
      right: 10px;
      top: 10px;
      width: 24px;
      height: 24px;
      z-index: 10;
    }
  }

  .dialog_LotteryResult {
    width: 270px !important;

    .content {
      padding-left: 0;
      padding-right: 0;
    }
  }
</style>
