<template>
  <div class="view ">
    <div class="c-layer" v-show="headerRgba == 0">
      <div class="pull-down-bg" :style='{height: activeHeight}'></div>
    </div>
    <c-header ref="transparentHeader" class="header header-content " :title="title" :show="true"
              :style="`color: rgba(255, 255, 255, ${headerOpacity}); background: rgba(0, 0, 0, ${headerRgba}); opacity: ${headerOpacity}; `" >
     <span slot="left" class="posi-l" >
                <c-icon :type="backType" @click.native="$root.closeWindow()"/>
            </span>
    </c-header>
    <div class="dw-scroll "
         id="dwScroll"
         :class="{'down':(state===0), 'up':(state==1), refresh:(state===2), touch: touching}"
         @touchstart="touchStart($event)"
         @touchmove="touchMove($event)"
         @touchcancel="touchEnd($event)"
         @scroll.passive="onScrollFn($event)"
         @touchend="touchEnd($event)"
    >


      <section class="inner" id="innerSection" :style="{ transform: 'translate3d(0, ' + top + 'px, 0)' }">
        <header class="pull-refresh pull-refresh-home" id="pullRefresh">
          <slot name="pull-refresh">
            <img class="down-tip" :src="`/static/images/loading${1}.png`" alt="" v-show="top<80">
            <img class="down-tip" :src="`/static/images/loading${2}.png`" alt="" v-show="top>=80&&top<90">
            <img class="down-tip" :src="`/static/images/loading${3}.png`" alt="" v-show="top>=90&&top<100">
            <img class="down-tip" :src="`/static/images/loading${4}.png`" alt="" v-show="top>=100&&top<110">
            <img class="down-tip" :src="`/static/images/loading${5}.png`" alt="" v-show="top>=110&&top<120">
            <img class="down-tip" :src="`/static/images/loading${6}.png`" alt="" v-show="top>=120">
            <img class="up-tip" :src="`/static/images/loading${6}.png`" alt="" v-show="top>=120">
            <img class="refresh-tip" src="/static/images/loading.gif" alt="">
          </slot>
        </header>


        <slot name="content"></slot>

        <footer class="load-more">
          <slot name="load-more">
            <span class="loading-more">加载中...</span>
          </slot>
        </footer>
      </section>
    </div>

    <slot name="dialog"></slot>


  </div>
</template>
<script>
	import util from "@/utils";
	import _ from "lodash";

	/**
	 * @description
	 *
	 * 思路：
	 *
	 *  touchstart 记录开始位置
	 *  touchmove 判断上拉、下拉（暂时只用到了下拉）
	 *  touchend 根据下拉、上拉位置判断是否达到下拉刷新、上拉加载更多
	 *
	 *  @scroll.passive="onScrollFn($event)" 记录屏幕滚动，用来处理上滑时header rgba控制（沿用早期效果）
	 *  touchmove 会触发onPulling，控制下拉时header opacity（参考目前淘宝效果）
	 *
	 *  正在刷新时触发refresh，此时有一个回弹效果
	 */
	export default {
		props: {
			backType: {
				//默认高度
				type: String,
				default: 'backWhite'
			},
			title: {
				//默认高度
				type: String,
				default: ''
			},
			offset: {
				//默认高度
				type: Number,
				default: 120
			},
			maxScrollerHeight: {
				//滑动最大高度
				type: Number,
				default: 160
			},
			power: {
				//滑动和下拉的像素比例
				type: Number,
				default: 2
			},
			bounce: {
				//回弹时高度
				type: Number
			},
			enableRefresh: {
				//是否开启刷新
				type: Boolean,
				default: true
			},
			enableInfinite: {
				//是否开启上拉加载更多
				type: Boolean,
				default: false
			},
			// onScroll: {
			// 	//（向上）滑动中
			// 	type: Function
			// },
			// onPulling: {
			// 	//（向下）下拉刷新中
			// 	type: Function
			// },
			// refreshFinsh: {
			// 	// 刷新完成后回调
			// 	type: Function
			// },
			// onRefresh: {
			// 	//刷新方法
			// 	type: Function,
			// 	default: undefined,
			// 	required: false
			// },
			onInfinite: {
				//上拉加载更多方法
				type: Function,
				default: undefined,
				require: false
			},
			init: {
				//上拉加载更多方法
				type: Function,
				default: undefined,
				require: true,
			},
		},
		data() {
			return {
				top: 0, //距离屏幕顶部的距离
				state: 0, //0初始化状态，1已达到松开手可以刷新状态，2正在执行刷新
				startX: 0,
				startY: 0,
				isUp: 0, //0初始化，1下滑，2上拉
				touching: false, //滑动中
				infiniteLoading: false, //上拉加载更多中
				loadingFlag: false, //显示是否加载中
				touchTime: 0, //记录滑动开始时间
				count: 0, //刷新次数- 用来做频率控制

				headerOpacity: 1,
				headerRgba: 0,
				activeHeight: "30vh",


			};
		},
		methods: {

			//刷新
			onRefresh(cb) {
				//this.initHomeData();
				this.headerOpacity = 0;
				this.init();
				setTimeout(() => {
					this.headerOpacity = 1;
					cb && cb();

				}, 1000);
			},
			//top 距离顶部的像素点
			onPulling(top) {
				if (top && top > 20) {
					this.headerOpacity = 0;
				}
			},
			//滚动中
			onScroll(e) {
				let scrollTop = document.getElementById('dwScroll').scrollTop;
				// let scrollTop = e.target.scrollTop;
				if (scrollTop <= 100) {
					scrollTop<0 && (scrollTop = 0)
					this.headerRgba = scrollTop / 100;
				} else {
					this.headerRgba = 1;
					this.headerOpacity = 1; //解决正在刷新时又上滑透明度不还原问题
				}
			},
			//刷新完成
			refreshFinsh() {
				setTimeout(() => {
					this.headerOpacity = 1;
				}, 200);
			},


			touchStart(e) {
				if (this.state != 0) {
					return;
				}
				this.startY = Number(e.targetTouches[0].pageY);
				this.startX = Number(e.targetTouches[0].pageX);
				this.startScroll = this.$el.scrollTop || 0;
				this.touching = true;
			},

			touchMove: _.throttle(function(e) {
        // 如果没有滚动条没有到达最高点  就不触发下拉刷新的组件
				if(document.getElementById('dwScroll').scrollTop > 0) return
				var y = Number(e.targetTouches[0].pageY);
				if (y - this.startY > 0) {
					//下滑
					this.isUp = 1;
					if (!this.enableRefresh) {
						return;
					}
					if (!this.touching || this.top >= this.maxScrollerHeight) {//大于maxScrollerHeight不让继续滑动
						e.preventDefault();
						return;
					}
					this.onPulling(this.top)
					// this.$emit("onPulling", this.top);
					if (this.top >= this.offset) { // 超过可刷新的高度  就执行刷新
						this.state = 1;
					} else {
						this.state = 0;
					}

					//计算距离屏幕顶部距离
					let diff = e.targetTouches[0].pageY - this.startY - this.startScroll;
					if (diff > 0) {
						e.preventDefault();
					}

					this.top = (Math.pow(diff, 0.8) + (this.state === 2 ? this.offset : 0)) * this.power;
				} else {
					//上拉
					this.isUp = 2;
					if (this.enableInfinite) {
						this.$el.querySelector(".load-more").style.display = "block";
					}
				}
			}, 10),

			touchEnd(e) {
				this.touching = false;
				if (this.isUp == 1) {
					if (this.state === 2) {
						// 正在执行刷新
						return;
					}

					if (this.top >= this.offset) {
						// 达到了刷新条件 --> 执行刷新
						this.refresh();
					} else {
						// 取消刷新
						this.refreshDone();
					}
				} else {
					if (!this.enableInfinite || this.infiniteLoading) {
						return;
					}
					let outerHeight = this.$el.clientHeight;
					let innerHeight = this.$el.querySelector(".inner").clientHeight;
					let scrollTop = this.$el.scrollTop;
					let ptrHeight = this.enableRefresh
						? this.$el.querySelector(".pull-refresh").clientHeight
						: 0;
					let infiniteHeight = this.$el.querySelector(".load-more").clientHeight;
					let bottom = innerHeight - outerHeight - scrollTop - ptrHeight;
					if (bottom < infiniteHeight) this.infinite();
				}
			},
			//执行刷新
			refresh() {
				this.state = 2;
				//回弹效果
				// this.top = this.bounce > 0 ? this.bounce : this.offset;

        this.$nextTick(()=>{
	        this.top = document.querySelectorAll('.refresh-tip')[0].height;
        })


				setTimeout(() => {
					this.onRefresh(this.refreshDone);
				}, 500);
			},
			//刷新完成
			refreshDone(type) {
				this.state = 0;
				this.top = 0;

				this.$emit("refreshFinsh", type);
			},
			//执行上拉加载更多
			infinite() {
				this.infiniteLoading = true;
				this.onInfinite(this.infiniteDone);
			},
			//上拉加载更多完成
			infiniteDone(txt) {
				this.infiniteLoading = false;
				if (txt) {
					this.$el.querySelector(".loading-more").innerHTML = txt;
					this.$el.querySelector(".load-more").style.display = "block";
					this.enableInfinite = false;
				} else {
					this.$el.querySelector(".load-more").style.display = "none";
				}
			},

			onScrollFn: _.throttle(function(e) {
				// this.$emit("onScroll", e);
        this.onScroll(e)
			}, 50)
		}
	};
</script>
<style lang="scss" scoped>
  @-webkit-keyframes loadingRotate {
    0% {
      -webkit-transform: rotateZ(0deg);
    }
    100% {
      -webkit-transform: rotateZ(360deg);
    }
  }

  .header{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 99;
  }
  .pull-refresh-home {
    .down-tip,
    .refresh-tip,
    .up-tip {
      display: none;
      color: black;

      i {
        position: relative;
        top: 3px;
        display: inline-block;
        height: 16px;
        width: 16px;
        margin-right: 6px;
      }
    }

    .down-tip {
      i {
        background: url("~@/assets/images/scroller/down-gay.png") no-repeat !important;
        background-size: cover !important;
      }
    }
    .up-tip {
      i {
        background: url("~@/assets/images/scroller/up-gay.png") no-repeat !important;
        background-size: cover !important;
      }
    }
    .refresh-tip {
      z-index: 2;
      height: 6rem;
      i {
        animation: loadingRotate 0.5s linear infinite;
        background: url("~@/assets/images/scroller/loading-gay.png") no-repeat !important;
        background-size: cover !important;
      }
    }
  }
  .dw-scroll {
    position: relative;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    height: auto;
    margin: 0 !important;
    padding: 0px !important;
    -webkit-overflow-scrolling: touch;

    .inner {
      margin-top: -6rem;
      width: 100%;
      height: auto;
      -webkit-overflow-scrolling: touch;
      transition-duration: 300ms;
      overflow: hidden;
      .pull-refresh {
        position: relative;
        left: 0;
        top: 0;
        z-index: 2;
        width: 100%;
        height: 6rem;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        color: white;
      }
      .load-more {
        padding: 10px 0;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        display: none;
      }
      .nullData {
        //暂无更多数据样式
        color: #999;
        padding: 10px 0;
        text-align: center;
      }
      .down-tip,
      .refresh-tip,
      .up-tip {
        display: none;

        i {
          position: relative;
          top: 3px;
          display: inline-block;
          height: 16px;
          width: 16px;
          margin-right: 6px;
        }
      }

      .down-tip {
        i {
          background: url("~@/assets/images/scroller/down-white.png") no-repeat;
          background-size: 100% 100%;
        }
      }
      .up-tip {
        i {
          background: url("~@/assets/images/scroller/up-white.png") no-repeat;
          background-size: 100% 100%;
        }
      }
      .refresh-tip {
        z-index: 2;

        i {
          animation: loadingRotate 0.5s linear infinite;
          background: url("~@/assets/images/scroller/loading-white.png") no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }

  .dw-scroll.touch .inner {
    transition-duration: 0;
  }

  .dw-scroll.down .down-tip {
    display: block;
  }

  .dw-scroll.up .up-tip {
    display: block;
  }

  .dw-scroll.refresh .refresh-tip {
    display: block;
  }
</style>
