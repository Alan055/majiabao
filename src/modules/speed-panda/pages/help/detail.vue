<template lang="html">
  <div class="home-page-detail view c-view">
    <div class="c-view-content">
      <div class="title">{{item.title}}</div>
        <div class="content" v-html="item.content"></div>
    </div>
  </div>
</template>

<script>
    import axios from 'axios'
    import api from "@/services/api";
    import util from "@/utils";
    import helper from "@/utils/helper";
    ;

  export default {
    data() {
        return {
            item: {
                title: '',
                content: ''
            },
            data: [
                {
                    id: 1,
                    title: '逾期会有哪些风险？',
                    content: '尊敬的极速熊猫用户，您好！</br><p style="text-indent: 28px;">极速熊猫在为您提供借款服务的同时，希望帮助您更好的管理信用，避免造成失信风险。</p><p style="text-indent: 28px;">良好的还款记录将有助于您继续申请金融服务，不良的逾期记录将影响信用贷款、申请信用卡等，同时也会影响您的个人出行，如购买机票、火车票、出境游玩、固定资产投资，甚至承担刑事或民事责任。</p><p style="text-indent: 28px;">衷心希望大家维护好个人良好的信用记录，宜人贷将竭力为您提供优质、安全、便捷的金融服务，为您的信用生活保驾护航！</p>'
                },
                {
                    id: 2,
                    title: '审核时间有多长？',
                    content: '一般一个工作日审核完毕，审核完成后，会以短信通知到您。'
                },
                {
                    id: 3,
                    title: '极速熊猫的申请条件？',
                    content: '1.年龄区间：20-60周岁；</br>2.有稳定的收入来源；</br>3.新疆西藏港澳台暂未开通；'
                },
                {
                    id: 4,
                    title: '为什么身份证无法扫描成功？',
                    content: '建议退出APP账户和应用后台，找个光线好的地方进行扫描。若还是无法提交，请联系在线客服。'
                },
                {
                    id: 5,
                    title: '审核时间有多长？',
                    content: '一般一个工作日审核完毕，审核完成后，会以短信通知到您。'
                },
                {
                    id: 6,
                    title: '最高可申请多少额度？',
                    content: '额度申请范围为：1000-200000元。根据你的个人综合信用评估，每个人的额度可能有所不同。'
                },
                {
                    id: 7,
                    title: '为什么我无法登陆？',
                    content: '请先确保你的账号密码是否输入正确。若出现闪退，卡顿，网络等问题，建议退出APP重试。'
                },
                {
                    id: 8,
                    title: '为什么扣款成功APP还是现实逾期？',
                    content: '扣款成功到状态出现有一定时差，正常情况扣款成功24小时会更新状态。如有问题请联系在线客服。'
                }
            ]
        }
    },
    mixins: [require('../../mixins').default],
    methods: {
        
    },
    activated () {
        this.$root.getRouteData().then(params => {
            console.log('params.id', params.id)
            this.item = this.data.filter( (d) => {
                return d.id == params.id
            })[0];
            console.log('this.item', this.item)
        })
    },
    mounted () {

    },
    onBack() {
        this.$AppBridge.activityView({
            type: "close"
        });
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
    border-top: 8px solid #F8F8F8;
  }

  .title {
    padding: 12px 0;
    font-size: 18px;
    color: #444444;
    letter-spacing: 0.12px;
    text-align: left;
  }

  .nav {
    display: flex;
    color: #999;
    padding: 16px 0;
    justify-content: space-between;
  }
  .content {
    font-size: 14px;
    color: #797979;
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
