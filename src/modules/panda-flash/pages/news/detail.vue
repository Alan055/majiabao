<template lang="html">
  <div class="home-page-detail view c-view">
    <div class="c-view-content">
      <div class="title">{{item.title}}</div>
        <div class="nav">
          <div class="left">时间：{{item.createtime}}</div>
          <!-- <div class="right">阅读：{{item.through > 100000 ? '10万+' : item.through}}人</div> -->
        </div>
        <div class="content" v-html="item.content"></div>
    </div>
    <div class="copyright-bottom">
        <p>【版权声明】本文为网络转载文章，若有权属异议请联系我们删稿。您可以通过“{{appName2}}-在线客服”与我们取得联系。</p>
    </div>
  </div>
</template>

<script>
    import axios from 'axios'
    import api from "@/services/api";
    import util from "@/utils";
    import helper from "@/utils/helper";
    import AppBridge from "@/services/AppBridge.js";

  export default {
    data() {
        return {
            detailId: util.getParams("id") || '',
            item: {
                title: '',
                source: '',
                releasetime: '',
                content: ''
            }
        }
    },
    mixins: [require('../../mixins').default],
    methods: {
        getInfomationDetail() {
            if(!this.detailId) return
            api.mxk.getInformationDetails({
                id: this.detailId
            }).then(res => {
                if (!helper.isSuccess(res)) return;
                if(res.data){
                    this.item = res.data;
                }
            });
        }
    },
    created () {
        this.getInfomationDetail()
    },
    mounted () {

    },
    onBack() {
        AppBridge.activityView({
            type: "close"
        });
        AppBridge.notify({tag: 'refresh'})
    },
    filters: {
    }
  }
</script>

<style lang="scss" scoped>
.home-page-detail {
  padding-bottom: 82px;
  .c-view-content {
    padding: 0 16px;
  }

  .title {
    font-family: PingFangSC-Medium;
    padding: 12px 16px;
    font-size: 18px;
    color: #333;
    letter-spacing: 0.12px;
    text-align: center;
  }

  .nav {
    display: flex;
    color: #999;
    padding: 16px 0;
    justify-content: space-between;
  }
  .content {
    color: #666;
    text-align: justify;
    line-height: 22px;
    letter-spacing: 1px;
  }
  .copyright-bottom {
    position: absolute;
    bottom: 24px;
    border-radius: 4px;
    padding: 0 16px;
    p {
        background: #F5F5F5;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        padding: 6px;
        color: #999999;
        letter-spacing: 0;
    }
  }
}

</style>
