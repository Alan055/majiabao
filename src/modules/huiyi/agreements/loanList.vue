<!--我的账单 -》 借款协议-->
<template lang="html">
<div class="view-agreements c-bg-gray">
  <div class="c-view-content">
    <div class="list agreementCSS">
      <mt-cell
        v-for="(item, key) in agreementList" :key="'agreementKEY_' + item.id"
        :title="item.title"
        @click.native="handleAgreementClick(item)"
      ></mt-cell>
    </div>
  </div>
</div>
</template>

<script>
import api from '@/services/api'
import appBridge from '@/services/AppBridge'
import {Toast} from '@/utils/helper'
import util from "@/utils/index.js"
import {mapGetters, mapMutations} from 'vuex'

export default {
  name: 'agreements',
  data () {
    return {
      agreementList: []
    }
  },
  computed: {
    ...mapGetters([]),
  },
  methods: {
    ...mapMutations([]),
          //单个协议点击
    handleAgreementClick (items){
      let  orderid  =  util.getParams()['orderid'];  
      let url = items.link;
      let endUrl = 'agreementid=' + items.id + '&fundproductid=' + items.productid + '&service=' + items.type + '&orderid=' + this.$route.params.orderid + '&fromPath=myself';

      //判断是否是xingye
      if(items.link.indexOf('lizhi') > -1){
        endUrl += '&frompage=xyapply'
      }else{
        endUrl += '&frompage=grzx'
      }

      if(url.indexOf('?') > -1){
        url += '&' + endUrl 
      }else{
        url += '?' + endUrl;
      }
      let openConifg = {
          "type":"open",
          "url": url,
          "isFull":"false",
          "title":"协议",
      }

      // 添加 埋点
      this.sinaAds.click({
        currEvent: this.adsInfo.agreements.loanList.clickGoLink,
        currEventParams: {
          url: items.link,
          title: '协议'
        }
      });

      //pdf 校验
      // 告知客户端打开什么类型的文件
      // 匹配pdf类型文件
      if (/(.pdf)$/i.test(items.link)) {
        openConifg.tag = 'jfpdf';
      }
      appBridge.activityView(openConifg);
    },

    // 打开链接
    openLink (link,title) {

      this.sinaAds.click({
        currEvent: this.adsInfo.agreements.loanList.clickGoLink,
        currEventParams: {
          url: link,
          title: '协议'
        }
      });

      let openConifg = {
        url: link,
        title: title,
        isFull: false,
      };

      // 告知客户端打开什么类型的文件
      // 匹配pdf类型文件
      if (/(.pdf)$/i.test(link)) {
        openConifg.tag = 'jfpdf';
      }

      // 打开页面
      if (appBridge.isApp){
        appBridge.activityView(openConifg);
      } else {
        location.href = link;
      }


    },

    fetchData () {

      let _this = this;

      api.agreement.queryAgreement({

        // type  1-开户 2-提现 3-账单
        type: '3',

        // 资金方ID
        fundproductids: this.$route.params.fundproductids,

        // orderId 账单ID
        orderid: this.$route.params.orderid

      }).then((res) => {

        /*if(!helper.isSuccess(res)) return*/
        if(Number(res.code) !== 200) {
          Toast('抱歉,当前访问用户过多,请稍后重试!');
          return false;
        }

        this.$root.loadingClose();

        if (res.data) {

          _this.agreementList = res.data;

        }

      }).finally();

    }

  },
  components: {

  },
  watch: {

  },
  created() {
    this.fetchData();
  },
  mounted() {
   // DOM ready
   console.log("传参成功")
  },
}
</script>

<style lang="scss" scoped>
.list{
  margin-top: 8px;
}
</style>
<style lang="scss" >
  .view-agreements {
    .agreementCSS {
      .mint-cell-title {
        width: 90%;
        line-height: 1.4;
        overflow-x:hidden;
        overflow-y: visible;
        text-overflow:ellipsis;
        white-space:nowrap
      }
    }
  }
</style>
