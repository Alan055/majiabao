<template lang="html">
<div class="view-help-detail">

  <div class="c-view-content question-detail ">
    <div class="c-bg-white">
      <p class="title c-font-l c-border-b">{{data.helptitle | filtersDwdk}}</p>
      <div class="content c-border-b c-font-m" v-html="$options.filters.filtersDwdk(data.helpcontent)">

      </div>
      <!-- <p class="feedback c-font-s" :class="{'dirty': !!data.feedbackState}">是否对您有帮助：
        <span class="button c-font-m" :class="{'red': data.feedbackState == 1}" @click="inUse">
          <img class="c-icon icon_c" src="~@/assets/images/my/help/ar_ca@2x.png" alt="red" v-if="data.feedbackState == 1">
          <img class="c-icon icon_c" src="~@/assets/images/my/help/ar_cu@2x.png" alt="normal" v-else>
          有用
        </span>
        <span class="button c-font-m" :class="{'red': data.feedbackState == 2}" @click="noUse">
          <img class="c-icon icon_c" src="~@/assets/images/my/help/as_ca@2x.png" alt="red" v-if="data.feedbackState == 2">
          <img class="c-icon icon_c" src="~@/assets/images/my/help/as_cu@2x.png" alt="normal" v-else>
          无用
        </span>
      </p> -->
    </div>

  </div>
  <actionsheet :actions="actions" v-model="sheetVisible" :selectItem='selectItem'></actionsheet>
  <!-- <mt-actionsheet :actions="actions" cancelText='' v-model="sheetVisible"></mt-actionsheet> -->
</div>
</template>

<script>
import Actionsheet from '@/components/common/actionsheet'
import api from "@/services/api";
import helper from "@/utils/helper";
import util from "@/utils";
import appBridge from "@/services/AppBridge";
import {Toast} from '@/utils/helper';

export default {
  components: {
    'actionsheet': Actionsheet
  },
  data() {
    return {
      data: {
        feedbackState: 0
      },
      sheetVisible: false,
      actions: {
        title:'',
        list : [],
        closeIcon: true
      },
      onlineServiceUrl: ''
    }
  },
  computed: {

  },
  methods: {
    fetchData() {
      // let id = this.$route.query.helpId
      // api.user.help.detail({id}).then(res => {
      //   if(!helper.isSuccess(res)) return
      //   this.data = res.data
      // })
      this.$root.getRouteData().then(res => {
        this.$root.loadingClose();

        this.data = util.extend({feedbackState: 0}, res)
      })
    },
    inUse() {
      if(this.data.feedbackState) return

      this.sinaAds.click({
        currEvent: this.adsInfo.help.detail.clickInUse,
        currEventParams: {
          title: this.data.helptitle
        }
      });

      this.data.feedbackState = 1
      this.$toast({message:'感谢您的评价',duration:1000});

      this.feedback('有用', 1)
    },
    noUse() {
      if(this.data.feedbackState) return

      this.sinaAds.click({
        currEvent: this.adsInfo.help.detail.clickNoUse,
        currEventParams: {
          title: this.data.helptitle
        }
      });

      this.sheetVisible = true
    },
    selectItem : function(_item,_index){

      this.sinaAds.click({
        currEvent: this.adsInfo.help.detail.clickNoUseList,
        currEventParams: {
          content: this.actions.list[_index].name
        }
      });

      if (this.actions.list[_index].name === '其他原因') {

        if (!util.getParams('fromUserId')) {
          appBridge.goNative({
            pkg: 'login',
          })
        } else {
          this.goFeedback();
        }

      } else {

        this.$toast({message:'感谢您的反馈',duration:1000});
        this.data.feedbackState = 2
        this.feedback(_item.name, 0)

      }

    },
    feedback(content, status) {
      console.log(this.data.feedbackState);
      let {helpid} = this.data
      let {helptypeid} = this.data.helptype
      api.user.help.saveHelpRel({
        // 问题反馈状态 0 无效 1 有效
        status,
        helptagid: content,
        helpid
      })
    },
    getOnlineService () {
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
    },
    gotoOnlineService (){

      // 埋点
      this.sinaAds.click(this.adsInfo.help.detail.clickOnlineServer);

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
    bindEvent () {
      return;
      // 设置右上角事件属性
      let path = location.href.split('/pages')[0];
      this.$root.setWebTitleAttribute({
        btnType: 'img',
        btnVal: path + ('/static/icon/my/help/ap_at@2x.png')
      }, this.gotoOnlineService)

      // 问题反馈提交后 接受事件 函数
      let _this = this;
      window.receiverMsg = (res) => {
        if (res.data.tag === 'noUse') {
          _this.data.feedbackState = 2
        }

        if (res.data.tag === 'login') {
          this.goFeedback();
        }
      };
    },
    // 其他
    goFeedback () {
      let path = location.href.split('/pages')[0];
      let {helpid} = this.data
      let {helptypeid} = this.data.helptype
      this.$root.openUrl({
        url: path + `/pages/my#/feedback/${helpid}/${helptypeid}`,
        title: '意见反馈'
      })
    }
  },
  mounted() {
    this.actions.list = [{
          name: '内容太复杂，没看懂'
        },
        {
          name: '内容有错误'
        },
        {
          name: '看完继续操作以后未能解决问题'
        },
        {
          name: '对该项功能不满意'
        },
        {
          name: '其他原因'
        }];
  },
  beforeRouteEnter(to, from, next) {
		// 导航进入该组件时调用
		// 不！能！获取组件实例 `this`
		// 因为组件实例还没被创建

		next(vm => {
			// 通过 `vm` 访问组件实例
      // 获取接口数据
      vm.fetchData()
		});
	},
  created() {
    // 绑定事件
    //this.bindEvent();
    // 获取客服地址
    //this.getOnlineService();

  },
  filters:{
    filtersDwdk: (str) => {
        return str;
　　　  //return str.replace(/极速熊猫/ig, "极速熊猫")
　　}
　}
}
</script>

<style lang="scss" scoped>
.view-help-detail{

  background: #f4f4f4;
  .question-detail{
    margin-top: 8px;
    .title{padding: 12px 16px; font-weight: bold; padding-left: 0; margin-left: 16px;}
    .content{padding: 16px;color: #333; padding-left: 0; margin-left: 16px;}
    .feedback{
      padding: 16px;color: #999;
      .button{
        margin:0 40px 0 20px;color: #333;
        .c-icon{
          margin-right: 4px;
        }
      }
      &.dirty{
        .button{
          opacity: 0.5;
          &.red{
            color: $red;
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
