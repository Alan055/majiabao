<template lang="html">
<div class="view-help-list">


  <div class="c-view-content" @scroll="pageControl.scroll($event)">

    <ul class="question-list c-list">
      <mt-loadmore class="load-more-wrap c-relative"
                   :top-method="refresh"
                   ref="loadmore"
                   :style="{minHeight: minHeight}"
      >

        <li v-for="item in pageControl.dataList"
            v-sinaAds="{
              currEvent: adsInfo.help.list.clickQuestionList,
              currEventParams: {
                title: item.helptitle
              }
            }"
            @click="$root.nextTitle='问题详情';$router.push({name: 'helpDetail', params: item})"
            class="question-item c-bg-white c-font-l c-border-b"
        >{{item.helptitle | filtersDwdk}}</li>

      </mt-loadmore>
    </ul>

  </div>
  <!--
  <dl class="c-bottom-button" @click="gotoOnline"
      v-sinaAds="adsInfo.help.list.clickOnlineServer"
  >
    <dd>
      <img class="c-icon icon_a" src="~@/assets/images/my/help/ap_ap@2x.png" alt="">
      咨询在线客服
    </dd>
  </dl>
  -->

</div>
</template>

<script>
import api from "@/services/api";
import helper from "@/utils/helper";
import appBridge from "@/services/AppBridge";
import {Toast} from '@/utils/helper';
import PageControl from "@/utils/PageControl";
import listState from '@/components/common/listState'

export default {
  data() {
    return {
      list: [],
      onlineServiceUrl: '',// 在线客服地址
      // 数据列表
      pageControl: new PageControl({
        api: api.user.help.list,
        pageSize: '15',
        keyPath: ['data']
      }),
      minHeight: 0,
      requestFlag: false,
    }
  },
  filters:{
    filtersDwdk: (str) => {
      return str;
　　　  //return str.replace(/大王贷款/ig, "大王贷款")
　　}
　},
  methods: {
    // 前往在线客服
    gotoOnline : function(){
      // 判断是否在App内部打开
      if(appBridge.isApp) {

        // 判断是否拿到了值
        if (this.onlineServiceUrl !== '') {

          appBridge.activityView({
            isFull: false,
            title: '在线客服',
            url: this.onlineServiceUrl,
          });

        } else {
          Toast('抱歉，当前访问用户过多，请稍后重试！');
        }

      } else{
        window.location = this.onlineServiceUrl
      }

    },

    // 下拉刷新触发回调
    refresh() {
      this.pageControl.refresh()
    },

    // 动态计算最小(一屏)高度
    calcHeight (type = '') {
      let domHeight = this.$refs['loadmore' + type].$el.offsetHeight;
      let domOffsetTop = document.getElementsByClassName('question-list')[0].offsetTop;
      let btmBtnOffsetTop  =document.getElementsByClassName('c-bottom-button')[0].offsetHeight;

      let windowHeight =  document.body.clientHeight;

      if (domOffsetTop + domHeight + btmBtnOffsetTop < windowHeight) {
        this['minHeight' + type] = windowHeight - domOffsetTop -btmBtnOffsetTop + 'px';
      }
    },

    fetchData() {

      api.user.help.list({
        pageIndex: 0,
        pageSize: 10,
        helptypeid: this.$route.query.typeId
      }).then(res => {
        if(!helper.isSuccess(res)) return

        this.$root.loadingClose();
        this.list = res.data
      })

      // 获取在线客服地址
      appBridge.getVisitUrl({
        pageName: 'ONLINESERVICE'
      },res => {

        if(!res || !res.data) return
        let data = res.data
        if(typeof data == 'string') {
          data = JSON.parse(data)
        }

        if (data && data.url) {
          this.onlineServiceUrl = data.url;
        }

      })

    }
  },
  beforeRouteEnter(to, from, next) {
		// 导航进入该组件时调用
		// 不！能！获取组件实例 `this`
		// 因为组件实例还没被创建

		next(vm => {
			// 通过 `vm` 访问组件实例
      vm.fetchData()

		});
	},
  created () {

    // 监听刷新结束后回调
    this.pageControl.onRefresh = () => {

      this.requestFlag = true;
      this.$nextTick(() => {
        this.$refs.loadmore.onTopLoaded();
        this.calcHeight();
      })
    }

    // 监听加载更多回调
    this.pageControl.onLoadMore = (res, path) => {
      this.calcHeight();
    }

    // 配参
    this.pageControl.getParams = () => {
      return {
        helptypeid: this.$route.query.typeId
      }
    };

    // 关闭跳金币
    this.$root.loadingClose(false);

    // 进页面先加载一次数据
    this.refresh()


  },
  components: {
    listState
  }
}
</script>

<style lang="scss" scoped>
  .view-help-list{
    background: #f4f4f4;
    .c-list{
      margin-top: 6px;
    }
    .c-list .question-item{line-height: 48px;
      padding-left: 16px;}
    .c-bottom-button dd{background: #E72427;}
  }
</style>
<style lang="scss">
  .view-help-list {
    .mint-loadmore {
      overflow: visible;
    }
    .load-more-wrap {
      padding: 0 0 40px 0;
    }

    .btm-loader-tips {
      width: 100%;
      height: 40px;
      line-height: 40px;
    }

    .mint-tab-container-item {
      width: 100vw;
    }
    .mint-tab-container, .mint-tab-container-item {
      display: flex;
    }
    .mint-tab-container-item, .c-view-content,.mint-tab-container-wrap {
      height: auto!important;
      flex: 1;
    }
  }
</style>
