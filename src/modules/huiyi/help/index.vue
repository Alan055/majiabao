<template lang="html">
<div class="view view-help">

  <!--第一期不做跑马灯
  <div class="notice c-font-m" v-if="noticeList.length && false">

    <div class="c-table-row">
      <img class="c-icon icon_c notice-icon" src="~@/assets/images/my/help/aq_cg@2x.png" alt="">

      <div class="c-flex-item notice-wrap">
        <transition-group name="fade" tag="div" class="scroll-wrap">

          <p v-for="(item, index) in noticeList" :key="item.msgcontent"
             v-if="index == currentNotice">{{item.msgcontent}} {{index}}</p>

        </transition-group>
      </div>

    </div>

  </div>
-->
  <div class="c-view-content" v-min-height>
 <!--
    <mt-swipe :auto="-1" class="cjc_swipe"
              :show-indicators="swipeList.length != 1"
    >
      <mt-swipe-item v-for="item in swipeList" :key="item.id">
        <img :src="item.adverturl" width="100%" height="100%" alt="">
      </mt-swipe-item>
    </mt-swipe>
-->



    <!--热门问题-->
    <p class="title c-font-l"><span>热门问题</span></p>

    <ul class="question-list c-list c-border-t c-bg-white c-font-l">
      <li v-for="item in questionList"
          v-sinaAds="{
            currEvent: adsInfo.help.index.clickHotQuestion,
            currEventParams: {title: item.helptitle}
          }"
          @click="
          $root.nextTitle='问题详情';
          $router.push({name: 'helpDetail', params: item})"
      >{{item.helptitle | filtersDwdk}}</li>
    </ul>


    <!--问题分类-->
    <p class="title c-font-l"><span>问题分类</span></p>
    <div class="c-flex-row icon-list c-bg-white">
      <div class="question-type-list" v-for="item in navList" :key="item.helptypeid" @click="handleTypeClick(item)">
        <img :src="calcImgUrl(item.thumbnailurl)" />
        <span>{{item.typename | filtersDwdk}}</span>
        <i class="mint-cell-allow-right"></i>
      </div>
    </div>

  </div>
  <!--在线客服
  <dl class="c-bottom-button" @click="gotoOnline"
      v-sinaAds="adsInfo.help.index.clickOnlineServer"
  >
    <dd>
      <img class="c-icon icon_a" src="~@/assets/images/my/help/ap_ap@2x.png" alt="">
      咨询在线客服
    </dd>
  </dl>-->
</div>
</template>

<script>
import api from "@/services/api";
import helper from "@/utils/helper";
import util from '@/utils'
import appBridge from "@/services/AppBridge";
import {Toast} from '@/utils/helper';

export default {
  name: 'help',
  data () {
    return {
      noticeList: [],
      swipeList : [],
      navList : [],
      questionList: [],
      currentNotice: 0,
      interval: null,
      onlineServiceUrl: '',// 在线客服地址
      isGetData : {
        typeList: false, // banner和分类信息
        hotList: false, // 热门问题
        noticeList: false // 公告
      }
    }
  },
  computed: {
    // 是否可以关闭loading页
    isCloseLoading () {
      return this.isGetData.typeList && this.isGetData.hotList && this.isGetData.noticeList;
    }
  },
  methods: {
    //格式化url地址
    calcImgUrl(url) {
      let index = url.lastIndexOf("\/");
      let start = url.substring(0, index+1);
      let end = url.substring(index, url.length);
      console.log('格式化url地址', start + 'huiyi' + end)
      return start + 'huiyi' + end;
    },
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
        window.location = this.url
      }

    },
    //问题分类
    handleTypeClick(item) {
      this.$root.nextTitle = item.typename;
      this.$router.push({name: 'helpList', query: {typeId: item.helptypeid}});
    },
    fetchData() {
      let devicetype = function() {
        let browser = util.browser.versions
        if(browser.android) {
          return 1
        }
        if(browser.ios) {
          return 2
        }
        return 0
      }()

      // banner和分类信息
      api.user.help.typeList({
        pageIndex: 0,
        pageSize: 6,
        devicetype
      }).then(res => {
        if(!helper.isSuccess(res)) return

        this.checkData('typeList');

        this.swipeList = res.data.helpbannerlist;
        this.navList = res.data.helptypelist.slice(0,6);
      })

      // 热门问题
      api.user.help.hotList({
        pageIndex: 0,
        pageSize: 10
      }).then(res => {
        if(!helper.isSuccess(res)) return

        this.checkData('hotList');

        console.log('热门问题', res.data);
        this.questionList = res.data
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

      // 公告
      api.user.help.noticeList({
        position: 1 //公告位置：1、首页底部
      }).then(res => {

        if(!helper.isSuccess(res)) return

        this.checkData('noticeList');

        this.noticeList = res.data || []
        this.currentNotice = 0
        let len = this.noticeList.length
        if(len > 1) {
          this.interval = setInterval(() => {
            this.currentNotice = this.currentNotice >= len-1 ? 0 : this.currentNotice+1
          }, 5000)
        }
      })

    },
    // 校验是否拿到所有数据
    checkData (dataType) {
      this.isGetData[dataType] = true;
      if (this.isCloseLoading) {
        this.$root.loadingClose();
      }
    },
    setTitle () {
      this.$root.setWebAttribute({
        title: '帮助中心'
      })
    }
  },
  created() {
    this.setTitle();
    this.fetchData()
  },
  destroyed() {
    clearInterval(this.interval)
  },
  filters:{
    filtersDwdk: (str) => {
      return str;
　　　  //return str.replace(/大王贷款/ig, "大王贷款")
　　}
　}

}
</script>

<style lang="scss" scoped>
.view-help{
  background: #F4F4F4;
  .notice{
    background: #E1F5FF;color: #659FFC;padding: 0 16px;
  }
  .notice-icon{
    top: 0;
  }
  .notice-wrap{
    margin-left: 8px;
    position: relative;
    p{
      height: 32px;
      line-height: 32px;
      text-align: left;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
  .scroll-wrap{
    height: 32px;
  }

  .c-view-content{

    .mint-cell {
      width: 100%;
      text-align: left;
    }

    .cjc_swipe{
      height: 120px;margin-bottom: 8px;
    }
    color: #333;
    .title{
      span{
        height: 32px;line-height: 32px;vertical-align: middle;padding-left: 16px;color: #666;font-size: 14px;
      }

    }
  }
  .icon-list{
    flex-wrap: wrap;padding: 20px 0;margin-bottom: 8px;

    div{
      width: 33.33%;
      &:nth-child(-n+3){margin-bottom: 30px;}
      img{
        display: block;margin:0 auto 6px;border-radius: 50%;
        width: 40px;
        height: 40px;
      }
    }
    .question-type-list {
      position: relative;
      width: 100%;
      margin-left: 16px;
      margin-bottom: 0 !important;
      padding-right: 16px;
      @extend %border-b;
      height: 48px;
      display: flex;
      align-items: center;


      img {
        width: 10%;
        display: inline-block;
        width: 18px;
        height: 18px;
        margin: 0 9px 0 0 !important;
      }

      span {
        width: 85%;
        display: inline-block;
        text-align: left;
        font-size: 16px;
        color: #333;
        margin-top: 2px;
      }

      i {
        width: 5%;

        &::after {
          //margin-top: 10px;
        }
      }
    }
  }
  .c-list>li{line-height: 48px;}
  .c-bottom-button dd{background: #E72427;}

  .mint-swipe-indicator{
    width: 4px;height: 4px;background: #fff;opacity: 0.5;
    &.is-active{opacity: 1;}
  }

}

.fade-enter-active, .fade-leave-active {
  transition: all .5s;
}
.fade-enter{
  opacity: 0;
  transform: translateY(100%);
}
.fade-leave-to{
  opacity: 0;
  transform: translateY(-100%);
}

</style>
