<template>
  <!--做一个页面框架 包含下啦刷新，页头等-->
  <!--两种模式 1、页头跟着一起下拉刷新 2、页头固定在顶部  下方的页面进行下拉刷新-->
  <!--1、头部跟着一起下拉时，需要隐藏头部，下拉完成了再显示  0-->
  <!--2、页头固定时，下方的dom应该和顶部有明显的分层   1-->
  <div class="scroller view">
    <!--页头 按道理说 每个页面应该都有页头 也不排除原生页头+h5页面的组合形式-->
    <div class="header header-content" :class="{'van-hairline--bottom':head.border}"
         :style="`padding-top:${statusH}px;height:${44+statusH}px;${!head.type&&headerOpacity!=0 ? `background:rgba(0,0,0,${headerOpacity});color:rgba(255,255,255,${headerOpacity});`:''}`"
         v-show="head.type?true:moveDistance==0"
         @touchmove="head.type==1&&touchMoveHeader($event)"
    >
      <div class="header-left" >
        <c-icon :type="head.left" @click.native="$root.closeWindow()" v-if="head.left" />
      </div>
      <div class="header-center"><span>{{head.title}}</span></div>
      <div class="header-right">
        <span v-for="(v,i) in head.right" :key="i" @click="jump(v)"><img :src="v.img" alt=""></span>
      </div>
    </div>
    <div class="scroll" ref="scroll"
         :class="{'down':(state===0), 'up':(state==1), refresh:(state===2), touch: touching}"
         @touchstart="touchStart($event)"
         @touchmove="touchMove($event)"
         @touchcancel="touchEnd($event)"
         @scroll.passive="onScrollFn($event)"
         @touchend="touchEnd($event)"
    >
      <section :style="{ transform: 'translate3d(0, ' + moveDistance + 'px, 0)' }"
               :class="{'tran':touchEndStatus,'over':state}">
        <div class="pull-refresh" ref="pull" :style="`top:${head.type==1?44+statusH:0}px`" :class="{type1:head.type==1}">
          <div class="down-tip">
            <!--            <img :src="`/static/images/loading${1}.png`" alt="" v-show="moveDistance<30">-->
            <!--            <img :src="`/static/images/loading${2}.png`" alt="" v-show="moveDistance>=30&&moveDistance<40">-->
            <!--            <img :src="`/static/images/loading${3}.png`" alt="" v-show="moveDistance>=40&&moveDistance<50">-->
            <!--            <img :src="`/static/images/loading${4}.png`" alt="" v-show="moveDistance>=50&&moveDistance<60">-->
            <!--            <img :src="`/static/images/loading${5}.png`" alt="" v-show="moveDistance>=60&&moveDistance<70">-->
            <!--            <img :src="`/static/images/loading${6}.png`" alt="" v-show="moveDistance>=70">-->
            <img :src="`/static/images/loading${1}.png`" alt="" v-show="moveDistance<80">
            <img :src="`/static/images/loading${2}.png`" alt="" v-show="moveDistance>=80&&moveDistance<90">
            <img :src="`/static/images/loading${3}.png`" alt="" v-show="moveDistance>=90&&moveDistance<100">
            <img :src="`/static/images/loading${4}.png`" alt="" v-show="moveDistance>=100&&moveDistance<110">
            <img :src="`/static/images/loading${5}.png`" alt="" v-show="moveDistance>=110&&moveDistance<120">
            <img :src="`/static/images/loading${6}.png`" alt="" v-show="moveDistance>=120">
          </div>
          <div class="up-tip">
            <img :src="`/static/images/loading${6}.png`" alt="">
          </div>
          <div class="refresh-tip">
            <img src="/static/images/loading.gif" alt="">
          </div>
        </div>
        <div class="scroll-content" :class="{'noApp':!statusH,'type0':!head.type}">
          <slot></slot>
        </div>

      </section>
    </div>
    <slot name="dialog"></slot>
  </div>
</template>

<script>
  import _ from "lodash";

  export default {
    props: {
      head: {
        type: Object,
        default: {
          show: true, // 是否展示页头
          left: 'back', // 左边返回键的icon图标类型
          title: '', // 标题 样式由自组件通过css的deep去修改
          right: [ // 页头右边的菜单栏 可能是红包、签到、消息、客服等等、这里同样也要加上点击跳转的url 增加一个功能就是判断是否需要登录
            // {img: '/static/images/close.png', needLogin: true, jumpUrl: 'http://www.baidu.com'},
          ],
          border: true, // 是否有下边框
          type: 0, // 这个是默认 代表下拉刷新dom在整个页面的最上方  1下拉刷新dom在header下面
        }
      },
      init: {
        // type: Function,
      }
    },
    data() {
      return {
        headerOpacity: 0, // 头部的颜色渐变  只有在type=0的时候才会渐变
        moveDistance: 0, // 记录可滑动dom（class=scroll） 距离顶部的距离 也就是下拉的高度
        startY: 0, // 滚动开始时  记录手指按下去 在屏幕的y坐标
        startScroll: 0, // 滚动开始时  滚动条到上方的距离
        endY: 0, // 滚动中 实时记录手指滑动 在屏幕的y坐标
        touchEndStatus: false, // 是否是松手时的状态
        touching: false, // 是否在滑动中
        state: 0, // 0初始化状态，1已达到松开手可以刷新状态，2正在执行刷新
      }
    },
    computed: {
      statusH() { // 状态栏的高度
        return this.$root.isApp ? this.$root.statusHeight : 0
      },
      pullHeight() { // 获取下拉dom的高度
        return this.$refs.pull.offsetHeight
      }
    },
    watch: {},
    methods: {
      // 拖动开始
      touchStart(e) {
        if (this.state != 0) {
          return;
        }
        this.startY = Number(e.targetTouches[0].pageY) // 记录拖动开始的y坐标
        this.startScroll = this.$refs.scroll.scrollTop || 0;
      },
      // 拖动中 拖动结束后的惯性效果是记录不到的 只有ios是有惯性效果  安卓是没有的  所以处理惯性效果就用 @scroll.passive
      // 其次，这里的判断只能通过手指按住拖动的位移量来拿到需要下拉的距离 因为安卓的scrollTop最小是0 不能小于0
      // 如何拿到偏移量 就要拿到开始和当前的手指所在位置的x位置
      touchMove: _.throttle(function (e) {
        // 如果没有滚动条没有到达最高点  就不触发下拉刷新的组件
        if (this.$refs.scroll.scrollTop > 0) return;
        this.endY = Number(e.targetTouches[0].pageY) // 记录拖动重的y坐标
        let diff = this.endY - this.startY // 偏移量
        if (diff < 0) { // 向上拖动中

        } else { // 向下拖动中  也就是可能在下拉刷新
          e.preventDefault()
          // 记录距离
          if (diff - this.startScroll > this.pullHeight) { // 超过下拉dom的高度了

            // console.log(e.target.innerHTML)
            this.state = 1;
            this.$refs.scroll.scrollTop = 0 // 滚动条高度设置为0
            this.moveDistance = this.pullHeight
            return  // 这里有bug
          } else {
            this.state = 0;
            this.moveDistance = Math.floor(diff - this.startScroll)
            if (this.moveDistance > 80) {
              // debugger
            }
          }
        }
      }, 10),
      // 拖动结束  dom上绑定两个事件是为了做兼容
      touchEnd(e) {
        // 判断是否需要刷新
        if (this.state == 1) {
          this.state = 2
          this.init(this.viewInit)
        }else{
          this.viewInit()
        }
      },
      touchMoveHeader(e){
        e.preventDefault()
      },

      viewInit(){
        this.startY = 0
        this.endY = 0
        this.touchEndStatus = true // 开启回弹效果
        this.moveDistance = 0
        setTimeout(() => {
          this.touchEndStatus = false
          this.state = 0;
        }, 300) // 关闭回弹效果
      },

      // 滚动中 会记录拖动结束后的惯性过程 直到停止滚动 这个专门用来设置header的下拉逐渐变色的效果
      onScrollFn(e) {
        // 如果高度大于等于下拉dom的高度时  就直接是1的透明度
        this.headerOpacity = this.$refs.scroll.scrollTop >= this.pullHeight ? 1: Math.floor(this.$refs.scroll.scrollTop*10/this.pullHeight)/10

        if (this.startY == 0) { // 这里是在松手后才执行  即是页面的惯性滑动效果
          let dis = this.$refs.scroll.scrollTop // 拿到滚动条到顶部的距离  小于0说明可以展示下拉dom
          // if(dis<0 && Math.abs(dis)>this.$refs.pull.offsetHeight) return; // 超过了就返回
          this.moveDistance = dis < 0 ? Math.abs(dis) : 0 // 大于0 就不显示下拉dom 但是这里要做限制 不能超过下拉dom的高度
        }
      },

      // 页面跳转  这里做了是否需要登录校验
      jump(v) {
        if (v.needLogin) {
          this.$root.jumpToLogin()
        } else {
          this.$root.openUrl(v.jumpUrl)
        }
      }
    },
    created() {
	    this.$root.setWebAttribute({isFull: true});// 隐藏原生的状态栏
    },
    mounted() {
    },
  }
</script>

<style lang='scss' scoped>
  .scroller {
    .header {
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
      > div {
        width: 30%;
        font-size: 18px;
        display: flex;
        align-items: center;
        img {
          width: 16px;
        }
      }
      .component-dialog{

      }
      .header-left {
        justify-content: flex-start;
      }

      .header-center {
        justify-content: center;
      }

      .header-right {
        justify-content: flex-end;

        > span {
          margin-left: 8px;
        }
      }
    }

    .scroll {
      height: 100%;
      overflow: auto;

      > section {
        -webkit-overflow-scrolling: touch;

        &.tran {
          transition-duration: 300ms;
        }

        .pull-refresh {
          margin-top: -9rem;
          height: 9rem;
          background: #fff;
          display: flex;
          justify-content: center;
          align-items: center;

          .down-tip,
          .refresh-tip,
          .up-tip {
            display: none;
            justify-content: center;
            align-content: flex-end;
            padding-top: 15px;
            img {
              height: 100%;
            }
          }
          .refresh-tip{
            padding-top: 0 ;
            align-content: center;
          }
        }
        .type1{
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
        }
        .scroll-content {
          padding-top: 64px;

          &.noApp {
            padding-top: 44px;
          }

          &.type0 {
            padding-top: 0;
          }
        }
      }

    }
  }

  .scroll.touch > section .pull-refresh section {
    transition-duration: 0 !important;
  }

  .scroll.down > section .pull-refresh .down-tip {
    display: flex;
  }

  .scroll.up > section .pull-refresh .up-tip {
    display: flex;
  }

  .scroll.refresh > section .pull-refresh .refresh-tip {
    display: flex;
  }</style>
