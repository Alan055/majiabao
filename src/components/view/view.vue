<template>
  <!--做一个页面框架 包含下啦刷新，页头等-->
  <!--两种模式 1、页头跟着一起下拉刷新 2、页头固定在顶部  下方的页面进行下拉刷新-->
  <!--1、头部跟着一起下拉时，需要隐藏头部，下拉完成了再显示-->
  <!--2、页头固定时，下方的dom应该和顶部有明显的分层-->
  <div class="scroller view">
    <!--页头 按道理说 每个页面应该都有页头 也不排除原生页头+h5页面的组合形式-->
    <div class="header header-content" :class="{'van-hairline--bottom':head.border}" :style="`padding-top:${statusH}px;height:${44+statusH}px;`" v-show="moveDistance==0">
      <div class="header-left"><c-icon :type="head.left" @click.native="$root.closeWindow()"/></div>
      <div class="header-center"><span>{{head.title}}</span></div>
      <div class="header-right">
        <span v-for="(v,i) in head.right" :key="i" @click="jump(v)"><img :src="v.img" alt=""></span>
      </div>
    </div>
    <div class="scroll" ref="scroll"
         @touchstart="touchStart($event)"
         @touchmove="touchMove($event)"
         @touchcancel="touchEnd($event)"
         @scroll.passive="onScrollFn($event)"
         @touchend="touchEnd($event)"
    >
      <section  :style="{ transform: 'translate3d(0, ' + moveDistance + 'px, 0)' }" :class="{'tran':touchEndStatus}">
        <div class="pull-refresh" ref="pull" >
          下拉刷新
        </div>
        <div class="scroll-content"></div>
        <slot ></slot>
      </section>
    </div>

  </div>
</template>

<script>

	export default {
		props: {
			head: {
				type: Object,
				default: {
					show: true, // 是否展示页头
					left: 'back', // 左边返回键的icon图标类型
					title: '', // 标题 样式由自组件通过css的deep去修改
					right: [], // 页头右边的菜单栏 可能是红包、签到、消息、客服等等、这里同样也要加上点击跳转的url 增加一个功能就是判断是否需要登录
          border: true, // 是否有下边框
				}
			}
		},
		data() {
			return {
				moveDistance: 0, // 记录可滑动dom（class=scroll） 距离顶部的距离 也就是下拉的高度
				startY: 0, // 滚动开始时  记录手指按下去 在屏幕的y坐标
				startScroll: 0, // 滚动开始时  滚动条到上方的距离
        endY: 0, // 滚动中 实时记录手指滑动 在屏幕的y坐标
        touchEndStatus: false, //
      }
		},
		computed: {
			statusH(){ // 状态栏的高度
				return this.$root.isApp?this.$root.statusHeight:0
      },
      pullHeight(){
	      return this.$refs.pull.offsetHeight
      }
    },
		watch: {},
		methods: {
			// 拖动开始
			touchStart(e){
				this.startY = Number(e.targetTouches[0].pageY) // 记录拖动开始的y坐标
        this.startScroll = this.$refs.scroll.scrollTop || 0;
      },
      // 拖动中 拖动结束后的惯性效果是记录不到的 只有ios是有惯性效果  安卓是没有的  所以处理惯性效果就用 @scroll.passive
      // 其次，这里的判断只能通过手指按住拖动的位移量来拿到需要下拉的距离 因为安卓的scrollTop最小是0 不能小于0
      // 如何拿到偏移量 就要拿到开始和当前的手指所在位置的x位置
			touchMove(e){
        // 如果没有滚动条没有到达最高点  就不触发下拉刷新的组件
				if(this.$refs.scroll.scrollTop > 0) return
        this.endY = Number(e.targetTouches[0].pageY) // 记录拖动重的y坐标
        let diff = this.endY - this.startY // 偏移量
        if(diff < 0){ // 向上拖动中

        }else{ // 向下拖动中  也就是可能在下拉刷新
        	// 记录距离
          if(diff - this.startScroll > this.pullHeight){ // 超过下拉dom的高度了
          	console.log(9999)
          	this.moveDistance = this.pullHeight
	          this.$refs.scroll.scrollTop = 0 // 滚动条高度设置为0
	          e.preventDefault()
	          return  // 这里有bug
          }else{
	          this.moveDistance = diff - this.startScroll
          }
        }
      },
      // 拖动结束  dom上绑定两个事件是为了做兼容
			touchEnd(e){
        this.startY = 0
        this.endY = 0
				this.touchEndStatus = true // 开启回弹效果
				this.moveDistance = 0
        setTimeout(()=>{this.touchEndStatus=false},300) // 关闭回弹效果
      },

      // 滚动中 会记录拖动结束后的惯性过程 直到停止滚动 这个专门用来设置header的下拉逐渐变色的效果
			onScrollFn(e){
				if(this.startY == 0 ){
					let dis = this.$refs.scroll.scrollTop // 拿到滚动条到顶部的距离  小于0说明可以展示下拉dom
					// if(dis<0 && Math.abs(dis)>this.$refs.pull.offsetHeight) return; // 超过了就返回
					this.moveDistance = dis < 0 ? Math.abs(dis) : 0 // 大于0 就不显示下拉dom 但是这里要做限制 不能超过下拉dom的高度
        }
      },

      // 页面跳转  这里做了是否需要登录校验
			jump(v){
				if(v.needLogin){
          this.$root.jumpToLogin()
        }else{
					this.$root.openUrl(v.jumpUrl)
        }
      }
    },
		created() {
		},
		mounted() {
		},
	}
</script>

<style lang='scss' scoped>
  .scroller{

    .header{
      position: absolute;
      top: 0;
      left: 0;
      height: 44px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0px 16px 0;
      z-index: 99;
      >div{
        width: 30%;
        font-size: 18px;
        color: #333333;
        display: flex;
        align-items: center;
        img{
          width: 16px;
        }
      }
      .header-left{
        justify-content: flex-start;
      }
      .header-center{
        justify-content: center;
      }
      .header-right{
        justify-content: flex-end;
        >span{
          margin-left: 8px;
        }
      }
    }
    .scroll{
      background: red;
      height: 100%;
      overflow: auto;
      >section{
        &.tran{
          transition-duration: 300ms;
        }
        .pull-refresh{
          margin-top: -6rem;
          height: 6rem;
          background: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .scroll-content{
          padding-top: 64px;
        }
      }

    }
  }
</style>
